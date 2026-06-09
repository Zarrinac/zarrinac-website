# Hisense Iran Website — Codex Guide

Marketing + admin site for Hisense Iran (zarrinac.com).
Stack: Next.js 16 App Router · React 19 · TypeScript 6 · PostgreSQL + Prisma 7 · next-intl · Tailwind CSS v4 · MUI 9 · Zod · React Hook Form · Playwright.

## Primary Objective: SEO

**SEO efficiency is the top priority for this project.** Every change should be evaluated for SEO impact. When touching pages, components, or content:

- Preserve/extend per-page `generateMetadata` (title, description, `alternates.canonical`, `alternates.languages` hreflang).
- Keep one — and only one — `<h1>` per page; use semantic heading order (h1 → h2 → h3).
- Maintain JSON-LD: `Organization` + `WebSite` (global), `LocalBusiness` (contact/service-center), `Product` (detail pages), `CollectionPage`/`ItemList` (category pages), `BreadcrumbList`, `FAQPage` (FAQ + category copy).
- **Product `offers` decision:** no prices are published (rial volatility), so `buildProductJsonLd` emits **no `offers`** by default. It auto-emits a valid `Offer` when a positive `price` is passed — add a `price` field to the Product model + `ApiProduct` and pass it through to unlock product rich results. Don't emit a price-less Offer (invalid for Google).
- Category SEO copy + FAQs live in `lib/seo/categorySeoContent.ts` (target purchase-intent long-tail: خرید/قیمت/نصب/قطعات یدکی). Keywords in `seo/keywords.txt`.
- Every `<Image>` needs descriptive, localized `alt`. Hero/LCP images use `priority`.
- Both `fa` and `en` must stay in sync — hreflang depends on it.
- Don't break ISR (`revalidate = 3600`) or the sitemap/robots routes.
- SEO infrastructure lives in `lib/seo/` (`site.ts`, `productSchema.ts`, `keywords.ts`), `components/seo/`, `app/sitemap.ts`, `app/robots.ts`.

## Commands

| Command                           | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `npm run dev`                     | Dev server at http://localhost:3000       |
| `npm run build`                   | Production build (runs sitemap postbuild) |
| `npm run start`                   | Serve production build                    |
| `npm run lint`                    | ESLint check                              |
| `npm run format`                  | Prettier format                           |
| `npm run db:migrate`              | Apply Prisma migrations (dev)             |
| `npm run db:deploy`               | Apply migrations (production)             |
| `npm run db:seed`                 | Seed all data                             |
| `npm run db:seed:products`        | Seed products only                        |
| `npm run db:seed:locations`       | Seed Iran provinces/cities                |
| `npm run db:seed:downloads`       | Seed download assets                      |
| `npm run db:seed:representatives` | Seed service representatives              |
| `npx playwright test`             | Run E2E tests                             |

## Architecture

### Routing

- All public pages live under `app/[locale]/` — locales: `fa` (default), `en`
- Root `app/page.tsx` redirects to `/fa`
- Admin portal: `app/admin/` — protected by custom JWT session (no next-auth)
- API: `app/api/` — standard Next.js route handlers with DB→fallback chain

### Data Sources

The app runs without a database. If `DATABASE_URL` is absent, API routes fall back to bundled static data.

| Data            | Primary                                   | Fallback                                                                                            |
| --------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Products        | DB (`Product` + `ProductCopy` + `TvSpec`) | `FALLBACK_PRODUCTS` in `lib/api/products/` (TV/WM/RAC/CAC); refrigerators via `content/RefProducts` |
| Locations       | DB (`IranProvince` + `IranCity`)          | `lib/iranLocations.json`                                                                            |
| Service Centers | DB (`ServiceRepresentative`)              | `lib/iranLocations.json` static data                                                                |
| Downloads       | DB (`DownloadAsset`)                      | none                                                                                                |

Content source is toggled by `NEXT_PUBLIC_CONTENT_SOURCE` (`"local"` or `"remote"`).

### Key Directories

| Path          | Purpose                                                                                |
| ------------- | -------------------------------------------------------------------------------------- |
| `app/`        | Pages, layouts, API routes, sitemap/robots generators                                  |
| `components/` | UI components grouped by feature (`tv/`, `admin/`, `seo/`, `header/`, `routes/`, etc.) |
| `lib/`        | Cross-cutting utilities: DB client, admin auth, media URLs, form schemas, SEO helpers  |
| `content/`    | Static fallback data (TV catalog, about copy)                                          |
| `messages/`   | Translation dictionaries — `fa.json` and `en.json`                                     |
| `prisma/`     | Prisma schema and migration history                                                    |
| `types/`      | Shared TypeScript types (`tv.ts`, `wm.ts`, `svg.d.ts`)                                 |
| `i18n/`       | next-intl routing config and request helpers                                           |
| `scripts/`    | DB seed scripts                                                                        |
| `seo/`        | Keyword list helpers                                                                   |

### Localization

- **Server components:** `getTranslations('Namespace')` → `t('key')`
- **Client components:** `useTranslations('Namespace')`
- Keys are namespaced by page/feature (e.g., `Routes.Complaint`, `Header`, `TvHisensePage`)
- `fa.json` and `en.json` must always stay in sync
- Persian = RTL (`dir="rtl"`), English = LTR — test both locales whenever touching layout components

### Media URLs

Always use the `mediaUrl(path)` helper from `lib/mediaUrl.ts`. It switches between `/` (local) and `NEXT_PUBLIC_MEDIA_BASE_URL` (CDN) based on env. Never hardcode `/media/` paths.

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
- Always verify sessions using `verifyAdminSession()` from `lib/admin/auth.ts` inside admin layouts and server actions
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

8. **DB is primary, JSON is fallback** — `lib/serviceCenterSource.ts` and `lib/iranLocationSource.ts` query the database first. The JSON files in `lib/` are emergency fallbacks, not the authoritative data source.

## Environment Variables

| Variable                               | Required | Purpose                                                                 |
| -------------------------------------- | -------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`                         | Optional | PostgreSQL connection for Prisma; app runs on static fallback if absent |
| `NEXT_PUBLIC_SITE_URL`                 | Yes      | Canonical/OG base URL (e.g., `https://zarrinac.com`)                  |
| `ADMIN_USERNAME`                       | Yes      | Admin login credential                                                  |
| `ADMIN_PASSWORD`                       | Yes      | Admin login credential                                                  |
| `ADMIN_SESSION_SECRET`                 | Yes      | HMAC-SHA256 signing key for session tokens                              |
| `INTERNAL_API_BASE_URL`                | Dev      | Internal fetch base (dev: `http://localhost:3000`)                      |
| `NEXT_PUBLIC_MEDIA_BASE_URL`           | Optional | CDN base for product images (defaults to `/`)                           |
| `NEXT_PUBLIC_CONTENT_SOURCE`           | Optional | `"local"` or `"remote"` content mode                                    |
| `NEXT_PUBLIC_GA_ID`                    | Optional | Google Analytics measurement ID                                         |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console token                                             |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Optional | Bing Webmaster Tools token                                              |

Copy `.env.example` → `.env.local` to get started.

## Testing

- **E2E:** Playwright — `npx playwright test`
- **No unit test framework** — correctness relies on TypeScript strict mode and ESLint
- **Pre-commit:** Husky + lint-staged runs `lint` and `format` automatically on staged files — do not bypass with `--no-verify`

## Git

- Batch all changes from a task into one commit at the end — no per-fix micro-commits.

## Deployment & Ops

Workflow: **develop locally (Windows) → push branch → PR → merge to `main` → server pulls `main` → deploy.** The server only ever sits on `main` and only pulls — never edit code directly on the server.

**Server:** Ubuntu, `nexzarrin`, app at `/var/www/hisense-ir/app`, served by PM2 (`hisense-ir`, `ecosystem.config.cjs`) behind Apache.

| Script (server)                     | Purpose                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `/var/www/hisense-ir/deploy.sh`     | `git pull origin main` → `npm ci --omit=dev` → `npm run db:deploy` → `npm run build` → `pm2 reload ecosystem.config.cjs --update-env` |
| `/usr/local/bin/hisense-monitor.sh` | Cron: pipes `df`/`free`/`pm2 jlist` to `Codex -p` for anomaly flagging → `/var/log/hisense-monitor.log`                               |
| `/usr/local/bin/weekly-backup.sh`   | Cron: lean backup — `pg_dumpall` + `/etc` + app secrets (`.env`, `ecosystem.config.cjs`) to `/backup`, keeps last 4 weeks             |
| `.husky/pre-commit`                 | `lint-staged` (lint + format)                                                                                                         |
| `.husky/pre-push`                   | `git diff origin/main...HEAD \| Codex -p` review; non-zero exit blocks push                                                           |

Deploy gotcha: server runs `git restore public/sitemap-0.xml` before pull (legacy generated file causes conflicts) — the native `app/sitemap.ts` route is the source of truth now.

## DB & Media Workflow

- **Schema/data changes:** make them locally against the local Postgres (`npm run db:migrate`, `npm run db:seed`), verify, then promote. Migrations ship in `prisma/` and apply on the server via `npm run db:deploy` inside `deploy.sh`.
- **DB data promotion (current manual flow):** `pg_dump -Fc` local `zarrin` DB → `pscp` to server → on server: `pm2 stop` → `dropdb`/`createdb -O reza_sf zarrin` → `pg_restore --no-owner --no-privileges` → restart.
- **Media promotion:** use `ops/upload-media.ps1` (local) → `ops/sync-media.sh` (server). Manual: `pscp -r` local media to server `~/`, then `rsync -av --delete /home/reza/media/ /var/www/hisense-ir/media/`, `chown -R www-data:www-data`, **and `chmod -R a+rX`**. The `chmod` is mandatory — the Next app runs as `reza` and reads media off disk; a `www-data`-only/`700` dir causes `EACCES` and a 503 crash-loop.
- Local DB name and server DB name are both `zarrin`, owner `reza_sf`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
