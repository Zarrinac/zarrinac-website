# docker/ — containerised znci.ir

A Docker image of **this exact tree**, configured to serve **znci.ir** with the same
behaviour zarrinac.com has today: the home page (`/fa`, `/en`) is the only marketing
page served from the domain, every Hisense-replica section 308-forwards to
`https://www.hisense-ir.com`, and `/[locale]/dcode/*` 308-forwards to `https://dcode.co.ir`.
`/admin` and `/api` stay functional.

The one thing that is **not** a copy of zarrinac.com is the home copy itself. znci.ir builds
`NEXT_PUBLIC_SITE_ID=znci`, which selects its own block in `content/homeSeoContent.ts` —
a trade/corporate framing (ZNCI as importer and distributor) against zarrinac.com's
consumer/brand framing. That divergence is load-bearing, not cosmetic; see **SEO** below.

The znci identity is injected entirely through build args. The one build-level
difference from the PM2 deploys — `output: 'standalone'`, needed for a small image — is
opt-in via `NEXT_BUILD_STANDALONE=1`, which the Dockerfile sets and `next.config.ts`
reads. zarrinac.com and hisense-ir.com never set it and build exactly as before.

> Until 2026-09-09 this was done by swapping `next.config.ts` out for an overlay file
> (`docker/next.config.standalone.ts`) during the build. That overlay imported
> `./next.config.site`, a module that only existed _inside_ the image build, so repo-level
> `tsc` and `eslint` could never resolve it — and the Dockerfile's `rm -rf docker` existed
> only to hide the same error from `next build`. The env flag replaces the whole
> mechanism, and the config the malware guard scans is now the config that is built.

## Files

| File               | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `Dockerfile`       | 3-stage build: `deps` → `builder` → `runner` (Next standalone, non-root)  |
| `compose.yaml`     | Local/standalone run: port mapping, media bind-mount, runtime env         |
| `env.example`      | Template → copy to `docker/.env` (gitignored via the repo's `.env*` rule) |
| `../.dockerignore` | Build-context filter, mirrors `.gitignore`                                |
| `deploy.sh`        | Server deploy: pull → identity preflight → rebuild → health gate          |

## Quick start

```bash
cp docker/env.example docker/.env     # edit ADMIN_* secrets
docker compose -f docker/compose.yaml up -d --build
# http://localhost:3010/fa
```

Or without compose:

```bash
docker build -f docker/Dockerfile -t znci-website:latest \
  --build-arg NEXT_PUBLIC_SITE_URL=https://znci.ir .

docker run -d --name znci-website -p 3010:3000 \
  -e ADMIN_SESSION_SECRET=... -e ADMIN_USERNAME=... -e ADMIN_PASSWORD=... \
  -v /path/to/media:/app/public/media:ro \
  znci-website:latest
```

## What is baked vs. what is runtime

Next **inlines every `NEXT_PUBLIC_*` reference at build time** — in server bundles and
middleware, not just the client. So:

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ID`, `NEXT_PUBLIC_MEDIA_BASE_URL`,
  `NEXT_PUBLIC_GA_ID`, the verification tokens → **build args**. Changing any of them
  requires `--build`; a container restart will not pick them up. This is why the image
  is domain-specific: an image built for `https://znci.ir` emits znci canonicals,
  hreflang, `sitemap.xml` and `robots.txt`.
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`, `DATABASE_URL`,
  `INTERNAL_API_BASE_URL` → **runtime env**, read per request.

`NEXT_PUBLIC_CONTENT_SOURCE` is deliberately left unset (same as the server). Setting it
to `local` makes `mediaUrl()` strip the `/media` prefix and every asset 404s.

## Database

This image ships **DB-less** — no `DATABASE_URL`. That is safe because every DB-backed
page (`/complaint`, `/survey`, `/products/*`, service centres, downloads) is
308-forwarded off the domain, and the home page is fully static. `/admin` logs in
through the `ADMIN_USERNAME` / `ADMIN_PASSWORD` bootstrap fallback in
`lib/admin/credentials.ts`.

To point it at the shared `zarrin` Postgres instead, add `DATABASE_URL` to the
`environment:` block. Note that this database is **shared with hisense-ir.com and
zarrinac.com** — a znci container writing to it writes into their data.

## Media

Media (~215 MB) stays outside the image and is bind-mounted read-only at
`/app/public/media`, mirroring the server's `public/media → /var/www/zarrinac/media`
symlink. Next serves `/media/*` from `public/` itself, so **no Apache `Alias` is needed**
in front of the container. The mount must be readable by uid `1001` (`nextjs`).

Without the mount the site still renders, but images 404.

## Putting it behind a domain

The container listens on `:3000` and is published on the host as `${ZNCI_PORT}` (3010).
Terminate TLS in front of it and reverse-proxy. Apache, matching the existing
zarrinac.com vhost pattern:

```apache
<VirtualHost *:443>
    ServerName znci.ir
    ServerAlias www.znci.ir

    SSLEngine on
    SSLCertificateFile    /etc/ssl/znci/fullchain.crt
    SSLCertificateKeyFile /etc/ssl/znci/znci.key

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    ProxyPass        / http://127.0.0.1:3010/
    ProxyPassReverse / http://127.0.0.1:3010/
</VirtualHost>
```

`ProxyPreserveHost On` + `X-Forwarded-Proto` matter: `proxy.ts` uses `x-forwarded-host` /
`x-forwarded-proto` for the admin same-origin check on mutating requests.

`Strict-Transport-Security` is emitted by the app itself (`next.config.ts` security
headers), so serve the domain over HTTPS before pointing DNS at it.

## Rebuilding after a code change

The image is built from the working tree, not from `git pull`. Rebuild with
`docker compose -f docker/compose.yaml up -d --build`. The `deps` stage is cached on
`package-lock.json`, so a code-only change re-runs `next build` only.

## Testing /admin locally

`lib/admin/url.ts` builds every admin redirect from `NEXT_PUBLIC_SITE_URL`, and the session
cookie is `Secure`. So on an image built for `https://znci.ir`, hitting `/admin` at
`http://localhost:3010` bounces you to the real domain and the browser drops the cookie —
the same behaviour zarrinac.com has, not a container problem. To click through admin on
your machine, build a throwaway image with a localhost identity:

```bash
docker build -f docker/Dockerfile -t znci-website:local   --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3010 .
```

## Verified locally (2026-08-27)

Built and run on Docker 29.7.2 / Windows, image `znci-website:latest`, 503 MB:

| Check                                          | Result                                           |
| ---------------------------------------------- | ------------------------------------------------ |
| `/` → `/fa`                                    | 307                                              |
| `/fa`, `/en`                                   | 200, single `<h1>`                               |
| `<link rel=canonical>` / `hreflang` / `og:url` | all `https://znci.ir/...`                        |
| `/robots.txt`, `/sitemap.xml`                  | `Host`/`Sitemap`/`<loc>` all znci.ir; home only  |
| `/fa/products`, `/en/about`, `/fa/support` …   | 308 → `www.hisense-ir.com/<same path>`           |
| `/fa/dcode`, `/fa/dcode/tvs/r6d`               | 308 → `dcode.co.ir/fa`, `dcode.co.ir/fa/tvs/r6d` |
| Security headers                               | X-Frame-Options, nosniff, HSTS, Referrer-Policy  |
| `/media/banner/*.webp` (bind mount)            | 200 image/webp                                   |
| `/_next/image?url=/media/...`                  | 200 image/avif — sharp works in the image        |
| `/admin` without `ADMIN_SESSION_SECRET`        | 503 (proxy.ts guard)                             |
| `/admin` login with env creds, no DB           | 303 + `hisense_admin_session` cookie issued      |
| Container healthcheck                          | healthy                                          |

## SEO — why the home copy differs

znci.ir and zarrinac.com are the only two domains this tree serves a 200 on (everything
else 308-forwards away), so if both homes carried the same title/H1/body Google would fold
them into one cluster and choose the canonical itself. That is not hypothetical: it is
exactly what happened between zarrinac.com and hisense-ir.com in 2026-07, when GSC reported
26 URLs as _"Duplicate, Google chose different canonical than user"_ and picked zarrinac.

The fix is structural rather than per-deployment guesswork:

- `content/homeSeoContent.ts` holds one copy block per site, selected by
  `NEXT_PUBLIC_SITE_ID` via `getHomeSeoContent(locale)`. Keep the blocks substantively
  different — different title, H1, body and keyword targets — not translations of one
  another.
- `HOME_CONTENT_LAST_MODIFIED` in `lib/seo/site.ts` is keyed the same way, so bumping
  znci's sitemap `<lastmod>` does not falsely signal that zarrinac.com's home changed.
- `deploy.sh` refuses to build unless `docker/.env` carries `NEXT_PUBLIC_SITE_ID=znci` and
  `NEXT_PUBLIC_SITE_URL=https://znci.ir`. At any other value the rebuild would republish
  znci.ir as a byte-identical copy of zarrinac.com's home, which is the whole failure mode.

## Deploying on the server

The live copy of the deploy script sits **outside** the repo, so a `git pull` cannot rewrite
it mid-run (same convention as `ops/deploy.sh` for zarrinac.com):

```bash
cp /var/www/znci/app/docker/deploy.sh /var/www/znci/deploy.sh
chmod +x /var/www/znci/deploy.sh
/var/www/znci/deploy.sh
```

It pulls `main`, scans the build config for the malware signature that hit origin/main in
2026-06, asserts the znci identity, rebuilds the image (`docker compose up -d --build`,
~6 min), waits for `/fa` to answer 200, and prunes the dangling image the rebuild leaves
behind. Any merge to `main` therefore reaches znci.ir the same way it reaches
zarrinac.com — one command per host, no sync step, no second repo.
