#!/bin/bash
# Refresh the LOCAL standalone copy of the shared `zarrin` database.
#
# Why: zarrinac.com and hisense-ir.com share one Postgres on nexzarrin (172.17.0.10).
# If nexzarrin is ever stopped, or the two sites are split for good, zarrinac needs a
# database of its own to switch to. This keeps one on zarrin-ng-site (Postgres 18,
# 127.0.0.1 only) as a logical copy. Streaming replication is not possible here:
# nexzarrin runs Postgres 16, this host 18, and a physical standby needs the same major.
#
# What it does: pg_dump -Fc the shared DB (read-only on the source) -> temp file ->
# pg_restore --clean in ONE transaction into local `zarrin` -> compare per-table row
# counts. A failed dump or restore leaves the previous copy untouched.
#
# SAFETY: the app's DATABASE_URL is read from .env. If it already points at this host
# (the switch-over has happened), the local DB is the live one and this script refuses
# to run — otherwise it would overwrite live data with a stale copy.
#
# Live copy: /usr/local/bin/db-local-copy.sh · runs as `reza` (cron, daily 02:30).
# Needs ~/.pgpass for the local role reza_sf. Log: ~/backups/db-local-copy.log
set -euo pipefail

APP_DIR="${ZARRINAC_APP_DIR:-/var/www/zarrinac/app}"
BACKUP_DIR="${ZARRINAC_DB_BACKUP_DIR:-$HOME/backups}"
LOCAL_DB="${ZARRINAC_LOCAL_DB:-zarrin}"
LOCAL_ARGS=(-h localhost -U reza_sf)
KEEP="${ZARRINAC_DB_COPY_KEEP:-7}"
LOG="$BACKUP_DIR/db-local-copy.log"
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
umask 077

log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
die() { log "FAIL: $*"; exit 1; }

RAW="$(grep -E '^DATABASE_URL=' "$APP_DIR/.env" | head -1 | cut -d= -f2- | tr -d "\"'")"
[ -n "$RAW" ] || die "DATABASE_URL not found in $APP_DIR/.env"
HOST="$(echo "$RAW" | sed -E 's#^[a-z]+://[^@]*@([^:/?]+).*#\1#')"
case "$HOST" in
  localhost|127.0.0.1|::1|"$(hostname -s)"|"$(hostname -I | awk '{print $1}')")
    die "app DATABASE_URL points at this host ($HOST) — the local DB is live, refusing to overwrite it" ;;
esac

# libpq rejects Prisma's `schema=` and `sslmode=no-verify`.
SRC="$(echo "$RAW" | sed -E 's/schema=[^&]*&?//; s/sslmode=no-verify/sslmode=require/; s/[?&]$//')"
export PGCONNECT_TIMEOUT=15

STAMP="$(date +%Y%m%d-%H%M%S)"
DUMP="$BACKUP_DIR/zarrin-nexzarrin-$STAMP.dump"
log "dump $HOST -> $DUMP"
pg_dump -Fc --no-owner --no-privileges "$SRC" -f "$DUMP" || { rm -f "$DUMP"; die "pg_dump failed (source down?) — local copy left as is"; }

log "restore -> local $LOCAL_DB (single transaction)"
pg_restore "${LOCAL_ARGS[@]}" -d "$LOCAL_DB" -1 --clean --if-exists --no-owner --no-privileges "$DUMP" \
  || die "pg_restore failed — local copy left as is (transaction rolled back); dump kept at $DUMP"

# Verify: exact row counts per table, source vs. local.
TABLES="$(psql "$SRC" -Atc "select tablename from pg_tables where schemaname='public' order by 1")"
BAD=0
for T in $TABLES; do
  S="$(psql "$SRC" -Atc "select count(*) from \"$T\"")"
  L="$(psql "${LOCAL_ARGS[@]}" -d "$LOCAL_DB" -Atc "select count(*) from \"$T\"")"
  [ "$S" = "$L" ] || { log "MISMATCH $T source=$S local=$L"; BAD=1; }
done
[ "$BAD" -eq 0 ] || die "row counts differ between source and local copy"

log "OK: $(echo "$TABLES" | wc -w) tables match; local size $(psql "${LOCAL_ARGS[@]}" -d "$LOCAL_DB" -Atc "select pg_size_pretty(pg_database_size(current_database()))")"

# Keep the newest $KEEP dumps.
ls -1t "$BACKUP_DIR"/zarrin-nexzarrin-*.dump 2>/dev/null | tail -n +"$((KEEP + 1))" | xargs -r rm -f --
