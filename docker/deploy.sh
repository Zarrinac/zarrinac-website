#!/usr/bin/env bash
# Canonical deploy script for znci.ir (source of truth in git).
#
# znci.ir is this same tree built with a different identity: NEXT_PUBLIC_SITE_URL and
# NEXT_PUBLIC_SITE_ID pick the domain and the home copy, everything else is shared with
# zarrinac.com. So "deploying znci" is: pull main, rebuild the image, restart.
#
# The LIVE copy runs from /var/www/znci/deploy.sh — OUTSIDE the repo on purpose, so the
# pull never rewrites the script while it is executing. After pulling a change to this
# file, sync it to the live location:
#     cp /var/www/znci/app/docker/deploy.sh /var/www/znci/deploy.sh
#     chmod +x /var/www/znci/deploy.sh
#
# Run as the app user (reza) on SC1, who is in the `docker` group — no sudo.
set -euo pipefail

APP_DIR="${ZNCI_APP_DIR:-/var/www/znci/app}"
COMPOSE_FILE="$APP_DIR/docker/compose.yaml"
ENV_FILE="$APP_DIR/docker/.env"
LOG_FILE="${ZNCI_DEPLOY_LOG:-/var/log/znci-deploy.log}"
HEALTH_URL="${ZNCI_HEALTH_URL:-http://127.0.0.1:3010/fa}"

# A failing `tee` under `set -e` would abort the whole deploy, so never let logging be
# fatal. One-time setup for the default path:
#     sudo touch /var/log/znci-deploy.log && sudo chown reza:reza /var/log/znci-deploy.log
if ! touch "$LOG_FILE" 2>/dev/null; then
  LOG_FILE="$HOME/znci-deploy.log"
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

log "=== znci.ir deploy started ==="
cd "$APP_DIR"

log "Pulling latest from GitHub..."
git pull origin main

# --- Integrity guard ---------------------------------------------------------
# Same backstop as ops/deploy.sh: if a known malware signature appears in a build-time
# config file, abort BEFORE the image build can execute it. origin/main was infected once
# (2026-06-11) through postcss.config.mjs, which is otherwise essentially static.
log "Scanning build config for malware signatures..."
if grep -IlE 'createRequire\(|_\$_|\beval\(|Buffer\.from\([^)]*base64|global\.[A-Za-z_]+\s*=' \
     postcss.config.mjs next.config.ts 2>/dev/null; then
  log "!!! ABORT: suspicious code detected in build config — possible re-infection."
  exit 1
fi

# --- Identity preflight ------------------------------------------------------
# The ENTIRE difference between this deployment and zarrinac.com is two build args. If
# docker/.env is missing or still carries zarrinac's identity, the rebuild would quietly
# republish znci.ir as a byte-identical copy of zarrinac.com's home — the cross-domain
# duplicate-content condition that cost hisense-ir.com its canonical in 2026-07. Cheaper
# to fail here than to explain it to Google later.
if [ ! -f "$ENV_FILE" ]; then
  log "!!! ABORT: $ENV_FILE not found (copy docker/env.example and fill it in)."
  exit 1
fi

site_id="$(grep -E '^NEXT_PUBLIC_SITE_ID=' "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
site_url="$(grep -E '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d '"'"'"' \r')"

if [ "$site_id" != "znci" ]; then
  log "!!! ABORT: NEXT_PUBLIC_SITE_ID is '${site_id:-(missing)}', expected 'znci'."
  log "    At any other value this image ships zarrinac.com's home copy on znci.ir."
  exit 1
fi
if [ "$site_url" != "https://znci.ir" ]; then
  log "!!! ABORT: NEXT_PUBLIC_SITE_URL is '${site_url:-(missing)}', expected 'https://znci.ir'."
  log "    Canonicals, hreflang, robots.txt and sitemap.xml are all built from it."
  exit 1
fi
log "Identity preflight OK: $site_id @ $site_url"

# Build and restart. NEXT_PUBLIC_* are inlined by Next at build time, so a code or env
# change needs --build; a plain restart would keep serving the old bundle. Takes ~6 min.
log "Building image and restarting container (this takes several minutes)..."
docker compose -f "$COMPOSE_FILE" up -d --build

# --- Health gate -------------------------------------------------------------
log "Waiting for the container to answer on $HEALTH_URL ..."
for attempt in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: znci.ir' "$HEALTH_URL" || true)"
  if [ "$code" = "200" ]; then
    log "Healthy after ${attempt} attempt(s) (HTTP $code)."
    break
  fi
  if [ "$attempt" = "30" ]; then
    log "!!! Container did not return 200 within ~150s (last: HTTP ${code:-none})."
    log "    Inspect with: docker compose -f $COMPOSE_FILE logs --tail 100"
    exit 1
  fi
  sleep 5
done

# Rebuilds leave the previous image dangling; without this the 118 GB disk fills up over
# a few dozen deploys. Only untagged layers are removed — tagged images are untouched.
log "Pruning dangling images..."
docker image prune -f >/dev/null

log "=== znci.ir deploy complete ==="
