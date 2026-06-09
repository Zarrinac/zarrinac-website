#!/bin/bash
# Weekly (cron) backup — LEAN: only the irreplaceable, non-git, non-regenerable bits.
#
# Why so small: the app code lives on GitHub (clone to restore), media is synced
# from the dev PC (source of truth there), and node_modules/.next are regenerable.
# So we back up ONLY:
#   1. the Postgres dump  (pg_dumpall — the one truly irreplaceable thing)
#   2. /etc               (apache2, ssh, letsencrypt, cron, sudoers, … ~7 MB)
#   3. the app's gitignored secrets (.env, ecosystem.config.cjs)
#
# This replaces the old full-`/` rootfs tar that had grown /backup to ~16 GB.
# Live copy: /usr/local/bin/weekly-backup.sh · needs sudo. Keeps last 4 weeks.
set -euo pipefail

DATE="$(date +%F)"
HOST="$(hostname -s)"
BACKUP_DIR="/backup"
APP_DIR="/var/www/hisense-ir/app"
mkdir -p "$BACKUP_DIR"

PG_GZ="${BACKUP_DIR}/${HOST}-postgres-${DATE}.sql.gz"
CONFIG_TAR="${BACKUP_DIR}/${HOST}-config-${DATE}.tar.gz"
CRON_TXT="${BACKUP_DIR}/${HOST}-crontabs-${DATE}.txt"

echo "[1/2] Postgres (pg_dumpall) -> $PG_GZ"
# Dump as postgres (peer auth), compress, write to /backup as root.
sudo -u postgres pg_dumpall | gzip -9 | sudo tee "$PG_GZ" >/dev/null

echo "[2/2] Config + secrets -> $CONFIG_TAR"
# Whole /etc (small) covers apache2/ssh/letsencrypt/cron/sudoers; plus the app's
# gitignored secrets. --ignore-failed-read so an absent optional path can't abort.
sudo tar -czpf "$CONFIG_TAR" --xattrs --acls --ignore-failed-read \
  /etc \
  "${APP_DIR}/.env" \
  "${APP_DIR}/ecosystem.config.cjs"

# User crontabs live in /var/spool, not under /etc — capture them as text.
{ echo "### root";  sudo crontab -l 2>/dev/null || true
  echo "### reza";  sudo crontab -l -u reza 2>/dev/null || true
} | sudo tee "$CRON_TXT" >/dev/null

# SAFETY: never let the backup silently miss the secrets. tar stores paths without
# the leading slash, so check for the de-slashed path.
if ! sudo tar -tzf "$CONFIG_TAR" | grep -q "var/www/hisense-ir/app/\.env$"; then
  echo "FATAL: .env not found inside $CONFIG_TAR — backup is incomplete!" >&2
  exit 1
fi

# Keep last 4 weeks (matches the new artifact names; old rootfs tars age out too).
sudo find "$BACKUP_DIR" -maxdepth 1 -type f \
  \( -name "*.tar.gz" -o -name "*.sql.gz" -o -name "*-crontabs-*.txt" \) \
  -mtime +28 -delete

echo "DONE. Current /backup:"
sudo du -sh "$BACKUP_DIR"
ls -lh "$BACKUP_DIR" | tail -n +2
