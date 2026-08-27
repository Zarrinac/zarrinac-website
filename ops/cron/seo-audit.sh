#!/bin/bash
# SEO regression audit — runs the deterministic checker (ops/seo-audit.mjs) against
# the LIVE site and logs the full report. ERROR-level findings surface in the log
# and in the exit code; there is no LLM triage step (api.anthropic.com is blocked
# from this host's IP, so `claude -p` cannot run here).
#
# Fires after each deploy (kicked off by deploy.sh) when installed executable.
# Live copy: /usr/local/bin/seo-audit.sh  ·  log: /var/log/zarrinac-seo-audit.log
export HOME=/home/reza
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_BIN="${NODE_BIN:-$(command -v node)}"
APP_DIR="${ZARRINAC_APP_DIR:-/var/www/zarrinac/app}"
LOG="${ZARRINAC_SEO_AUDIT_LOG:-/var/log/zarrinac-seo-audit.log}"
TS="$(date '+%F %T')"

# The checker exits 1 when an ERROR-level issue is found, 0 otherwise.
REPORT="$("$NODE_BIN" "$APP_DIR/ops/seo-audit.mjs" 2>&1)"
CODE=$?

{
  echo "=================== [$TS] SEO audit (exit $CODE) ==================="
  echo "$REPORT"
  if [ "$CODE" -ne 0 ]; then
    echo "------------------- ERROR-level findings above: review manually -------------------"
  fi
} >> "$LOG"

exit "$CODE"
