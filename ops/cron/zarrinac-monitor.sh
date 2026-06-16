#!/bin/bash
# Hourly (cron) health monitor — pipes server stats to `claude -p` to flag anomalies.
# Live copy: /usr/local/bin/zarrinac-monitor.sh  ·  log: /var/log/zarrinac-monitor.log
export HOME=/home/reza
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude || true)}"
PM2_BIN="${PM2_BIN:-$(command -v pm2 || true)}"
LOG_FILE="${ZARRINAC_MONITOR_LOG:-/var/log/zarrinac-monitor.log}"

STATS=$(df -h / && echo "---" && free -h && echo "---" && "$PM2_BIN" jlist 2>/dev/null | python3 -c "
import sys, json
procs = json.load(sys.stdin)
for p in procs:
    print(f\"{p['name']}: {p['pm2_env']['status']} | restarts: {p['pm2_env']['restart_time']}\")" 2>/dev/null || echo "PM2 status unavailable")

if [ -n "$CLAUDE_BIN" ] && [ -x "$CLAUDE_BIN" ]; then
  echo "$STATS" | "$CLAUDE_BIN" -p "You are a server monitor. Analyze these stats for the zarrinac.com Next.js production server. Flag anything critical (disk >80%, memory >90%, PM2 process not online). Be brief." >> "$LOG_FILE" 2>&1
else
  {
    echo "[$(date '+%F %T')] claude not found; raw monitor stats:"
    echo "$STATS"
  } >> "$LOG_FILE" 2>&1
fi
