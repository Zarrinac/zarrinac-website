# ops/ — server operations scripts

Canonical, version-controlled copies of the production server's operational scripts.
The **live** copies run from outside the repo (so a `git pull` never rewrites a script
mid-execution); these are the source of truth — edit here, then sync to the server.

**Server:** Ubuntu host `zarrin-ng-site` (`172.17.0.19`), user `reza`, app at
`/var/www/zarrinac/app`, served by PM2 (`zarrinac`, `ecosystem.config.cjs`) behind Apache.
The app reads the shared `zarrin` database on `nexzarrin` and must set
`NEXT_PUBLIC_SITE_ID=zarrinac`.

## Files

| Repo file                      | Live location on server              | Purpose                                                                                        |
| ------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `ops/deploy.sh`                | `/var/www/zarrinac/deploy.sh`        | Pull → `npm ci` → `db:deploy` → `build` → `pm2 reload`                                         |
| `ops/cron/zarrinac-monitor.sh` | `/usr/local/bin/zarrinac-monitor.sh` | Hourly health check piped to `claude -p`                                                       |
| `ops/cron/weekly-backup.sh`    | `/usr/local/bin/weekly-backup.sh`    | Weekly lean backup: `pg_dumpall` + `/etc` + app secrets, keeps 4 weeks                         |
| `ops/sync-media.sh`            | `/usr/local/bin/sync-media.sh`       | Mirror staged media → live dir + fix owner/perms (`a+rX`)                                      |
| `ops/upload-media.ps1`         | (runs on the Windows dev PC)         | scp upload + trigger `sync-media.sh` over ssh (key auth)                                       |
| `ops/preflight.mjs`            | (runs from deploy on the server)     | Validates Zarrinac env identity and the shared nexzarrin DB target without printing secrets    |
| `ops/seo-audit.mjs`            | (runs from the repo on the server)   | Deterministic SEO checker: title/desc/canonical/hreflang/h1/size/JSON-LD over the live sitemap |
| `ops/cron/seo-audit.sh`        | `/usr/local/bin/seo-audit.sh`        | SEO audit wrapper; currently installed non-executable and not scheduled on `zarrin-ng-site`    |

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

# Cron entries (crontab -e)  — adjust times to taste
0 * * * *  /usr/local/bin/zarrinac-monitor.sh                # hourly monitor
0 3 * * 0  /usr/local/bin/weekly-backup.sh >> /var/log/zarrinac-backup.log 2>&1   # Sun 03:00 backup
```

SEO audit is intentionally disabled on `zarrin-ng-site` for now: no cron entry, and
`/usr/local/bin/seo-audit.sh` is installed without executable permission. Re-enable later with
`sudo chmod +x /usr/local/bin/seo-audit.sh` and a cron entry if needed.

## Media sync (local PC → server)

Media lives **outside git** (local `C:\Users\r.saberifard\Documents\IT-Hisense\zarrin\media`,
server `/var/www/zarrinac/media`).
The Next app runs as `reza` and reads media off disk to optimize images — so the live dir
**must be readable by `reza`**. Leaving it `www-data`-only / mode `700` causes `EACCES` and a
503 crash-loop. `sync-media.sh` always applies `chmod -R a+rX`, which prevents that.

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
(`ssh`/`scp`) with key auth (`~/.ssh/zarrin_ng_site_ed25519` by default, `BatchMode`) — no password — so it can
run unattended. It clears staging → `scp` uploads the whole media folder → `ssh` runs
`sudo sync-media.sh` (rsync `--delete` mirror + owner/perms). The key's public half must be in
the server's `~/.ssh/authorized_keys` for `reza`; verify with
`ssh -i $HOME\.ssh\zarrin_ng_site_ed25519 -o BatchMode=yes reza@172.17.0.19 hostname`.

Tip: optimize images first — `node ops/optimize-media.mjs --apply` — since the upload mirrors
with `--delete` on the server.

Manual equivalent (no PS script):
`scp -i ~/.ssh/zarrin_ng_site_ed25519 -r media/ reza@172.17.0.19:/home/reza/`, then on the server
`sudo /usr/local/bin/sync-media.sh`.

## Notes

- `zarrinac-monitor.sh` and `seo-audit.sh` source nvm and resolve `node`, `pm2`, and `claude`
  dynamically, so they survive Node patch-version upgrades.
- `deploy.sh` runs as `reza` (never root): a root-owned `.next` breaks PM2.
- Deploy/DB/media workflow context lives in the repo root `CLAUDE.md` (Deployment & Ops,
  DB & Media Workflow sections).

## TODO (deferred)

- **Single-source secrets:** secrets are currently duplicated in both `ecosystem.config.cjs`
  (PM2 runtime, wins at runtime) and `.env` (prisma CLI during deploy). Since `next start`
  loads `.env` from its `cwd`, the secret keys could be removed from `ecosystem.config.cjs`
  so `.env` is the single source of truth — leaving only `DATABASE_URL` to keep in sync,
  or none. Validate that PM2-launched `next start` picks up `.env` before removing them.
