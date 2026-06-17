#!/bin/bash
# Canonical production deploy script for zarrinac.com (source of truth in git).
#
# The LIVE copy runs from /var/www/zarrinac/deploy.sh — OUTSIDE the repo on
# purpose, so the pull never rewrites the script while it is executing. After
# pulling a change to this file, sync it to the live location:
#     cp /var/www/zarrinac/app/ops/deploy.sh /var/www/zarrinac/deploy.sh
#     chmod +x /var/www/zarrinac/deploy.sh
#
# Run as the app user (reza), NOT root — root-owned .next breaks PM2.
set -e

APP_DIR="${ZARRINAC_APP_DIR:-/var/www/zarrinac/app}"
LOG_FILE="${ZARRINAC_DEPLOY_LOG:-/var/log/zarrinac-deploy.log}"

# Fall back to a user-writable log if the default isn't writable. A failing
# `tee` under `set -e` aborts the whole deploy, so never let logging be fatal.
# One-time setup for the default path: sudo touch /var/log/zarrinac-deploy.log
#                                      sudo chown reza:reza /var/log/zarrinac-deploy.log
if ! touch "$LOG_FILE" 2>/dev/null; then
  LOG_FILE="$HOME/zarrinac-deploy.log"
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

log "=== Deploy started ==="
cd "$APP_DIR"

# The legacy generated public/sitemap-0.xml can block the pull; the native
# app/sitemap.ts route is the source of truth now, so discard local changes to it.
git restore public/sitemap-0.xml 2>/dev/null || true

log "Pulling latest from GitHub..."
git pull origin main

# --- Integrity guard ---------------------------------------------------------
# Branch protection can't be enforced on a free private repo, so this is the
# backstop against a re-infection of origin/main (as happened 2026-06-11): if a
# known malware signature appears in a build-time config file, abort BEFORE
# `npm run build` can execute it. The app keeps running on its last good build.
# postcss.config.mjs is the proven injection point and is essentially static,
# so this won't false-positive in normal use.
log "Scanning build config for malware signatures..."
if grep -IlE 'createRequire\(|_\$_|\beval\(|Buffer\.from\([^)]*base64|global\.[A-Za-z_]+\s*=' \
     postcss.config.mjs next.config.ts 2>/dev/null; then
  log "!!! ABORT: suspicious code detected in build config — possible re-infection. Deploy halted."
  exit 1
fi

log "Running Zarrinac deployment preflight..."
node ops/preflight.mjs

# Full install (NOT --omit=dev): building Next.js on the server needs
# devDependencies — typescript, @tailwindcss/postcss, and dotenv (loaded by
# prisma.config.ts during the prisma generate postinstall).
log "Installing dependencies..."
npm ci

log "Running DB migrations..."
npm run db:deploy

# Bust the persisted Next cache BEFORE building. `npm run build` preserves
# .next/cache across deploys, so a stale Data Cache (internal /api/products
# fetch, revalidate 3600) and ISR full-route cache keep serving PRE-deploy
# content after the code changes — e.g. the old product order, or a media URL
# that the new normalizer would now rewrite. Clearing it forces a fresh render
# against the live DB/API on first request. (Costs webpack/image cache warmth;
# correctness of freshly-deployed content wins.)
log "Clearing Next cache (.next/cache) to avoid serving stale content..."
rm -rf .next/cache

# Ensure public/media -> live media dir symlink exists.
# Media lives outside the app at /var/www/zarrinac/media and is served to
# browsers by the Apache `Alias /media/`. But next/image's optimizer fetches a
# *relative* source (NEXT_PUBLIC_MEDIA_BASE_URL=/media) via an INTERNAL request
# to the Node server (:3000), which has no /media route — so optimized images
# 400 with "received null" unless the Node server can also resolve /media.
# Symlinking it into public/ lets the optimizer read it off disk, independent of
# host/domain (works via raw IP and the live domain alike). Idempotent.
MEDIA_LIVE="${ZARRINAC_MEDIA_DIR:-/var/www/zarrinac/media}"
if [ -d "$MEDIA_LIVE" ] && [ ! -e "$APP_DIR/public/media" ]; then
  log "Linking public/media -> $MEDIA_LIVE ..."
  ln -s "$MEDIA_LIVE" "$APP_DIR/public/media"
fi

log "Building Next.js..."
npm run build

log "Restarting PM2..."
pm2 reload ecosystem.config.cjs --update-env

log "=== Deploy complete ==="

# Post-deploy SEO regression audit against the now-live site (non-blocking,
# backgrounded so it never delays or fails the deploy). Logs to
# /var/log/zarrinac-seo-audit.log and escalates ERROR-level findings to claude -p.
if [ -x /usr/local/bin/seo-audit.sh ]; then
  log "Kicking off post-deploy SEO audit (background)..."
  (/usr/local/bin/seo-audit.sh >/dev/null 2>&1 &)
fi
