#!/bin/bash
# SEO regression audit — runs the deterministic checker (ops/seo-audit.mjs) against
# the LIVE site, logs the full report, and ONLY when it finds ERROR-level issues
# escalates the report to `claude -p` for prioritized fixes (keeps token use low).
#
# Fires daily (cron) and after each deploy (kicked off by deploy.sh).
# Live copy: /usr/local/bin/seo-audit.sh  ·  log: /var/log/zarrinac-seo-audit.log
export HOME=/home/reza
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_BIN="${NODE_BIN:-$(command -v node)}"
CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude || true)}"
APP_DIR="${ZARRINAC_APP_DIR:-/var/www/zarrinac/app}"
LOG="${ZARRINAC_SEO_AUDIT_LOG:-/var/log/zarrinac-seo-audit.log}"
TS="$(date '+%F %T')"

# The checker exits 1 when an ERROR-level issue is found, 0 otherwise.
REPORT="$("$NODE_BIN" "$APP_DIR/ops/seo-audit.mjs" 2>&1)"
CODE=$?

{
  echo "=================== [$TS] SEO audit (exit $CODE) ==================="
  echo "$REPORT"
} >> "$LOG"

# Escalate to Claude only on ERROR-level findings (real bugs: 404s, missing
# title/canonical, >2MB pages, header regressions). Warnings stay in the log —
# they already say exactly what to improve (e.g. "title 90 chars (aim 20-70)").
if [ "$CODE" -ne 0 ] && [ -x "$CLAUDE_BIN" ]; then
  echo "------------------- claude -p triage -------------------" >> "$LOG"
  echo "$REPORT" | "$CLAUDE_BIN" -p "You are an SEO auditor for zarrinac.com (a Hisense-brand Next.js site, fa+en, served via next-intl). The following are automated SEO check findings. List the 3-5 most impactful ERRORS and give concrete, file/page-level fixes. Be brief." >> "$LOG" 2>&1 || true
fi
