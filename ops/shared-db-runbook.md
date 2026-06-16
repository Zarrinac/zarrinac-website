# Shared Database Runbook — hisense-ir.com + zarrinac.com

> One PostgreSQL instance backs **both** sites. zarrinac is a strict superset of
> hisense (it adds the D'code catalog). The two repos now carry an **identical**
> `prisma/schema.prisma` and an identical `prisma/migrations/` history, so
> `prisma migrate deploy` is idempotent across both apps — whichever deploys first
> applies pending migrations, the second sees them already applied. No drift.

## Topology

```
                 PRIMARY (read/write)              HOT STANDBY (read-only)
        ┌─────────────────────────────┐     ┌──────────────────────────────┐
        │ nexzarrin   172.17.0.10      │     │ zarrin-ng-site  172.17.0.19  │
        │ Postgres  DB: zarrin         │────▶│ Postgres  (streaming replica)│
        │                              │ WAL │  promote manually on failover│
        └──────────────┬──────────────┘     └──────────────────────────────┘
                       │  both apps point DATABASE_URL here
        ┌──────────────┴───────────────┐
        │  hisense-ir app (nexzarrin)   │  NEXT_PUBLIC_SITE_ID=hisense
        │  zarrinac  app (zarrin-ng)    │  NEXT_PUBLIC_SITE_ID=zarrinac
        └───────────────────────────────┘
```

- **Canonical DB name:** `zarrin`, owner `reza_sf` (keep the existing hisense prod DB; zarrinac repoints to it).
- Same DC, private `/26` subnet → cross-box query latency is negligible.
- HA model: **streaming replication + manual promote** (chosen 2026-06-16). Standby is read-only until promoted.

## What changed in the repos (already done — Phase 1)

- hisense schema gained the D'code models + `20260614100000_add_dcode_catalog` migration (tables sit unused; hisense never adds `/dcode` routes).
- Both repos gained `site String @default("hisense")` on `ComplaintSubmission` + `SurveySubmission` via the identical `20260616000000_add_submission_site` migration.
- New `lib/siteId.ts` reads `NEXT_PUBLIC_SITE_ID` (default `hisense`); zarrinac sets `zarrinac`. Inserts tag `site`; admin lists/counts filter by it. **The only intended runtime difference between the two deployments is this one env var.**

---

## Phase 2 — Unify the LOCAL dev DB (do this first, it's the safe rehearsal)

Goal: both local repos point at one local DB (`zarrin`); validate before touching prod.

1. **Pick `zarrin` as the survivor.** In `zarrinac-website/.env.local`, set
   `DATABASE_URL` to the local `zarrin` DB (same as hisense) and add
   `NEXT_PUBLIC_SITE_ID=zarrinac`. hisense keeps `zarrin` + `NEXT_PUBLIC_SITE_ID=hisense`.
2. **Apply migrations** from either repo against local `zarrin`:
   `npm run db:deploy` (adds dcode tables if missing + the `site` column).
3. **Backfill + merge submissions from the old local `zarrinac` DB:**
   ```sh
   # in the OLD zarrinac DB, tag its rows before exporting
   psql -d zarrinac -c "UPDATE \"ComplaintSubmission\" SET site='zarrinac';"
   psql -d zarrinac -c "UPDATE \"SurveySubmission\"   SET site='zarrinac';"
   # copy those two tables into zarrin (cuid ids + random referenceCodes ⇒ no collisions)
   pg_dump -d zarrinac --data-only -t '"ComplaintSubmission"' -t '"SurveySubmission"' \
     | psql -d zarrin
   ```
4. **Seed D'code into `zarrin`** from the zarrinac repo: `npm run db:seed:dcode`.
5. **Seed products from ONE repo only** (designate hisense canonical). The product
   seed **prunes DB rows absent from its content array** — running it from both
   repos would prune each other's extras. Run `npm run db:seed:products` from
   hisense; zarrinac relies on the shared rows. (Only matters if the two content
   arrays ever diverge.)
6. **Run both apps** (`:3000` hisense, `:3001` zarrinac) against `zarrin`. Verify:
   each admin panel shows only its own submissions; submitting a form on each site
   writes the correct `site`; zarrinac `/dcode` works; hisense is unaffected.

---

## Phase 3 — Production: single shared DB on nexzarrin

### 3a. Open Postgres on nexzarrin to the zarrinac server only

On **nexzarrin** (adjust version path, e.g. `/etc/postgresql/16/main/`):

```sh
# postgresql.conf — listen on the private interface (NOT 0.0.0.0/public)
listen_addresses = 'localhost,172.17.0.10'

# pg_hba.conf — allow ONLY the zarrinac box, require TLS, scram auth
hostssl  zarrin  reza_sf  172.17.0.19/32  scram-sha-256
```

```sh
# firewall: 5432 reachable only from the zarrinac box
sudo ufw allow from 172.17.0.19 to any port 5432 proto tcp
sudo systemctl reload postgresql
```

- Enable TLS on the server (`ssl = on` + cert/key in `postgresql.conf`). For a
  private same-DC link a self-signed cert with `sslmode=require` is acceptable;
  for stricter verification use `verify-full` with a CA you control.
- Confirm 5432 is **not** exposed publicly (`sudo ss -tlnp | grep 5432` shows only
  localhost + `172.17.0.10`).

### 3b. Apply the new migrations on the prod DB

Deploy hisense (or zarrinac) once via the normal `deploy.sh`; `npm run db:deploy`
applies `add_dcode_catalog` + `add_submission_site` to prod `zarrin`. Existing
prod submissions are all hisense → the `DEFAULT 'hisense'` backfill is correct.

### 3c. Merge zarrinac's PROD submissions into nexzarrin `zarrin`

On **zarrin-ng-site** (its current prod `zarrinac` DB), before repointing:

```sh
psql -d zarrinac -c "UPDATE \"ComplaintSubmission\" SET site='zarrinac';"
psql -d zarrinac -c "UPDATE \"SurveySubmission\"   SET site='zarrinac';"
pg_dump -d zarrinac --data-only -t '"ComplaintSubmission"' -t '"SurveySubmission"' \
  | ssh reza@172.17.0.10 'psql -d zarrin'
```

Seed D'code into prod `zarrin` from the zarrinac repo on the server:
`npm run db:seed:dcode`.

### 3d. Repoint zarrinac.com → nexzarrin

In zarrinac's prod env (`/var/www/.../.env` or `ecosystem.config.cjs`):

```
DATABASE_URL="postgresql://reza_sf:***@172.17.0.10:5432/zarrin?sslmode=require"
NEXT_PUBLIC_SITE_ID="zarrinac"
```

`pm2 reload` zarrinac. Verify both sites read/write the shared DB, admin panels
stay separated, `/dcode` works, complaint + survey submission works on both.

> After this, the old local + prod `zarrinac` databases are decommissioned. Keep a
> final dump archived before dropping them.

---

## Phase 4 — Hot standby on zarrin-ng-site (manual failover)

Streaming replication; standby is read-only until promoted. (PG 12+ syntax.)

**On primary (nexzarrin):**

```sh
# postgresql.conf
wal_level = replica
max_wal_senders = 10
# create a replication slot + role
psql -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD '***';"
psql -c "SELECT pg_create_physical_replication_slot('zarrin_ng_standby');"
# pg_hba.conf: allow replication from the standby
echo 'hostssl  replication  replicator  172.17.0.19/32  scram-sha-256' >> pg_hba.conf
sudo systemctl reload postgresql
```

**On standby (zarrin-ng-site):**

```sh
sudo systemctl stop postgresql
sudo -u postgres rm -rf /var/lib/postgresql/<ver>/main/*
sudo -u postgres pg_basebackup -h 172.17.0.10 -U replicator -D /var/lib/postgresql/<ver>/main \
  -Fp -Xs -P -R -S zarrin_ng_standby
# -R writes standby.signal + primary_conninfo automatically
sudo systemctl start postgresql
# verify: SELECT pg_is_in_recovery();  -- true on standby
```

**Verify replication health (on primary):**
`SELECT client_addr, state, sync_state FROM pg_stat_replication;`

### Failover (primary down)

1. On standby: `sudo -u postgres pg_ctl promote -D /var/lib/postgresql/<ver>/main`
   (or `SELECT pg_promote();`). It becomes read/write.
2. Repoint **both** apps' `DATABASE_URL` host → `172.17.0.19`, `pm2 reload` both.
3. When nexzarrin returns, rebuild it as the new standby (`pg_basebackup` from
   172.17.0.19), then optionally fail back during a maintenance window.

> This is manual by design (solo-ops tradeoff). Until promotion + repoint, write
> traffic (complaint/survey submission) is down on both sites; catalog pages keep
> serving via the static fallback (`FALLBACK_PRODUCTS` / `content/`).

---

## Backup / monitor implications

- nexzarrin's existing `weekly-backup.sh` (`pg_dumpall`) + `hisense-monitor.sh`
  now cover **both** sites' data automatically — one box to back up.
- Add the standby's replication lag to monitoring
  (`pg_last_wal_receive_lsn()` vs `pg_last_wal_replay_lsn()`).

## Rollback (Phase 1, repo only)

`git revert` the schema/migration commit in both repos. Because the `site` column
has a default and the dcode tables are additive + unused by hisense, reverting the
code is safe; dropping the columns/tables requires a down-migration only if you
truly want them gone.

## Key invariants (don't break these)

1. **`prisma/schema.prisma` and `prisma/migrations/` MUST stay byte-identical
   across both repos.** Any future model change goes into both, as the same
   migration folder. Divergence → `migrate deploy` drift → broken deploys.
2. The **only** intended runtime difference between deployments is
   `NEXT_PUBLIC_SITE_ID` (+ `NEXT_PUBLIC_SITE_URL`, media base).
3. Seed **products from one repo only** (hisense canonical) — the seed prunes.
4. Postgres 5432 is **never** exposed beyond `172.17.0.19` + localhost.
