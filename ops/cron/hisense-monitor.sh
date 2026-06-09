#!/bin/bash
# Hourly (cron) health monitor — pipes server stats to `claude -p` to flag anomalies.
# Live copy: /usr/local/bin/hisense-monitor.sh  ·  log: /var/log/hisense-monitor.log
# Node/claude/pm2 paths are nvm-specific to this host — update if the node version changes.
export HOME=/home/reza
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
CLAUDE_BIN="/home/reza/.nvm/versions/node/v22.19.0/bin/claude"
PM2_BIN="/home/reza/.nvm/versions/node/v22.19.0/bin/pm2"

STATS=$(df -h / && echo "---" && free -h && echo "---" && $PM2_BIN jlist 2>/dev/null | python3 -c "
import sys, json
procs = json.load(sys.stdin)
for p in procs:
    print(f\"{p['name']}: {p['pm2_env']['status']} | restarts: {p['pm2_env']['restart_time']}\")" 2>/dev/null || echo "PM2 status unavailable")

echo "$STATS" | $CLAUDE_BIN -p "You are a server monitor. Analyze these stats for the hisense-ir Next.js production server. Flag anything critical (disk >80%, memory >90%, PM2 process not online). Be brief." >> /var/log/hisense-monitor.log 2>&1
