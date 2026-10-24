# ops/ — server operations scripts

Canonical, version-controlled copies of the production server's operational scripts.
The **live** copies run from outside the repo (so a `git pull` never rewrites a script
mid-execution); these are the source of truth — edit here, then sync to the server.

**Server:** Ubuntu host `zarrin-ng-site` (`172.17.0.19`), user `reza`, app at
`/var/www/zarrinac/app`, served by PM2 (`zarrinac`, `ecosystem.config.cjs`) behind Apache.
The app reads the shared `zarrin` database on `nexzarrin` and must set
`NEXT_PUBLIC_SITE_ID=zarrinac`.

## Files

| Repo file                      | Live location on server              | Purpose                                                                                               |
| ------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `ops/deploy.sh`                | `/var/www/zarrinac/deploy.sh`        | Pull → `npm ci` → `db:deploy` → `build` → `pm2 reload`                                                |
| `ops/cron/zarrinac-monitor.sh` | `/usr/local/bin/zarrinac-monitor.sh` | Daily health check, deterministic thresholds (disk/mem/PM2), no external API calls                    |
| `ops/cron/weekly-backup.sh`    | `/usr/local/bin/weekly-backup.sh`    | Weekly lean backup: `pg_dumpall` + `/etc` + app secrets, keeps 4 weeks                                |
| `ops/cron/db-local-copy.sh`    | `/usr/local/bin/db-local-copy.sh`    | Nightly (02:30) logical copy of the shared `zarrin` DB into the local Postgres 18, row-count verified |
| `ops/sync-media.sh`            | `/usr/local/bin/sync-media.sh`       | Mirror staged media → live dir + fix owner/perms (`a+rX`)                                             |
| `ops/upload-media.ps1`         | (runs on the Windows dev PC)         | scp upload + trigger `sync-media.sh` over ssh (key auth)                                              |
| `ops/preflight.mjs`            | (runs from deploy on the server)     | Validates Zarrinac env identity and the shared nexzarrin DB target without printing secrets           |
| `ops/seo-audit.mjs`            | (runs from the repo on the server)   | Deterministic SEO checker: title/desc/canonical/hreflang/h1/size/JSON-LD over the live sitemap        |
| `ops/cron/seo-audit.sh`        | `/usr/local/bin/seo-audit.sh`        | SEO audit wrapper (log only, no LLM triage); installed non-executable and not scheduled               |

> Not included: `ecosystem.config.cjs`, `.env` — they hold secrets and are gitignored.
> Keep them only on the server. The husky hooks (`.husky/pre-commit`, `pre-push`) live in
> the repo root already.

## Syncing to the server

After a deploy pulls a change under `ops/`, copy the affected script to its live location:

```bash
cd /var/www/zarrinac/app

# Deploy script (outside the repo on purpose)
cp ops/deploy.sh /var/www/zarrinac/deploy.sh
chmod +x /var/www/zarrinac/deploy.sh

# Cron scripts (need root to write /usr/local/bin)
sudo cp ops/cron/zarrinac-monitor.sh /usr/local/bin/zarrinac-monitor.sh
sudo cp ops/cron/weekly-backup.sh   /usr/local/bin/weekly-backup.sh
sudo cp ops/cron/seo-audit.sh       /usr/local/bin/seo-audit.sh
sudo chmod +x /usr/local/bin/zarrinac-monitor.sh /usr/local/bin/weekly-backup.sh /usr/local/bin/seo-audit.sh
```

(`seo-audit.sh` calls `ops/seo-audit.mjs` straight from the repo — only the wrapper
is copied to `/usr/local/bin`, so a `git pull` keeps the checker logic current.)

(`deploy.sh` is intentionally a manual copy, not a symlink into the repo: bash reads a
script as it runs, so letting `git pull` overwrite the executing file is unsafe.)

## Production env guard

`deploy.sh` runs `node ops/preflight.mjs` before migrations/build. It checks the server `.env`
without printing secret values:

```bash
DATABASE_URL="postgresql://reza_sf:***@172.17.0.10:5432/zarrin?schema=public&sslmode=no-verify"
NEXT_PUBLIC_SITE_ID="zarrinac"
NEXT_PUBLIC_SITE_URL="https://zarrinac.com"
```

It also verifies that `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` exist,
that `ecosystem.config.cjs` is present, and that TCP port `5432` is reachable on `nexzarrin`.
`sslmode=no-verify` is used because the internal Postgres TLS certificate on `nexzarrin` is
self-signed; it keeps the connection encrypted without requiring local CA installation.
Run it manually from the app directory with `node ops/preflight.mjs`.

## One-time setup

```bash
# Deploy log must be writable by the app user (a failing tee aborts the deploy)
sudo touch /var/log/zarrinac-deploy.log && sudo chown reza:reza /var/log/zarrinac-deploy.log
# SEO audit log (seo-audit.sh runs as reza, post-deploy + daily cron)
sudo touch /var/log/zarrinac-seo-audit.log && sudo chown reza:reza /var/log/zarrinac-seo-audit.log
sudo touch /var/log/zarrinac-monitor.log && sudo chown reza:reza /var/log/zarrinac-monitor.log

# PM2 boot persistence (so the app resurrects after a reboot). Run pm2 startup,
# then run the sudo line it prints, then snapshot the running process list:
pm2 startup systemd           # prints a `sudo env PATH=... pm2 startup ...` line — run it
pm2 save                      # writes ~/.pm2/dump.pm2, replayed by pm2-reza.service at boot
# Verify: systemctl is-enabled pm2-reza   ->   enabled

# Cron entries (crontab -e)  — adjust times to taste
0 7 * * *  /usr/local/bin/zarrinac-monitor.sh                # daily monitor at 07:00
0 3 * * 0  /usr/local/bin/weekly-backup.sh >> /var/log/zarrinac-backup.log 2>&1   # Sun 03:00 backup
```

SEO audit is intentionally disabled on `zarrin-ng-site` for now: no cron entry, and
`/usr/local/bin/seo-audit.sh` is installed without executable permission. Re-enable later with
`sudo chmod +x /usr/local/bin/seo-audit.sh` and a cron entry if needed.

## Standalone DB copy (separating from nexzarrin)

zarrinac.com reads the shared `zarrin` DB on nexzarrin. So that nexzarrin can be stopped for a
while, or the two sites split for good, `zarrin-ng-site` keeps its own **copy** of that DB:
the local Postgres 18 cluster (`127.0.0.1:5432` only, scram), database `zarrin`, role `reza_sf`
(password only in `~reza/.pgpass`, mode 600 — never in git). It is a **logical** copy
(`pg_dump -Fc` → `pg_restore --clean` in one transaction), refreshed by
`db-local-copy.sh` from reza's crontab at 02:30 daily. Physical streaming replication
(`shared-db-runbook.md` Phase 4) is not possible: nexzarrin is Postgres 16, this host 18.

- The copy is **not live**: the app still uses nexzarrin. Writes made after the last refresh
  (complaint/survey submissions, admin edits) exist only on nexzarrin until the next run.
- The script verifies exact row counts for every table and leaves the previous copy untouched
  if the dump or restore fails. Log + last 7 dumps: `~reza/backups/`. It **refuses to run once
  the app's `DATABASE_URL` points at this host**, so it can never overwrite a live local DB.
- `weekly-backup.sh` (`pg_dumpall`) now also covers the local copy.

**Switching zarrinac.com to the local copy** (nexzarrin down or retired). One step at a time:

1. If nexzarrin is still up, run `/usr/local/bin/db-local-copy.sh` for a final refresh, then
   `pm2 stop zarrinac` so no submission lands on the old DB after it.
2. Back up first: `cp .env ~/backups/env-before-switch`.
3. In `/var/www/zarrinac/app/.env` set
   `DATABASE_URL="postgresql://reza_sf:<password from ~/.pgpass>@localhost:5432/zarrin?schema=public"`
   and add `ZARRINAC_DB_STANDALONE=1` (without it `preflight.mjs` rejects a non-nexzarrin host).
   Keep `DATABASE_URL` out of `ecosystem.config.cjs` (see the PM2 env-precedence note).
4. `node ops/preflight.mjs`, then `pm2 restart zarrinac --update-env`; check
   `/api/products` → `X-Data-Source: database`, `/admin/login`, and a test complaint.
5. From then on the local DB is the only source of truth for zarrinac: `db-local-copy.sh`
   stops itself, and `weekly-backup.sh` becomes its backup. Remove the cron line if you like.
6. Migrations still ship from this repo (`db:deploy`). If hisense later changes `prisma/`,
   port it byte-identically as before, or accept that the two schemas now diverge.

Going back: restore the saved `.env`, drop `ZARRINAC_DB_STANDALONE`, restart. Anything written
to the local DB in between must be merged into nexzarrin by hand first.

## Media sync (local PC → server)

Media lives **outside git** (local `C:\Users\r.saberifard\Documents\IT-Hisense\zarrin\media`,
server `/var/www/zarrinac/media`).
The Next app runs as `reza` and reads media off disk to optimize images — so the live dir
**must be readable by `reza`**. Leaving it `www-data`-only / mode `700` causes `EACCES` and a
503 crash-loop. `sync-media.sh` always applies `chmod -R a+rX`, which prevents that.

**`public/media` symlink (required for `next/image`).** Browsers fetch raw media via Apache's
`Alias /media/ → /var/www/zarrinac/media/`, but `next/image`'s optimizer fetches its _relative_
source (`NEXT_PUBLIC_MEDIA_BASE_URL=/media`) through an **internal request to the Node server**
(`:3000`), which has no `/media` route — so every optimized image 400s with
`"received null"` (raw `<img>`/video still works, masking it). Fix: symlink the live dir into
the app's `public/` so the optimizer can read it off disk, host/domain-independent:

```bash
ln -s /var/www/zarrinac/media /var/www/zarrinac/app/public/media   # idempotent
```

`deploy.sh` recreates this link on every deploy if missing, so it survives a fresh app dir.

**One-time setup on the server** (so `upload-media.ps1` runs unattended):

```bash
# install the script root-owned (so the NOPASSWD rule below is safe)
sudo cp /var/www/zarrinac/app/ops/sync-media.sh /usr/local/bin/sync-media.sh
sudo chown root:root /usr/local/bin/sync-media.sh && sudo chmod 755 /usr/local/bin/sync-media.sh

# allow reza to run ONLY this script as root without a password
echo 'reza ALL=(root) NOPASSWD: /usr/local/bin/sync-media.sh' | sudo tee /etc/sudoers.d/zarrinac-media
sudo chmod 440 /etc/sudoers.d/zarrinac-media
```

**Usage from the Windows PC:** run `pwsh ops/upload-media.ps1`. It uses Windows OpenSSH
(`ssh`/`scp`) with key auth (`~/.ssh/zarrin_ng_site_ed25519_2026-10-14` by default, `BatchMode`) — no password — so it can
run unattended. It clears staging → `scp` uploads the whole media folder → `ssh` runs
`sudo sync-media.sh` (rsync `--delete` mirror + owner/perms). The key's public half must be in
the server's `~/.ssh/authorized_keys` for `reza`; verify with
`ssh -i $HOME\.ssh\zarrin_ng_site_ed25519_2026-10-14 -o BatchMode=yes reza@172.17.0.19 hostname`.

Tip: optimize images first — `node ops/optimize-media.mjs --apply` — since the upload mirrors
with `--delete` on the server.

Manual equivalent (no PS script):
`scp -i ~/.ssh/zarrin_ng_site_ed25519_2026-10-14 -r media/ reza@172.17.0.19:/home/reza/`, then on the server
`sudo /usr/local/bin/sync-media.sh`.

## TLS / HTTPS

Apache terminates TLS for `zarrinac.com` (+ `www`) and reverse-proxies to Next on `:3000`;
the `:80` vhost 301-redirects to HTTPS (mirrors the nexzarrin/hisense pattern). Cert files
live **outside git** under `/etc/ssl/zarrinac/`:

| File                              | Perms           | Apache directive        |
| --------------------------------- | --------------- | ----------------------- |
| `/etc/ssl/zarrinac/fullchain.crt` | `644 root:root` | `SSLCertificateFile`    |
| `/etc/ssl/zarrinac/zarrinac.key`  | `600 root:root` | `SSLCertificateKeyFile` |

`fullchain.crt` is the **leaf + both intermediates** concatenated, in order
(`*.zarrinac.com` → `Certum DV TLS G2 R39 CA` → `Certum Trusted Root CA`); the self-signed
root is omitted (clients have it). The cert is a **Certum wildcard** (SAN `*.zarrinac.com` +
`zarrinac.com`) — **NOT** Let's Encrypt, so **renewal is manual**.

**Renewal** (current cert valid until **2026-12-16**): obtain the new Certum bundle, then
rebuild + reinstall:

```bash
# locally: assemble fullchain (leaf first, root omitted)
cat <leaf>.crt <DV-TLS-G2-R39>.cer <Trusted-Root-CA>.cer > fullchain.crt
openssl verify -CAfile <ca-bundle> <leaf>.crt          # expect: OK
# verify key matches cert (hashes must match):
openssl x509 -in <leaf>.crt -noout -pubkey | openssl md5
openssl pkey -in <key> -pubout            | openssl md5
# upload + install (key stays 600 root:root), then:
sudo apache2ctl configtest && sudo systemctl reload apache2
# verify: curl -sS -o /dev/null -w '%{http_code} verify=%{ssl_verify_result}\n' \
#   --resolve zarrinac.com:443:127.0.0.1 https://zarrinac.com/fa     # 200 verify=0
```

Public reachability also needs DNS A-records for `zarrinac.com` + `www` pointing at the host
and port `443` open through any firewall.

## Notes

- `zarrinac-monitor.sh` and `seo-audit.sh` source nvm and resolve `node` and `pm2` dynamically,
  so they survive Node patch-version upgrades.
- **No script here may call `claude -p` or any other Anthropic API endpoint.** The server IP
  (Iran) gets flat `403`s from `api.anthropic.com`, so LLM-based checks fail silently; the
  Claude CLI and its API key have been removed from this host. Keep server automation
  deterministic. `ops/cron/zarrinac-monitor.sh` mirrors `ops/cron/hisense-monitor.sh` from the
  hisense repo — that copy is the reference; port changes from there.
- The monitor cron is **enabled** on `zarrin-ng-site` (daily 07:00, reza's crontab; the
  deterministic script, installed 2026-10-24). Until then the live copy was still the old
  `claude -p` version running hourly, which could only dump raw stats into the log. Check it
  with `tail /var/log/zarrinac-monitor.log` — a healthy run ends with "All clear".
- `weekly-backup.sh` failed every Sunday from 2026-06 to 2026-10-24 (`mkdir /backup: Permission
denied` — it ran `mkdir` as `reza` without `sudo`). Fixed 2026-10-24; verify with
  `sudo ls -l /backup` after a run. It now also covers the local DB copy (see above).
- `deploy.sh` runs as `reza` (never root): a root-owned `.next` breaks PM2.
- Deploy/DB/media workflow context lives in the repo root `CLAUDE.md` (Deployment & Ops,
  DB & Media Workflow sections).

## TODO (deferred)

- **Single-source secrets:** secrets are currently duplicated in both `ecosystem.config.cjs`
  (PM2 runtime, wins at runtime) and `.env` (prisma CLI during deploy). Since `next start`
  loads `.env` from its `cwd`, the secret keys could be removed from `ecosystem.config.cjs`
  so `.env` is the single source of truth — leaving only `DATABASE_URL` to keep in sync,
  or none. Validate that PM2-launched `next start` picks up `.env` before removing them.
