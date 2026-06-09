#!/bin/bash
# Server-side media sync: mirror the uploaded staging folder into the live media
# dir with the ownership + permissions the app needs.
#
# WHY THIS EXISTS: the Next app runs as `reza` and reads /media off disk to optimize
# images. If the live dir is left www-data-only / mode 700, `reza` gets EACCES and the
# app crash-loops (503). This script always sets a+rX so both reza (app) and www-data
# (Apache) can read it.
#
# Install (root-owned so a NOPASSWD sudoers rule for it is safe):
#   sudo cp /var/www/hisense-ir/app/ops/sync-media.sh /usr/local/bin/sync-media.sh
#   sudo chown root:root /usr/local/bin/sync-media.sh && sudo chmod 755 /usr/local/bin/sync-media.sh
# Run (needs root):  sudo /usr/local/bin/sync-media.sh
set -euo pipefail

STAGING="${MEDIA_STAGING:-/home/reza/media/}"
LIVE="${MEDIA_LIVE:-/var/www/hisense-ir/media/}"

if [ ! -d "$STAGING" ]; then
  echo "ERROR: staging dir '$STAGING' not found — upload your media there first (pscp)." >&2
  exit 1
fi

echo "Mirroring $STAGING -> $LIVE ..."
# --delete makes LIVE an exact mirror of STAGING (propagates local deletions).
rsync -av --delete "$STAGING" "$LIVE"

echo "Setting ownership (www-data) and read perms (a+rX) ..."
chown -R www-data:www-data "$LIVE"
chmod -R a+rX "$LIVE"

echo "MEDIA SYNC DONE — $(find "$LIVE" -type f | wc -l) files in $LIVE"
