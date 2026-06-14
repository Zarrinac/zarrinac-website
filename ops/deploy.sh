#!/bin/bash
# Canonical production deploy script for zarrinac.com (source of truth in git).
#
# The LIVE copy runs from /var/www/hisense-ir/deploy.sh — OUTSIDE the repo on
# purpose, so the pull never rewrites the script while it is executing. After
# pulling a change to this file, sync it to the live location:
#     cp /var/www/hisense-ir/app/ops/deploy.sh /var/www/hisense-ir/deploy.sh
#     chmod +x /var/www/hisense-ir/deploy.sh
#
# Run as the app user (reza), NOT root — root-owned .next breaks PM2.
set -e

APP_DIR="/var/www/hisense-ir/app"
LOG_FILE="${HISENSE_DEPLOY_LOG:-/var/log/hisense-deploy.log}"

# Fall back to a user-writable log if the default isn't writable. A failing
# `tee` under `set -e` aborts the whole deploy, so never let logging be fatal.
# One-time setup for the default path: sudo touch /var/log/hisense-deploy.log
#                                      sudo chown reza:reza /var/log/hisense-deploy.log
if ! touch "$LOG_FILE" 2>/dev/null; then
  LOG_FILE="$HOME/hisense-deploy.log"
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

log "Building Next.js..."
npm run build

log "Restarting PM2..."
pm2 reload ecosystem.config.cjs --update-env

log "=== Deploy complete ==="

# Post-deploy SEO regression audit against the now-live site (non-blocking,
# backgrounded so it never delays or fails the deploy). Logs to
# /var/log/hisense-seo-audit.log and escalates ERROR-level findings to claude -p.
if [ -x /usr/local/bin/seo-audit.sh ]; then
  log "Kicking off post-deploy SEO audit (background)..."
  (/usr/local/bin/seo-audit.sh >/dev/null 2>&1 &)
fi
