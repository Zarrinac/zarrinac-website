# Hisense Iran Website — Claude Code Guide

Marketing + admin site for Hisense Iran (zarrinac.com). Also hosts the separate **D'code** TV brand under `/dcode`.
Stack: Next.js 16 App Router · React 19 · TypeScript 6 · PostgreSQL + Prisma 7 · next-intl · Tailwind CSS v4 · MUI 9 · Zod · React Hook Form · Playwright.

> This codebase is a replica of the Hisense Iran (`hisense-ir.com`) site, rebranded to zarrinac.com and extended with the D'code brand section. The package is named `zarrinac` and the **dev server runs on port 3001** (not 3000) so it can run alongside the Hisense site locally.
>
> **Click forwarding:** Every Hisense-replica section is 308-redirected to `https://www.hisense-ir.com` (see `next.config.ts` → `HISENSE_SECTIONS`) to consolidate SEO and funnel traffic to the canonical Hisense site. The D'code section (`/[locale]/dcode/*`) is likewise 308-redirected to its own standalone site **dcode.co.ir** (`next.config.ts` → `DCODE_SITE_URL`), stripping the `/dcode` segment (`/fa/dcode/tvs/r6d` → `dcode.co.ir/fa/tvs/r6d`). NOT redirected: the home (`/[locale]`) and the functional `/admin` + `/api` routes. The sitemap (`app/sitemap.ts`) therefore lists only the home; `robots.ts` keeps the redirected sections crawlable so Google sees the 308 and transfers equity.
>
> **Homepage differentiation (do NOT re-sync to Hisense):** because the home (`/[locale]`) is the only non-redirected marketing page and was byte-identical to `hisense-ir.com`'s home, Google folded the two homepages cross-domain and selected `zarrinac.com` as canonical over hisense — surfacing in hisense GSC as 26× "Duplicate, Google chose different canonical than user" (2026-07). Fix: the home copy (now `content/homeSeoContent.ts`, consumed by `app/[locale]/page.tsx`) is intentionally distinct — title/H1/description/body framed around **Zarrin Namaye Caspian (the company) + the D'code brand**, not a clone "Official Hisense Distributor" page, and targeting its own keywords so the two sites stop cannibalizing. Keep this homepage content diverged from the Hisense repo; only nav-chrome differences (e.g. a menu tab) do NOT break duplicate clustering — main content (title/H1/body) must differ. To give Google a targeted recrawl signal after that differentiation, the home carries its own fresher sitemap `<lastmod>` (`HOME_CONTENT_LAST_MODIFIED` in `lib/seo/site.ts`), separate from the site-wide `SITE_CONTENT_LAST_MODIFIED` baseline and applied only to `path === ''` in `app/sitemap.ts`; bump it again on any future home-content change. The Hisense repo mirrors this same pattern.
>
> **Two deployments, one tree.** The same repo also builds **znci.ir** (Docker on SC1 — see Deployment & Ops). It is a second deployment, not a fork: `NEXT_PUBLIC_SITE_ID` (`lib/siteId.ts`, values `hisense | zarrinac | znci`) picks which home copy block `content/homeSeoContent.ts` builds in, and `HOME_CONTENT_LAST_MODIFIED` in `lib/seo/site.ts` is keyed the same way. The two home blocks must stay **substantively different** (title/H1/body, different keyword targets: zarrinac.com is consumer/brand, znci.ir is trade/corporate) for exactly the reason above — two identical homes on two domains is the duplicate-content condition, whichever domains they are. Anything else that must differ between the deployments belongs behind `SITE_ID` or in env, never in a divergent file.

## Primary Objective: SEO

**SEO efficiency is the top priority for this project.** Every change should be evaluated for SEO impact. When touching pages, components, or content:

- Preserve/extend per-page `generateMetadata` (title, description, `alternates.canonical`, `alternates.languages` hreflang).
- Keep one — and only one — `<h1>` per page; use semantic heading order (h1 → h2 → h3).
- Maintain JSON-LD: `Organization` + `WebSite` (global), `LocalBusiness` (contact/service-center), `Product` (detail pages), `CollectionPage`/`ItemList` (category pages), `BreadcrumbList`, `FAQPage` (FAQ + category copy).
- **Product `offers` decision:** no prices are published (rial volatility), so `buildProductJsonLd` emits **no `offers`** by default. It auto-emits a valid `Offer` when a positive `price` is passed — add a `price` field to the Product model + `ApiProduct` and pass it through to unlock product rich results. Don't emit a price-less Offer (invalid for Google).
- Category SEO copy + FAQs live in `lib/seo/categorySeoContent.ts` (target purchase-intent long-tail: خرید/قیمت/نصب/قطعات یدکی). Keywords in `seo/keywords.txt`.
- Every `<Image>` needs descriptive, localized `alt`. Hero/LCP images use `priority`.
- **Favicon:** declared via `metadata.icons` in `app/layout.tsx` (root layout, propagates everywhere — and to znci.ir, which builds from this tree). Files in `public/` are served but never declared — Google requires a `<link rel="icon">` in the home page `<head>` or it indexes no favicon (GSC showed the generic globe until 2026-09-14). Keep the icon URLs stable; see DOCS.md → "Favicon".
- Both `fa` and `en` must stay in sync — hreflang depends on it.
- Don't break ISR (`revalidate = 3600`) or the sitemap/robots routes.
- SEO infrastructure lives in `lib/seo/` (`site.ts`, `productSchema.ts`, `keywords.ts`), `components/seo/`, `app/sitemap.ts`, `app/robots.ts`.

## Commands

| Command                           | Purpose                                                 |
| --------------------------------- | ------------------------------------------------------- |
| `npm run dev`                     | Dev server at **http://localhost:3001**                 |
| `npm run build`                   | Production build (runs sitemap postbuild)               |
| `npm run start`                   | Serve production build                                  |
| `npm run lint`                    | ESLint check                                            |
| `npm run format`                  | Prettier format                                         |
| `npm run db:migrate`              | Apply Prisma migrations (dev)                           |
| `npm run db:deploy`               | Apply migrations (production)                           |
| `npm run db:seed`                 | Seed all data (via `scripts/seed-all.mjs` orchestrator) |
| `npm run db:seed:products`        | Seed products only                                      |
| `npm run db:seed:dcode`           | Seed D'code catalog only                                |
| `npm run db:seed:locations`       | Seed Iran provinces/cities                              |
| `npm run db:seed:downloads`       | Seed download assets                                    |
| `npm run db:seed:representatives` | Seed service representatives                            |
| `npx playwright test`             | Run E2E tests                                           |

## Architecture

### Routing

- All public pages live under `app/[locale]/` — locales: `fa` (default), `en`
- Root `app/page.tsx` redirects to `/fa`
- Admin portal: `app/admin/` — protected by custom JWT session (no next-auth)
- API: `app/api/` — standard Next.js route handlers with DB→fallback chain
- D'code brand pages: `app/[locale]/dcode/` (landing), `app/[locale]/dcode/tvs/` (list), `app/[locale]/dcode/tvs/[productId]/` (detail) — see the D'code Brand section below

### Data Sources

The app runs without a database. If `DATABASE_URL` is absent, API routes fall back to bundled static data.

| Data            | Primary                                                   | Fallback                                                                                            |
| --------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Products        | DB (`Product` + `ProductCopy` + `TvSpec`)                 | `FALLBACK_PRODUCTS` in `lib/api/products/` (TV/WM/RAC/CAC); refrigerators via `content/RefProducts` |
| D'code TVs      | DB (`DcodeProduct` + `DcodeVariant` + `DcodeProductCopy`) | `DCODE_PRODUCTS` in `content/DcodeProducts.ts` (via `lib/dcode/source.ts`)                          |
| Locations       | DB (`IranProvince` + `IranCity`)                          | `lib/iranLocations.json`                                                                            |
| Service Centers | DB (`ServiceRepresentative`)                              | `lib/iranLocations.json` static data                                                                |
| Downloads       | DB (`DownloadAsset`)                                      | none                                                                                                |

Content source is toggled by `NEXT_PUBLIC_CONTENT_SOURCE` (`"local"` or `"remote"`).

### D'code Brand (`/dcode`)

> **Spun off (2026-06-21):** D'code now has its own standalone project + repo —
> [`Zarrinac/dcode-website`](https://github.com/Zarrinac/dcode-website) (local: `IT-Hisense\dcode-website\dcode`, domain **dcode.co.ir**, dev port 3002). The two D'code codebases have **diverged** — changes here are no longer shared with the standalone site. The `/dcode` section below stays in this repo (pages still build) but is now **308-redirected to dcode.co.ir** (`DCODE_SITE_URL` in `next.config.ts`) and dropped from the sitemap. See the `dcode-standalone-spinoff` memory.

D'code is a **separate TV brand** from Hisense, kept deliberately independent so the two can evolve apart. Today it ships a single LED line (R6D) in three sizes (55"/65"/75").

- **Routes:** `app/[locale]/dcode/` (brand landing), `.../dcode/tvs/` (product list), `.../dcode/tvs/[productId]/` (detail). All ISR (`revalidate = 3600`) with their own `generateMetadata` + JSON-LD. Translations namespace: `DcodePage`.
- **Data:** `lib/dcode/source.ts` — DB-first (`prisma.dcodeProduct`) with fallback to `content/DcodeProducts.ts` when DB is absent/empty (mirrors the products DB→fallback chain). `getDcodeProducts()` / `getDcodeProductById()`.
- **Types:** `types/dcode.ts` (`DcodeProduct`, `DcodeVariant`, `DcodeProductCopy`, `DcodeFeatureCard`, `DcodeCategory = 'led'`). Independent of the Hisense `TvProduct` type.
- **Prisma models:** `DcodeProduct` / `DcodeVariant` / `DcodeProductCopy` + `DcodeCategory` enum (`LED`). Seed via `scripts/seed-dcode.ts` (`npm run db:seed:dcode`).
- **Brand identity:** `lib/dcode/brand.ts` (`DCODE_BRAND` — own black `#0B0B0B` + red `#E30613` palette, distinct from the Hisense theme) and `components/dcode/dcodeTheme.ts` (`DCODE_THEME_STYLE`, `DCODE_BLEED_CLASS`). D'code pages theme off these tokens, **not** the global CSS vars. Logo/components in `components/dcode/`. Assets under `public/dcode/`.
- The red is an approximation of the logo red — verify against the official brand guideline before launch.

### Key Directories

| Path          | Purpose                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `app/`        | Pages, layouts, API routes, sitemap/robots generators                                                      |
| `components/` | UI components grouped by feature (`tv/`, `admin/`, `seo/`, `header/`, `routes/`, `dcode/`, etc.)           |
| `lib/`        | Cross-cutting utilities: DB client, admin auth, media URLs, form schemas, SEO helpers, `dcode/` data+brand |
| `content/`    | Static fallback data (TV catalog, about copy, `DcodeProducts.ts`)                                          |
| `messages/`   | Translation dictionaries — `fa.json` and `en.json`                                                         |
| `prisma/`     | Prisma schema and migration history                                                                        |
| `types/`      | Shared TypeScript types (`tv.ts`, `wm.ts`, `dcode.ts`, `svg.d.ts`)                                         |
| `i18n/`       | next-intl routing config and request helpers                                                               |
| `scripts/`    | DB seed scripts                                                                                            |
| `seo/`        | Keyword list helpers                                                                                       |

### Localization

- **Server components:** `getTranslations('Namespace')` → `t('key')`
- **Client components:** `useTranslations('Namespace')`
- Keys are namespaced by page/feature (e.g., `Routes.Complaint`, `Header`, `TvHisensePage`)
- `fa.json` and `en.json` must always stay in sync
- Persian = RTL (`dir="rtl"`), English = LTR — test both locales whenever touching layout components

### Media URLs

Always use the `mediaUrl(path)` helper from `lib/mediaUrl.ts`. It switches between `/` (local) and `NEXT_PUBLIC_MEDIA_BASE_URL` (CDN) based on env. Never hardcode `/media/` paths.

Printed-catalog code (`lib/catalog/catalogAssets.ts`, `components/catalog/*`) is **mirrored from the hisense repo** — keep it byte-identical there. Only `catalog-general-full.pdf` ships to this server's media: the per-series spreads are unreachable here because `products/*` and `refrigerator/*` 308-redirect to hisense. The homepage catalog copy must stay worded differently from hisense's. Details in DOCS.md → "Printed catalog pages".

## Code Conventions

### TypeScript

- Strict mode enabled — no `any` unless absolutely unavoidable
- Path alias `@/` maps to the repo root (e.g., `@/lib/db`, `@/components/Header`)
- Prisma client: always import the singleton from `lib/db.ts`, never instantiate `new PrismaClient()` directly in pages or route handlers

### Components

- Server components by default; add `'use client'` only when state, effects, or browser APIs are required
- Feature-grouped under `components/`: `tv/`, `admin/`, `seo/`, `header/`, `complaint/`, `survey/`, `service-centers/`, `home/`, `hero/`, `routes/`, `theme/`
- Form components: use `react-hook-form` + Zod via `@hookform/resolvers/zod`

### Styling

- Tailwind v4 is loaded via `@import 'tailwindcss';` — **not** with `@tailwind base/components/utilities` directives
- Theme-aware colors through CSS variables: use `bg-(--surface-color)`, `text-(--text-primary)`, etc. — not hardcoded Tailwind palette colors
- Dark mode: toggled via `data-theme="dark"` attribute on `<html>` (set by `ThemeProvider`)
- Breakpoint tokens are defined in `@theme {}` blocks inside `assets/styles/globals.css`
- Use MUI components (`Autocomplete`, `TextField`, `Select`) for interactive form elements — not custom equivalents

### Database

- JSON fields (`gallery`, `sections`, `banners`, `blocks`) are stored as `Json` in Prisma — always type-assert when reading (`as MyType`)
- Never call `prisma.$disconnect()` inside route handlers or server components — only in seed scripts
- Indexes exist on `category`, `locale`, `provinceId`, `cityId` — filter on these fields when writing queries

### API Routes

- Follow the pattern in `app/api/products/route.ts`: set both `Cache-Control` and `X-Data-Source` response headers
- Return `{ error: string }` objects for failures — do not throw uncaught errors from route handlers
- Product endpoints implement a DB→fallback chain: attempt DB query, catch errors, fall back to static data

### Admin Auth

- Session cookie name: `hisense_admin_session` (httpOnly, Secure, 8-hour expiry)
- Always verify sessions using `verifyAdminSession()` from `lib/admin/auth.ts` inside admin layouts and server actions. `auth.ts` is **edge-safe** (Web Crypto, no DB) — it runs in `proxy.ts` middleware, so never add Prisma or `node:crypto` imports to it.
- **Credentials are DB-first:** the `AdminUser` table (`username`, `passwordHash` via Node `scrypt` in `lib/admin/password.ts`, `role`, `isActive`) is the source of truth. `lib/admin/credentials.ts` → `authenticateAdmin()` is **Node-only** (Prisma + scrypt), called only from the login route — never from middleware. Env `ADMIN_USERNAME`/`ADMIN_PASSWORD` is a bootstrap/outage fallback (used only when no `AdminUser` rows exist or the DB is down).
- `role` enum (`SUPER_ADMIN | ADMIN | SERVICE_MANAGER | CIC_MANAGER | EDITOR`) gates admin **sections** via `lib/admin/access.ts` (`ROLE_SECTIONS`, `canAccessSection`, `sectionForPath`, `canManageUsers`). Enforced in 3 layers: middleware (`proxy.ts`), nav filtering (`AdminShell`), and server actions. `SERVICE_MANAGER` (مدیر خدمات) and `CIC_MANAGER` (مدیر CIC) share identical access = dashboard + complaints + surveys + service centers (+ trimmed dashboard via `hasTrimmedDashboard`); only the title differs.
- User-management UI at `/admin/users` (SUPER_ADMIN only): `app/admin/users/{page.tsx,actions.ts}` + `components/admin/AdminUsersManager.tsx`. Guards: no self-delete, no removing the last active super admin.
- MUI admin form controls are themed for the locale font via a `ThemeProvider` in `AdminShell` — without it they fall back to Roboto/Arial and don't render the Persian face.
- This DB-backed admin auth is **shared with the Hisense repo** (synced via `.agents/skills/hisense-sync`); the `prisma/` AdminUser model + migrations must stay byte-identical to Hisense — see [[shared-db-consolidation]].
- Manage users via CLI: `npm run db:seed:admins` (bootstrap env admin → DB), `npm run admin:create <username> <password> [role]`.
- Login rate limiting is enforced by `lib/admin/rateLimit.ts` (in-memory, IP-based) — only used at the login endpoint

### Forms (Complaints & Surveys)

- Zod schemas live in `lib/complaints/schema.ts` and `lib/surveys/schema.ts`
- Persian digit normalization (`۱` → `1`) is handled in Zod transforms — do not duplicate in component code
- Phone numbers must match `09XXXXXXXXX` pattern (enforced by schema)

## Non-Obvious Gotchas

1. **`withNextIntl()` must stay** — `next.config.ts` wraps the config with the next-intl plugin. Removing it silently breaks all locale routing with no clear error.

2. **No `middleware.ts`** — i18n routing is handled by the next-intl plugin config. Do not create a `middleware.ts` file — it will conflict with the plugin's own middleware.

3. **Tailwind v4 syntax** — Custom theme tokens go inside `@theme {}` blocks in `globals.css`, not in the `extend` key of `tailwind.config.ts`. Using `@tailwind` directives instead of `@import 'tailwindcss'` will break the build.

4. **ISR and `cache: 'no-store'` don't mix** — Product listing pages export `revalidate = 3600`. Adding `cache: 'no-store'` to fetch calls inside those pages defeats ISR and can cause build failures.

5. **Locale validation throws** — `app/[locale]/layout.tsx` validates the locale param against the allowlist in `i18n/routing.ts`. Adding a new locale requires updating `routing.ts` first, or the layout will throw a 404.

6. **Fallback product coverage** — `FALLBACK_PRODUCTS` in `lib/api/products/normalizers.ts` covers TVs, washing machines (WMS), residential AC (RAC), and commercial AC (CAC). Refrigerators come from a separate source (`content/RefProducts`). The sitemap is built from both, so all product detail URLs resolve without a DB.

7. **RTL flips layout** — Persian (fa) is RTL. Flex direction, carousel scroll direction, padding/margin semantics, and text alignment all reverse. Always test both locales after touching any layout or carousel component.

8. **DB is primary, JSON is fallback** — `lib/serviceCenterSource.ts`, `lib/iranLocationSource.ts`, and `lib/dcode/source.ts` query the database first. The JSON/TS content files (`lib/*.json`, `content/DcodeProducts.ts`) are emergency fallbacks, not the authoritative data source.

9. **`db:seed` runs through an orchestrator** — `npm run db:seed` invokes `scripts/seed-all.mjs`, not a plain `&&` chain. On Windows + Node the `tsx` + `@prisma/adapter-pg` + `pg` Pool teardown intermittently exits non-zero **after** the seed already committed. The runner keys success off each seed's completion sentinel (e.g. `"D'code seed complete."`) rather than the exit code, so a benign post-commit teardown crash doesn't abort the remaining seeds — but a real failure (no sentinel) still fails the run. Add new seeds to the `SEEDS` array with their sentinel string.

## Environment Variables

| Variable                               | Required | Purpose                                                                     |
| -------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`                         | Optional | PostgreSQL connection for Prisma; app runs on static fallback if absent     |
| `NEXT_PUBLIC_SITE_URL`                 | Yes      | Canonical/OG base URL (e.g., `https://zarrinac.com`)                        |
| `ADMIN_USERNAME`                       | Fallback | Bootstrap/outage admin login (DB `AdminUser` is primary)                    |
| `ADMIN_PASSWORD`                       | Fallback | Bootstrap/outage admin login (used only when no `AdminUser` rows / DB down) |
| `ADMIN_SESSION_SECRET`                 | Yes      | HMAC-SHA256 signing key for session tokens (required for any login)         |
| `INTERNAL_API_BASE_URL`                | Dev      | Internal fetch base (dev: `http://localhost:3001`)                          |
| `NEXT_PUBLIC_MEDIA_BASE_URL`           | Optional | CDN base for product images (defaults to `/`)                               |
| `NEXT_PUBLIC_CONTENT_SOURCE`           | Optional | `"local"` or `"remote"` content mode                                        |
| `NEXT_PUBLIC_GA_ID`                    | Optional | Google Analytics measurement ID                                             |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console token                                                 |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Optional | Bing Webmaster Tools token                                                  |

Copy `.env.example` → `.env.local` to get started.

## Testing

- **E2E:** Playwright — `npx playwright test`
- **No unit test framework** — correctness relies on TypeScript strict mode and ESLint
- **Pre-commit:** Husky + lint-staged runs `lint` and `format` automatically on staged files — do not bypass with `--no-verify`

## Git

- Batch all changes from a task into one commit at the end — no per-fix micro-commits.

## Deployment & Ops

Workflow: **develop locally (Windows) → push branch → PR → merge to `main` → server pulls `main` → deploy.** The server only ever sits on `main` and only pulls — never edit code directly on the server.

**Server:** zarrinac runs on its **own** Ubuntu host `zarrin-ng-site` (`172.17.0.19`), user `reza`, app at `/var/www/zarrinac/app`, served by PM2 (`zarrinac`, `ecosystem.config.cjs`) behind Apache. It reads the **shared `zarrin` Postgres on `nexzarrin`** (`172.17.0.10:5432`, `sslmode=no-verify`) and must set `NEXT_PUBLIC_SITE_ID=zarrinac`. Canonical copies of all server scripts live in `ops/` (source of truth) — see `ops/README.md` for the sync-to-server steps; the **live** copies run from outside the repo so a `git pull` never rewrites an executing script.

| Script (server / repo)                              | Purpose                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/var/www/zarrinac/deploy.sh` (`ops/deploy.sh`)     | `git restore sitemap` → `git pull origin main` → malware-signature scan of build config → `node ops/preflight.mjs` → `npm ci` (full, devDeps needed to build) → `npm run db:deploy` → `rm -rf .next/cache` → `npm run build` → `pm2 reload … --update-env` → background SEO audit |
| `ops/preflight.mjs`                                 | Deploy env guard: asserts `NEXT_PUBLIC_SITE_ID=zarrinac`, the shared-DB target, required admin secrets, `ecosystem.config.cjs`, and port 5432 reachability — without printing secret values                                                                                       |
| `/usr/local/bin/zarrinac-monitor.sh`                | Cron (daily, **currently disabled**): deterministic `df`/`free`/`pm2 jlist` thresholds (disk >80%, mem >90%, PM2 not online) → `/var/log/zarrinac-monitor.log`. No API calls — `api.anthropic.com` 403s from this host's IP, so the Claude CLI + key were removed from the server |
| `/usr/local/bin/weekly-backup.sh`                   | Cron (Sun 03:00): lean backup — `pg_dumpall` + `/etc` + app secrets (`.env`, `ecosystem.config.cjs`) to `/backup`, keeps last 4 weeks                                                                                                                                             |
| `ops/seo-audit.mjs` + `/usr/local/bin/seo-audit.sh` | Deterministic SEO regression checker (title/desc/canonical/hreflang/h1/size/JSON-LD over the live sitemap); logs findings, no LLM triage. **Currently disabled** on the server (installed non-executable, no cron)                                                                |
| `.husky/pre-commit`                                 | `lint-staged` (lint + format)                                                                                                                                                                                                                                                     |
| `.husky/pre-push`                                   | **Not in the repo** — never tracked, and absent locally. Was a `git diff origin/main...HEAD \| claude -p` review. Don't count on it gating pushes, and don't re-add an LLM call to it (see the Anthropic-API note in Deploy gotchas)                                              |

Deploy gotchas: (a) server runs `git restore public/sitemap-0.xml` before pull (legacy generated file causes conflicts) — the native `app/sitemap.ts` route is the source of truth now; (b) `deploy.sh` uses a **full** `npm ci` (not `--omit=dev`) because building Next on the server needs devDependencies (typescript, `@tailwindcss/postcss`, dotenv); (c) it clears `.next/cache` before building so stale ISR/Data-Cache content isn't served after a deploy; (d) it must run as `reza`, never root (a root-owned `.next` breaks PM2).

### znci.ir (second deployment, Docker on SC1)

znci.ir builds from this same repo with a different identity. Host **SC1** (openSUSE Leap 16, `172.17.0.36`, ssh alias `znci-sc1`), app at `/var/www/znci/app`, media at `/var/www/znci/media`, Apache reverse-proxying `127.0.0.1:3010`. Ships **DB-less**, so it never touches the shared `zarrin` Postgres.

| Script (server / repo)                         | Purpose                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/var/www/znci/deploy.sh` (`docker/deploy.sh`) | `git pull origin main` → malware-signature scan → identity preflight → `docker compose up -d --build` → health gate → `docker image prune` |

- The identity preflight **aborts** unless `docker/.env` has `NEXT_PUBLIC_SITE_ID=znci` and `NEXT_PUBLIC_SITE_URL=https://znci.ir`. At any other value the rebuild republishes znci.ir carrying zarrinac.com's home copy — the duplicate-content trap described at the top of this file.
- `NEXT_PUBLIC_*` are **inlined at build time**, so an identity or code change needs `--build` (~6 min), never a bare restart.
- Live script sits outside the repo (same reason as zarrinac's): `cp /var/www/znci/app/docker/deploy.sh /var/www/znci/deploy.sh && chmod +x`.
- Host-side setup that is not in git (Docker `bip` moved off the `172.17.0.0/16` LAN range, SELinux `container_file_t` + `httpd_can_network_connect`, port bound to loopback) is documented in `docker/README.md`.
- **TLS is live** (2026-09-09): Certum DV cert for `znci.ir` + `www.znci.ir`, **expires 2027-03-27** (DV = ~6-month life, so it renews about twice as often as zarrinac.com's wildcard — reminder for 2027-03). Chain + key at `/etc/ssl/znci/`; the vhost's canonical copy is `docker/znci-vhost.conf`. On openSUSE the `SSL` flag in `/etc/sysconfig/apache2` — not the vhost — is what opens `Listen 443`. Runbook in `docker/README.md` → "TLS".

**Update flow:** one merge to `main` feeds both deployments — `/var/www/zarrinac/deploy.sh` on `zarrin-ng-site` and `/var/www/znci/deploy.sh` on SC1. No sync step, no second repo.

## DB & Media Workflow

- **Schema/data changes:** make them locally against the local Postgres (`npm run db:migrate`, `npm run db:seed`), verify, then promote. Migrations ship in `prisma/` and apply on the server via `npm run db:deploy` inside `deploy.sh`.
- **DB data promotion (current manual flow):** `pg_dump -Fc` local `zarrin` DB → `scp` to server → on server: `pm2 stop` → `dropdb -h localhost -U reza_sf --force zarrin` → `createdb -h localhost -U reza_sf -O reza_sf zarrin` → `pg_restore -h localhost -U reza_sf --no-owner --no-privileges -d zarrin <dump>` → restart. **Gotcha:** OS user is `reza` but the Postgres role is `reza_sf`; bare `dropdb`/`createdb` fail with `role "reza" does not exist`, so always pass `-h localhost -U reza_sf`. `reza_sf` was granted `CREATEDB` on 2026-06-16 (otherwise `createdb` needs `sudo -u postgres createdb -O reza_sf zarrin`). Restore **as `reza_sf`** so it owns the tables. The DB is **shared with hisense** — a drop/restore replaces both sites' submissions. Full detail in DOCS.md → "DB promotion".
- **Media promotion:** media lives **outside git** (local `…\zarrin\media`, server `/var/www/zarrinac/media`). Use `ops/upload-media.ps1` (local, Windows OpenSSH key auth `~/.ssh/zarrin_ng_site_ed25519`) → it scp-uploads then runs `sudo sync-media.sh` (`ops/sync-media.sh`) on the server, which rsync `--delete` mirrors into the live dir and applies `chmod -R a+rX`. The `chmod` is mandatory — the Next app runs as `reza` and reads media off disk to optimize images; a `www-data`-only/`700` dir causes `EACCES` and a 503 crash-loop. Optimize first with `node ops/optimize-media.mjs --apply` (the upload mirrors with `--delete`). Full detail in `ops/README.md`.
- Local DB name and server DB name are both `zarrin`, owner `reza_sf`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
