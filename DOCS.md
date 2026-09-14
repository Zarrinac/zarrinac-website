# Zarrinac / Hisense Iran Web App — Documentation

Marketing and support website for Zarrinac / Hisense Iran (zarrinac.com). Bi-lingual (Persian/English), SEO-first, with a full admin portal, DB-first catalog, and a retained D'code brand section.

**Last updated: 2026-09-09**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tech Stack](#tech-stack)
3. [Environment Variables](#environment-variables)
4. [Directory Map](#directory-map)
5. [Database Schema](#database-schema)
6. [Data & API Flow](#data--api-flow)
7. [Routing & Pages](#routing--pages)
8. [Admin Portal](#admin-portal)
9. [Product Catalog](#product-catalog)
10. [Service Centers](#service-centers)
11. [Complaint & Survey Forms](#complaint--survey-forms)
12. [Downloads](#downloads)
13. [Internationalization](#internationalization)
14. [Styling & Theming](#styling--theming)
15. [SEO Infrastructure](#seo-infrastructure)
16. [Ops & Deployment](#ops--deployment)
17. [Security Notes](#security-notes)
18. [Content Management Tips](#content-management-tips)
19. [Known Gotchas](#known-gotchas)

---

## Quick Start

Requirements: Node 20+, npm, PostgreSQL (optional — app runs on static fallback without it).

```bash
cp .env.example .env.local   # fill DATABASE_URL, NEXT_PUBLIC_SITE_URL, admin secrets
npm install
npm run dev                  # http://localhost:3001
```

| Command                           | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                     | Dev server at http://localhost:3001                              |
| `npm run build`                   | Production build (auto-runs sitemap postbuild)                   |
| `npm run start`                   | Serve production build                                           |
| `npm run lint`                    | ESLint check                                                     |
| `npm run format`                  | Prettier format                                                  |
| `npm run db:migrate`              | Apply Prisma migrations (dev, creates migration file)            |
| `npm run db:deploy`               | Apply existing migrations (production)                           |
| `npm run db:seed`                 | Seed all data (products + D'code + locations + downloads + reps) |
| `npm run db:seed:products`        | Seed products only                                               |
| `npm run db:seed:dcode`           | Seed D'code brand products only                                  |
| `npm run db:seed:locations`       | Seed Iran provinces and cities                                   |
| `npm run db:seed:downloads`       | Seed download assets                                             |
| `npm run db:seed:representatives` | Seed service representatives                                     |
| `npx playwright test`             | Run E2E tests                                                    |

---

## Tech Stack

| Layer     | Technology                                                          |
| --------- | ------------------------------------------------------------------- |
| Framework | Next.js 16 App Router, React 19, TypeScript (strict)                |
| i18n      | next-intl (locales: `fa` default, `en`)                             |
| Database  | PostgreSQL via Prisma 7 (optional — static fallback when absent)    |
| Styling   | Tailwind CSS v4 + CSS custom properties for theming                 |
| UI        | MUI 9 (Autocomplete, TextField, Select for forms)                   |
| Forms     | react-hook-form + Zod via @hookform/resolvers/zod                   |
| SEO       | Hand-written JSON-LD, generateMetadata, native app/sitemap.ts route |
| Analytics | Optional GA/GTM scripts, rendered only when public env IDs are set  |
| Testing   | Playwright for E2E                                                  |
| Linting   | ESLint + Prettier, enforced by Husky pre-commit (lint-staged)       |

---

## Environment Variables

| Variable                               | Required | Purpose                                                                  |
| -------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`                         | Optional | PostgreSQL connection string; app runs on static fallback if absent      |
| `NEXT_PUBLIC_SITE_URL`                 | Yes      | Canonical/OG base URL (e.g., `https://zarrinac.com`)                     |
| `ADMIN_USERNAME`                       | Yes      | Admin portal login username                                              |
| `ADMIN_PASSWORD`                       | Yes      | Admin portal login password                                              |
| `ADMIN_SESSION_SECRET`                 | Yes      | HMAC-SHA256 key for signing session tokens                               |
| `INTERNAL_API_BASE_URL`                | Dev      | Internal fetch base (`http://localhost:3001` in dev)                     |
| `NEXT_PUBLIC_MEDIA_BASE_URL`           | Optional | CDN base for product images (defaults to `/` for local serving)          |
| `NEXT_PUBLIC_CONTENT_SOURCE`           | Optional | `"local"` or `"remote"` media mode; product data remains DB-first        |
| `NEXT_PUBLIC_GA_ID`                    | Optional | Google Analytics 4 measurement ID; leave unset/commented to disable      |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token; unset unless zarrinac-specific |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Optional | Bing Webmaster Tools verification token; unset unless zarrinac-specific  |

---

## Directory Map

```
app/                    Pages, layouts, API routes, sitemap/robots generators
  [locale]/             All public-facing pages (locale = fa | en)
  admin/                Admin portal (JWT-protected)
  api/                  Route handlers (products, admin auth, complaints, surveys)
  sitemap.ts            Native Next.js sitemap generator (replaces next-sitemap)
  robots.ts             Robots.txt generator
components/             UI components grouped by feature
  admin/                AdminShell, AdminPageHeader, AdminStatusCard, AdminSubmissionTables
  complaint/            ComplaintForm (multi-step)
  dcode/                D'code brand logo/showcase components and scoped theme
  header/               DesktopNavigation, MobileNavPanel, SearchOverlay
  hero/                 HeroBanner (homepage carousel)
  home/                 CategorySpotlights
  refrigerator/         RefrigeratorHero
  routes/               createRoutePage scaffold, RouteHero
  seo/                  JsonLd, StructuredData, Analytics, GtmNoScript,
                        PageBreadcrumbs, CategorySeoSection, ProductFaqSection,
                        OfficialLinksSection
  service-centers/      ServiceCenterFinder (province/city autocomplete + results table)
  survey/               SurveyForm (satisfaction survey)
  theme/                ThemeProvider, ThemeToggle (dark/light)
  tv/                   TvHeroCarousel, TvProductShowcase, ContentSections,
                        OverlayContentSections, StackedContentSections,
                        BeforeAfterSlider, FeatureCardImage
  tv/product-detail/    Breadcrumbs, BannerSection, FeatureCardsGrid, FeatureIntro,
                        HeroMedia, MobileHeader, SectionGroupsRenderer,
                        ComparisonSections, SpecsSection
  Footer.tsx, Header.tsx, LanguageSwitcher.tsx, UnderConstruction.tsx
content/                Static fallback data
  tvProducts.ts         (legacy) TV catalog fallback
  DcodeProducts.ts      D'code catalog fallback
  RefProducts/          Refrigerator catalog fallback
  about/                About-page copy
i18n/                   next-intl routing config and request helpers
lib/                    Cross-cutting utilities
  admin/                auth.ts, dashboard.ts, rateLimit.ts, submissions.ts,
                        i18n.ts, i18n.server.ts, url.ts
  api/products/         normalizers.ts, types.ts, categories.ts, mediaPaths.ts
  complaints/           schema.ts (Zod)
  dcode/                D'code DB-first source and brand helpers
  surveys/              schema.ts (Zod)
  seo/                  site.ts, productSchema.ts, productMeta.ts, productFaq.ts,
                        categorySeoContent.ts, localBusiness.ts, keywords.ts
  contentSource.ts      Toggles local/remote content mode
  db.ts                 Prisma singleton
  iranLocations.ts      Province/city JSON fallback helper
  iranLocationSource.ts DB-first location source with JSON fallback
  serviceCenterSource.ts DB-first service-center source with JSON fallback
  mediaUrl.ts           CDN/local media URL helper
messages/               Translation dictionaries — fa.json and en.json
ops/                    Server operational scripts (version-controlled source of truth)
  deploy.sh             Pull → install → migrate → build → PM2 reload
  sync-media.sh         Rsync media to live dir + fix owner/perms
  upload-media.ps1      Windows-side: scp media + trigger sync over SSH
  preflight.mjs         Server deploy guard for Zarrinac env + nexzarrin DB target
  optimize-media.mjs    Pre-upload image optimization
  seo-audit.mjs         Deterministic SEO checker (title/desc/canonical/h1/JSON-LD)
  cron/                 zarrinac-monitor.sh, weekly-backup.sh, seo-audit.sh
prisma/                 Prisma schema + migration history
scripts/                DB seed scripts
seo/                    keywords.txt + keywords helper
types/                  tv.ts, wm.ts, dcode.ts, svg.d.ts
assets/styles/          globals.css (Tailwind v4 + CSS vars), Swiper/Select2 styles
public/                 Images, fonts, PWA manifest
```

---

## Database Schema

All models live in `prisma/schema.prisma`. Postgres is required for the full experience; the app degrades gracefully to static fallback data when `DATABASE_URL` is absent.

### Product catalog

**`Product`** — master product record shared across locales.

- `id` (string PK), `slug` (unique), `category` (enum), `sku`, `series`, `size`, `sizes[]`
- `position` stores curated display order, seeded from source content so DB-backed listings stay stable.
- Rich content stored as `Json` fields: `gallery`, `banners`, `featureCards`, `sectionGroups`, `contentSections`, `stackedSections`, `bottomStackedSections`, `comparisonSections`, `experienceSection`, `badges`, `specs`
- Relations: `copies` (ProductCopy[]), `tvSpec` (TvSpec?)

**`ProductCopy`** — locale-specific text for a product.

- `(productId, locale)` unique pair — one row per product per language
- Fields: `name`, `tagline`, `description`, `highlights[]`, `blocks` (Json)

**`TvSpec`** — TV-specific spec sheet (1:1 with Product).

- `panel`, `resolution`, `refreshRate`, `os`, `sound`, `connectivity[]`, `tuner`

```
ProductCategory enum: TVS | WMS | RAC | CAC | REFRIGERATOR | TV_DCODE
```

### D'code catalog

D'code is modeled separately from the Hisense `Product` tree because it is a distinct brand section.

**`DcodeProduct`** — one D'code product line, currently the LED `R6D` family.

- `id`, `slug`, `brand`, `category`, `series`, panel/spec fields, warranty, hero media, `gallery`, `featureCards`, `remotes`, `specs`
- Relations: `variants` (DcodeVariant[]), `copies` (DcodeProductCopy[])

**`DcodeVariant`** — size/SKU-specific records with dimensions and weight.

**`DcodeProductCopy`** — localized product copy per locale.

### Locations

**`IranProvince`** — 31 provinces with bilingual names and sort order.

**`IranCity`** — Cities linked to a province. Index on `(provinceId, sortOrder)`.

### Forms

**`ComplaintSubmission`** — Stores after-sales complaint submissions.

- Unique `referenceCode` generated at submission time.
- Key fields: `fullName`, `phone`, `email?`, `productCategory`, `productModel`, `complaintTopic`, `preferredContactMethod`, `city`, `description`, `status` (default `NEW`).

**`SurveySubmission`** — After-service satisfaction survey responses.

- Unique `referenceCode`. Rating fields: `communicationClarity`, `staffBehavior`, `timeliness`, `overallSatisfaction`, `followUpConsent`, `overallFeedback`.

### Downloads

**`DownloadAsset`** — Downloadable files (PDFs, manuals) linked to a page key and locale.

- `(pageKey, locale, fileLocale)` unique. `isActive` flag for toggling visibility.

### Service centers

**`ServiceRepresentative`** — Authorized service centers with bilingual names and addresses.

- Linked to `IranProvince`/`IranCity` by ID (denormalized bilingual names stored too).
- Index on `(provinceId, cityId, serviceKind, sortOrder)`.

---

## Data & API Flow

### Product data sources

| Category           | DB primary                         | Static fallback                                          |
| ------------------ | ---------------------------------- | -------------------------------------------------------- |
| TVs, WMs, RAC, CAC | `Product` + `ProductCopy`          | `FALLBACK_PRODUCTS` in `lib/api/products/normalizers.ts` |
| Refrigerators      | `Product` + `ProductCopy`          | `content/RefProducts/` directory                         |
| D'code             | `DcodeProduct` + variants + copies | `DCODE_PRODUCTS` in `content/DcodeProducts.ts`           |

Product API routes are DB-first whenever Prisma is configured. Static content is an emergency fallback when the DB query fails or returns no matching rows. `NEXT_PUBLIC_CONTENT_SOURCE` (`"local"` / `"remote"`) controls media URL behavior, not product data priority.

### API routes

- `GET /api/products` — returns a normalized `ApiProduct[]`. DB first; falls back to `FALLBACK_PRODUCTS`. Filtered by `?category=`. Orders DB rows by `position`. Sets `Cache-Control: s-maxage=60, stale-while-revalidate=300` and `X-Data-Source` headers.
- `GET /api/products/[id]` — fetches by `id` or `slug`, same DB→fallback chain.
- `POST /api/complaints` — validates with Zod schema, generates `referenceCode`, saves to DB.
- `POST /api/surveys` — validates with Zod schema, generates `referenceCode`, saves to DB.
- `POST /api/admin/auth/login` — rate-limited login endpoint, returns signed JWT in httpOnly cookie.
- `POST /api/admin/auth/logout` — clears session cookie.
- `PUT /api/admin/locale` — admin sets locale preference.

### Normalization

`lib/api/products/normalizers.ts` converts Prisma rows or static arrays into the `ApiProduct` shape (`lib/api/products/types.ts`). It:

- Merges `ProductCopy` locale rows into the product object (`fa` falls back to `en` copy when missing).
- Sanitizes all `Json` fields with type assertions.
- Builds sensible defaults for missing optional fields (empty banners, section groups, etc.).

### Location & service-center sources

`lib/iranLocationSource.ts` and `lib/serviceCenterSource.ts` follow the same DB-first pattern:

1. Try Postgres query.
2. On error/absence, return the bundled JSON at `lib/iranLocations.json`.

---

## Routing & Pages

The root `app/page.tsx` redirects to `/fa`. All public pages live under `app/[locale]/` (locales: `fa`, `en`).

### Public pages

| Route                                       | Page file                                               | Notes                                                            |
| ------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `/[locale]`                                 | `app/[locale]/page.tsx`                                 | Home: hero carousel + category spotlights                        |
| `/[locale]/products/[category]`             | `app/[locale]/products/[category]/page.tsx`             | Canonical DB-first category listing (`tvs`, `wms`, `rac`, `cac`) |
| `/[locale]/products/[category]/[productId]` | `app/[locale]/products/[category]/[productId]/page.tsx` | Canonical DB-first product detail, full JSON-LD + FAQ            |
| `/[locale]/tv-hisense`                      | `app/[locale]/tv-hisense/page.tsx`                      | Legacy TV listing path                                           |
| `/[locale]/tv-hisense/[productId]`          | `app/[locale]/tv-hisense/[productId]/page.tsx`          | Legacy TV detail path                                            |
| `/[locale]/washing-machine`                 | `app/[locale]/washing-machine/page.tsx`                 | Legacy WM listing path                                           |
| `/[locale]/washing-machine/[productId]`     | `app/[locale]/washing-machine/[productId]/page.tsx`     | Legacy WM detail path                                            |
| `/[locale]/dcode`                           | `app/[locale]/dcode/page.tsx`                           | D'code brand landing page                                        |
| `/[locale]/dcode/tvs`                       | `app/[locale]/dcode/tvs/page.tsx`                       | D'code TV category page                                          |
| `/[locale]/dcode/tvs/[productId]`           | `app/[locale]/dcode/tvs/[productId]/page.tsx`           | D'code product detail page                                       |
| `/[locale]/refrigerator`                    | `app/[locale]/refrigerator/page.tsx`                    | Refrigerator catalog listing                                     |
| `/[locale]/refrigerator/[productId]`        | `app/[locale]/refrigerator/[productId]/page.tsx`        | Refrigerator product detail                                      |
| `/[locale]/rac`                             | `app/[locale]/rac/page.tsx`                             | Residential AC (under construction)                              |
| `/[locale]/cac`                             | `app/[locale]/cac/page.tsx`                             | Commercial AC (under construction)                               |
| `/[locale]/faq`                             | `app/[locale]/faq/page.tsx`                             | FAQPage schema, accordion                                        |
| `/[locale]/contact-us`                      | `app/[locale]/contact-us/page.tsx`                      | Contact + LocalBusiness JSON-LD                                  |
| `/[locale]/about`                           | `app/[locale]/about/page.tsx`                           | Company overview                                                 |
| `/[locale]/warranty-and-guarantee`          | `app/[locale]/warranty-and-guarantee/page.tsx`          | Warranty terms                                                   |
| `/[locale]/hisense-repair`                  | `app/[locale]/hisense-repair/page.tsx`                  | Repair services                                                  |
| `/[locale]/complaint`                       | `app/[locale]/complaint/page.tsx`                       | After-sales complaint form (multi-step Zod form)                 |
| `/[locale]/survey`                          | `app/[locale]/survey/page.tsx`                          | Satisfaction survey form                                         |
| `/[locale]/support/find-service-center`     | `app/[locale]/support/find-service-center/page.tsx`     | Province/city autocomplete → service center finder               |
| `/[locale]/find-service-center`             | `app/[locale]/find-service-center/page.tsx`             | Legacy path (same feature)                                       |
| `/[locale]/support/portal`                  | `app/[locale]/support/portal/page.tsx`                  | Support portal (noindex)                                         |
| `/[locale]/portal`                          | `app/[locale]/portal/page.tsx`                          | Legacy portal path (noindex)                                     |
| `/[locale]/support/request-representation`  | `app/[locale]/support/request-representation/page.tsx`  | Rep application form                                             |
| `/[locale]/request-representation`          | `app/[locale]/request-representation/page.tsx`          | Legacy path                                                      |
| `/[locale]/not-found`                       | `app/[locale]/not-found.tsx`                            | Locale-aware 404                                                 |

### Admin portal pages

All admin pages live under `app/admin/` and are protected by the JWT middleware in `app/admin/layout.tsx`.

| Route                    | Purpose                           |
| ------------------------ | --------------------------------- |
| `/admin/login`           | Login form (rate-limited)         |
| `/admin`                 | Dashboard (stats overview)        |
| `/admin/complaints`      | View/manage complaint submissions |
| `/admin/surveys`         | View/manage survey submissions    |
| `/admin/submissions`     | Combined submissions view         |
| `/admin/products`        | Product listing management        |
| `/admin/service-centers` | Service center management         |
| `/admin/settings`        | Site settings                     |

---

## Admin Portal

The admin portal at `/admin` provides an interface for managing submissions and content.

### Authentication

- **No NextAuth** — custom JWT-based session.
- Session cookie: `hisense_admin_session` (httpOnly, Secure, 8-hour expiry).
- Token signed with `ADMIN_SESSION_SECRET` via HMAC-SHA256. Session payload carries `sub` (username), `uid` (AdminUser id or `env`), and `role`.
- `lib/admin/auth.ts` exports `verifyAdminSession()` — used in `app/admin/layout.tsx`, `proxy.ts`, and all admin server actions. It is **edge-safe** (Web Crypto, no DB) so it runs in middleware.

#### DB-backed credentials (DB-first, env fallback)

- Credentials live in the **`AdminUser`** table (`username`, `passwordHash` via Node `scrypt`, `role`, `isActive`). `lib/admin/credentials.ts` → `authenticateAdmin()` is **Node-only** and resolves a login DB-first; env `ADMIN_USERNAME`/`ADMIN_PASSWORD` is only a bootstrap (no rows) or DB-outage fallback.
- Manage users: `npm run db:seed:admins` (bootstrap env admin → DB), `npm run admin:create <username> <password> [role]`.

#### Access control (role matrix)

`lib/admin/access.ts` gates sections per role (keep in sync with `ROLE_SECTIONS`):

| Section         | SUPER_ADMIN | ADMIN | SERVICE_MANAGER | CIC_MANAGER | EDITOR |
| --------------- | :---------: | :---: | :-------------: | :---------: | :----: |
| Dashboard       |      ✓      |   ✓   |        ✓        |      ✓      |   ✓    |
| Products        |      ✓      |   ✓   |        —        |      —      |   —    |
| Complaints      |      ✓      |   ✓   |        ✓        |      ✓      |   ✓    |
| Surveys         |      ✓      |   ✓   |        ✓        |      ✓      |   ✓    |
| Service centers |      ✓      |   ✓   |        ✓        |      ✓      |   —    |
| Settings        |      ✓      |   ✓   |        —        |      —      |   —    |
| Users           |      ✓      |   —   |        —        |      —      |   —    |

Enforced in 3 layers: middleware (`proxy.ts`), nav filtering (`AdminShell`), and server actions (`app/admin/users/actions.ts`). `SERVICE_MANAGER` (مدیر خدمات) and `CIC_MANAGER` (مدیر CIC) have identical access (title differs) + a trimmed dashboard (`hasTrimmedDashboard`).

#### User-management UI (`/admin/users`, SUPER_ADMIN only)

`app/admin/users/{page.tsx,actions.ts}` + `components/admin/AdminUsersManager.tsx` (MUI). Create/role/activate/reset-password/delete with last-super-admin & self-delete guards. `lib/admin/session.ts` → `getAdminSession()` reads the session server-side.

> **Shared with Hisense:** the DB-backed admin auth + `prisma/` AdminUser model/migrations are synced from the Hisense repo (`.agents/skills/hisense-sync`) and must stay byte-identical (shared DB).

### Rate limiting

`lib/admin/rateLimit.ts` provides in-memory, IP-based rate limiting on the login endpoint. Locks out after repeated failures.

### Admin utilities

- `lib/admin/dashboard.ts` — aggregates stats for the dashboard view.
- `lib/admin/submissions.ts` — queries complaint and survey rows.
- `lib/admin/i18n.ts` / `i18n.server.ts` — admin-specific translation helpers.

---

## Product Catalog

### Categories

| Enum value     | Route segment  | Description       |
| -------------- | -------------- | ----------------- |
| `TVS`          | `products/tvs` | Televisions       |
| `WMS`          | `products/wms` | Washing machines  |
| `RAC`          | `products/rac` | Residential AC    |
| `CAC`          | `products/cac` | Commercial AC     |
| `REFRIGERATOR` | `refrigerator` | Refrigerators     |
| `TV_DCODE`     | `dcode/tvs`    | D'code TV section |

### Product detail page anatomy

A canonical product detail page (`app/[locale]/products/[category]/[productId]/page.tsx`) renders:

1. **HeroMedia** — full-width hero image or video.
2. **MobileHeader** — sticky product name + breadcrumbs on mobile.
3. **BannerSection** — promotional banners.
4. **FeatureCardsGrid** — feature highlight cards with icons.
5. **FeatureIntro** — large text + image feature intro.
6. **SectionGroupsRenderer** — renders `sectionGroups` JSON (ContentSections / OverlayContentSections / StackedContentSections / BeforeAfterSlider).
7. **ComparisonSections** — spec comparison tables.
8. **SpecsSection** — tech specs accordion (TV-specific pulls from `TvSpec`).
9. **ProductFaqSection** — FAQ accordion per product, emits `FAQPage` JSON-LD.
10. **Breadcrumbs** — `BreadcrumbList` JSON-LD.

### Printed catalog pages

Mirrored from the hisense repo (2026-07-26) so the two shared detail pages stay byte-identical. `lib/catalog/catalogAssets.ts` resolves a printed catalog spread per product (by `series` first, `id` second, separators stripped) and `components/catalog/ProductCatalogSection.tsx` renders it between `SpecsSection` and `ProductFaqSection` on both detail-page implementations. One spread deliberately serves a whole series or a pair of models; products with no spread (U7K) render no section. Spreads are capped at 2048×1483 by `ops/optimize-media.mjs`, which `CATALOG_PAGE_WIDTH`/`CATALOG_PAGE_HEIGHT` must match.

**Zarrinac-specific:** every `products/*` and `refrigerator/*` route here is 308-forwarded to `www.hisense-ir.com` (`next.config.ts`), so those spreads are **never requested on this domain** — that code exists for lockstep parity with hisense, not for rendering. Only `catalog-general-full.pdf` is therefore promoted to this server's media (`<media>/catalog/`); the 17 per-series JPEG spreads live on the hisense server only. If a Hisense section ever stops redirecting, sync the spreads here too.

What does render on this domain is the full-catalog download: the homepage CTA (`components/catalog/CatalogDownloadSection.tsx`, copy in `HOME_SEO_CONTENT.catalog`) and the footer "download product catalog" link (`Footer.links.catalog`, flagged `download: true` so it renders as a plain anchor and skips the locale prefix). **The homepage catalog copy is deliberately worded differently from the hisense homepage's — keep it that way**, per the cross-domain duplicate-canonical fix, and bump `HOME_CONTENT_LAST_MODIFIED` on any home-content change.

### Media URLs

Always use `mediaUrl(path)` from `lib/mediaUrl.ts`. It switches between `/` (local) and `NEXT_PUBLIC_MEDIA_BASE_URL` (CDN). Never hardcode `/media/` paths in components.

**The rule is media-store vs `public/`, not "always call `mediaUrl`".** Assets in the media store (`banner/`, `products/`, `tv-banner/`, `catalog/`, … — gitignored out of `public/` and promoted with `ops/upload-media.ps1`) **must** go through `mediaUrl()`. Assets genuinely committed under `public/` — notably `public/icons/*` — **must not**: production sets `NEXT_PUBLIC_MEDIA_BASE_URL=/media`, so wrapping an `icons/` path would push it to a directory that does not exist. This is why `buildLocalBusinessJsonLd`'s `logo` stays a bare `${SITE_URL}/icons/...` while its `image` is wrapped. Fixed here 2026-09-09 (PR #37) and ported to hisense 2026-09-10 (PR #127).

**A 404 in metadata or JSON-LD is invisible on screen**, so verify by requesting the emitted URL rather than loading the page:

```bash
curl -sS https://zarrinac.com/fa | grep -oE '<meta property="og:image" content="[^"]*"'
# then curl -I whatever it emits — it must be 200
```

### Homepage hero banners

`components/hero/HeroBanner.tsx` holds the carousel's `BANNERS` array; array order is slide order and every slide is `priority`, so **slide 1 is the LCP**. The home is the only Hisense-replica surface that still renders on zarrinac.com and znci.ir — every other section 308-forwards to hisense-ir.com — so banner changes are the one part of a hisense hero update that is worth porting here.

**Zarrinac keeps its own final slide** (`banner-7`, `Fix-Banner-07`, alt "Zarrin Namaye Caspian featured lineup") which hisense does not carry. Port hero changes as a _delta_, never by copying hisense's array wholesale.

Mobile artwork must be portrait, roughly 0.56–0.75 aspect, to survive the `aspect-9/16` mobile container's `object-cover`. A 1:1 social export cannot be **padded** to fit (tried on hisense, always seams), but it can be **cropped** when the composition survives — check by eye. Prep as `.webp` (max width 2048) into **both** `media/banner/` and `public/banner/`, then promote with `ops/upload-media.ps1`.

**znci.ir gets media by bind-mount, not through the image.** `docker/compose.yaml` maps the host's media dir to `/app/public/media:ro` (`/var/www/znci/media` on SC1), so new banner files must be copied there separately — rebuilding or redeploying the container alone will not pick them up.

### D'code section

D'code pages live under `/[locale]/dcode`. They use `lib/dcode/source.ts`, which queries `DcodeProduct` first and falls back to `content/DcodeProducts.ts`. The desktop nav treats D'code as a plain link: it keeps the red brand hover underline but does not open a mega-menu dropdown.

---

## Service Centers

The service-center finder at `/[locale]/find-service-center` lets users find Hisense service representatives by province and city.

- **Component:** `components/service-centers/ServiceCenterFinder.tsx` — MUI Autocomplete for province, then city, then fetches and displays matching reps.
- **Data source:** `lib/serviceCenterSource.ts` queries `ServiceRepresentative` from Postgres. Falls back to `content/service-centers/serviceCenters.json` if the DB is unavailable or the table is empty.
- **Location data:** `lib/iranLocationSource.ts` queries `IranProvince` and `IranCity`. Falls back to `lib/iranLocations.json`.
- **Performance:** Reduced to a single DB query (was 3 separate queries previously).

### Refreshing the representative list — mirror from hisense, never regenerate here

`content/service-centers/serviceCenters.json` is **mirrored from the hisense repo**, which owns
the refresh: the service department's dated spreadsheet lands there, and
`scripts/convert-representatives-xlsx.mjs` (hisense-only — deliberately not ported) regenerates
the JSON from it. To update this repo, copy hisense's `content/service-centers/serviceCenters.json`
verbatim. Never hand-edit it and never seed a stale copy:

> **`npm run db:seed:representatives` wipes the table.** `scripts/seed-service-representatives.ts`
> runs `deleteMany()` then bulk-creates from this JSON inside one transaction — and the Postgres
> is **shared with hisense**. Seeding from an out-of-date copy here silently rolls back the live
> representative list for _both_ sites. Same hazard as the products seed
> (`ops/shared-db-runbook.md`): let hisense own the refresh, mirror the JSON, then seed.

---

## Complaint & Survey Forms

### Complaint form

Route: `/[locale]/complaint`
Component: `components/complaint/ComplaintForm.tsx`
Schema: `lib/complaints/schema.ts`

Multi-step form collecting:

- Personal info (name, phone, email)
- Product info (category, model, invoice number, purchase date)
- Complaint details (topic, preferred contact method, city, address, description)

On submit: `POST /api/complaints` validates with Zod, generates a `referenceCode`, stores in `ComplaintSubmission`, returns the code to the user.

### Survey form

Route: `/[locale]/survey`
Component: `components/survey/SurveyForm.tsx`
Schema: `lib/surveys/schema.ts`

Post-service satisfaction survey collecting ratings on communication clarity, staff behavior, timeliness, and overall satisfaction, plus open-ended feedback.

On submit: `POST /api/surveys` → `SurveySubmission` record + `referenceCode`.

### Shared form conventions

- Persian digit normalization (`۱` → `1`) is done in Zod transforms — not duplicated in component code.
- Phone numbers must match `09XXXXXXXXX` (10-digit Iranian mobile format), enforced by schema.
- Zod schemas are the single source of validation truth for both frontend and API.

---

## Downloads

`DownloadAsset` records link downloadable files (product manuals, warranty PDFs) to a `pageKey` (e.g., `"warranty"`) and a locale pair (`locale` for page language, `fileLocale` for the file's language).

- Seeded via `npm run db:seed:downloads`.
- `isActive` flag controls visibility without deletion.
- Sort order managed per page key.

---

## Internationalization

- Locales: `fa` (Persian, RTL, default) and `en` (English, LTR). Defined in `i18n/routing.ts`.
- **No middleware.ts** — i18n routing is handled by the next-intl plugin in `next.config.ts`. Creating a `middleware.ts` would conflict.
- `withNextIntl()` in `next.config.ts` must stay — removing it silently breaks all locale routing.
- Server components: `getTranslations('Namespace')` → `t('key')`
- Client components: `useTranslations('Namespace')`
- Translation files: `messages/fa.json` and `messages/en.json` — must stay in sync.
- Locale validation: `app/[locale]/layout.tsx` throws a 404 for unknown locales. Adding a locale requires updating `i18n/routing.ts` first.
- RTL: Persian is RTL (`dir="rtl"`). Flex direction, carousel scroll, padding/margin semantics, and text alignment all reverse. Always test both locales after touching layout or carousel components.

---

## Styling & Theming

- **Tailwind v4** — loaded via `@import 'tailwindcss';` in `globals.css`. Do NOT use `@tailwind base/components/utilities` directives (build will break).
- Custom theme tokens go inside `@theme {}` blocks in `assets/styles/globals.css` — not in `tailwind.config.ts`'s `extend` key.
- **CSS variables** define semantic design tokens: `--surface-color`, `--text-primary`, `--brand-color`, etc. Use these rather than hardcoded Tailwind palette colors.
- **Dark mode**: toggled via `data-theme="dark"` attribute on `<html>`. Managed by `ThemeProvider` (persists preference in `localStorage`). Toggle UI in `ThemeToggle`.
- Breakpoint tokens are defined in `@theme {}` in `globals.css`.
- MUI components (`Autocomplete`, `TextField`, `Select`) for interactive form elements.

---

## SEO Infrastructure

SEO efficiency is the top priority. Every page change should be evaluated for SEO impact.

### Metadata

Each public page implements `generateMetadata` with:

- `title` and `description` — purchase-intent keywords (خرید/قیمت/نصب for Persian).
- `alternates.canonical` — absolute URL for the current locale.
- `alternates.languages` — hreflang map for all locales + `x-default`.
- OpenGraph and Twitter card tags.

Hreflang is emitted as HTML `<link rel="alternate">` tags only. The next-intl HTTP Link-header hreflang was removed (it produced malformed headers that Google ignored).

### Favicon (Search results + Search Console)

The icon files live in `public/` (`favicon.ico` 48×48+32×32, `favicon-96x96.png`, `favicon.svg`, `apple-touch-icon.png` 180×180, `site.webmanifest`) and have always served 200 — but until 2026-09-14 **nothing declared them in the HTML**. Files under `public/` are served, not declared; Next.js only auto-emits `<link rel="icon">` for icon files placed inside `app/` or for `metadata.icons`. Browsers hid the problem by falling back to the implicit `/favicon.ico`, but Google requires the `<link>` element in the home page `<head>`, so it never indexed a favicon — Search Console showed the generic globe for `zarrinac.com` and `hisense-ir.com` while the other properties (non-Next sites, which declare the tag) showed their marks.

Fixed by `export const metadata` in **`app/layout.tsx`** (root layout, so it propagates to every route including `/admin`, and to the znci.ir deployment built from this same tree; child `generateMetadata` overrides fields individually and never touches `icons`). It declares `icon` (ico + 96px png + svg), `shortcut`, `apple`, and `manifest: '/site.webmanifest'`.

Rules to keep Google happy:

- Keep the favicon URLs **stable** — Google re-checks them rarely; changing paths resets the indexing clock.
- Square and a multiple of 48px (48/96/144). Keep `/favicon.ico` at 48×48 or larger.
- Never `Disallow` the icon paths in `app/robots.ts`; Googlebot-Image must be able to fetch them.
- Same favicon site-wide — declaring it once in the root layout guarantees that.
- After a deploy, the icon only appears once Google **recrawls the home page**: URL Inspection → Request indexing on the home URL. Expect days-to-weeks, not minutes.
- `app/layout.tsx` is byte-identical with the hisense repo — port any change there too. **Open point:** this repo still ships the _same_ `favicon.ico` as hisense, so zarrinac.com and znci.ir render the Hisense mark. Given the homepages were deliberately differentiated to stop Google folding them, a distinct icon per deployment is the matching follow-up.

### JSON-LD structured data

All JSON-LD is rendered server-side via `components/seo/JsonLd.tsx`.

| Schema type                   | Where emitted                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `Organization`                | Root layout (`app/[locale]/layout.tsx`)                                                             |
| `WebSite`                     | Root layout                                                                                         |
| `LocalBusiness`               | Contact page, service-center pages (`lib/seo/localBusiness.ts`)                                     |
| `Product`                     | Product detail pages (`lib/seo/productSchema.ts`)                                                   |
| `CollectionPage` + `ItemList` | Category listing pages                                                                              |
| `BreadcrumbList`              | All product detail pages (`components/seo/PageBreadcrumbs.tsx`)                                     |
| `FAQPage`                     | FAQ page + product detail pages (`components/seo/ProductFaqSection.tsx`)                            |
| `VideoObject`                 | Product detail pages with a `heroVideoUrl` (`buildVideoObjectJsonLd` in `lib/seo/productSchema.ts`) |

**Product `offers` rule:** No prices are published (rial volatility). `buildProductJsonLd` in `lib/seo/productSchema.ts` emits no `offers` by default. It auto-emits a valid `Offer` only when a positive `price` is passed. Never emit a price-less `Offer` — it's invalid for Google rich results.

**Hero videos are self-hosted.** Product `heroVideoUrl`s point at first-party files under the product media folders (e.g. `products/tvs/U7K-Files/u7k-hero.mp4`), resolved via `mediaUrl()` — not third-party hotlinks. Self-hosting is what makes the `VideoObject`'s `contentUrl` a valid first-party claim for video rich results. Compress masters to web-optimized 1080p H.264 (`-crf 21 -movflags +faststart -an`, downscale 4K → 1080p) before placing them under `public/products/` (local) and the `media/` staging folder (promoted to the server via `ops/upload-media.ps1`). Keep the originals as backups outside the synced `media/` folder.

### SEO copy for category pages

`lib/seo/categorySeoContent.ts` contains long-form SEO copy and FAQ entries for each category page. Targets purchase-intent long-tail keywords: خرید/قیمت/نصب/قطعات یدکی. Rendered by `components/seo/CategorySeoSection.tsx`.

### Per-site home copy (zarrinac.com vs znci.ir)

This tree is deployed on two domains: **zarrinac.com** (PM2, `zarrin-ng-site`) and **znci.ir** (Docker, `SC1` — see Ops & Deployment). Both 308-forward every section except the home, so the home is the only page either domain serves with a 200. If the two homes carried the same title/H1/body, Google would fold them into one cluster and pick the canonical itself — which is exactly what happened between zarrinac.com and hisense-ir.com in 2026-07 (26 URLs reported as _"Duplicate, Google chose different canonical than user"_).

`content/homeSeoContent.ts` therefore holds **one copy block per deployment**, selected by `NEXT_PUBLIC_SITE_ID` (`lib/siteId.ts`) through `getHomeSeoContent(locale)`:

| Site         | `NEXT_PUBLIC_SITE_ID` | Angle                                                                          |
| ------------ | --------------------- | ------------------------------------------------------------------------------ |
| zarrinac.com | `zarrinac`            | Consumer / brand portfolio — Zarrin Namaye Caspian as home of Hisense + D'code |
| znci.ir      | `znci`                | Trade / corporate — ZNCI as importer, supplier and distributor                 |

Rules when editing:

- Keep the two blocks **divergent in substance** — different title, H1, and body, targeting different keywords. They are not translations or variants of each other.
- The site is resolved at **build time** (Next inlines `NEXT_PUBLIC_*`), so changing a deployment's identity requires a rebuild, never just a restart.
- An unrecognised `NEXT_PUBLIC_SITE_ID` falls back to the zarrinac block rather than crashing.
- `HOME_CONTENT_LAST_MODIFIED` in `lib/seo/site.ts` is likewise **per-site**. Bump only the entry for the deployment whose copy you changed — a shared bump would falsely tell Google that the other domain's home changed too.

### Sitemap & robots

- `app/sitemap.ts` — native Next.js sitemap generator. Covers all locale × product URLs + static routes. Uses `SITE_CONTENT_LAST_MODIFIED` from `lib/seo/site.ts` as a stable `lastmod` baseline (bump it only when content meaningfully changes).
- `app/robots.ts` — robots.txt generator.
- **No `next-sitemap`** — the old `next-sitemap.config.js` approach was replaced by the native route.

### ISR

Product listing pages export `revalidate = 3600`. Do not add `cache: 'no-store'` to fetch calls inside these pages — it defeats ISR and can cause build failures.

### Security headers

Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts` via `headers()`. Added in the security batch (PR #81).

### SEO audit

`ops/seo-audit.mjs` is a deterministic SEO checker that crawls the live sitemap and verifies: title length, meta-description length, canonical URL, hreflang tags, single `<h1>`, JSON-LD presence, and page size. Runs daily at 07:00 + after every deploy via `ops/cron/seo-audit.sh`. Failures are escalated to `claude -p`.

---

## Ops & Deployment

### Server

Ubuntu host `zarrin-ng-site` (`172.17.0.19`), app at `/var/www/zarrinac/app`, served by **PM2** (process `zarrinac`, config `ecosystem.config.cjs`) behind **Apache**. DB: shared Postgres `zarrin` on `nexzarrin`; set `NEXT_PUBLIC_SITE_ID=zarrinac`.

### Deploy workflow

**Local → Git → Server — never edit directly on the server.**

```
develop locally (Windows)
  → push branch
  → open PR
  → merge to main
  → on server: run deploy.sh
```

`ops/deploy.sh` (copied to `/var/www/zarrinac/deploy.sh` on the server):

1. `git restore public/sitemap-0.xml` (removes legacy generated file that caused conflicts)
2. `git pull origin main`
3. `node ops/preflight.mjs` (validates Zarrinac env identity + nexzarrin DB target)
4. `npm ci`
5. `npm run db:deploy` (applies Prisma migrations to shared `zarrin` on `nexzarrin`)
6. `npm run build`
7. `pm2 reload ecosystem.config.cjs --update-env`
8. Skips SEO audit while `/usr/local/bin/seo-audit.sh` is non-executable

### Husky git hooks

- **pre-commit** (`.husky/pre-commit`): runs `lint-staged` → ESLint + Prettier on staged files.
- **pre-push** (`.husky/pre-push`): pipes `git diff origin/main...HEAD` to `claude -p` for an automated code review. Non-zero exit blocks the push. Do not bypass with `--no-verify`.

### Media workflow

Media lives outside git (`C:\Users\r.saberifard\Documents\IT-Hisense\zarrin\media` locally, `/var/www/zarrinac/media` on the server). The local media folder is mirrored from the upstream Hisense media set plus the retained `media/dcode` directory.

**Local → server:**

1. Run `node ops/optimize-media.mjs --apply` to compress images first.
2. Run `pwsh ops/upload-media.ps1` — uses OpenSSH key auth (`~/.ssh/zarrin_ng_site_ed25519` by default, override with `ZARRINAC_SSH_KEY`) to `scp` upload then trigger `sudo sync-media.sh` on the server.
3. `ops/sync-media.sh` rsync-mirrors staging → live dir and applies `chmod -R a+rX` (mandatory — the Next app runs as `reza`, so `www-data`-only permissions cause `EACCES` and a 503 crash loop).

Key auth setup: the public half of the selected SSH key must be in `~/.ssh/authorized_keys` on the server for `reza`.

### Backup

`ops/cron/weekly-backup.sh` runs every Sunday at 03:00. Backs up:

- `pg_dumpall` (full Postgres dump)
- `/etc` (server config)
- App secrets: `.env`, `ecosystem.config.cjs`

Stores to `/backup`, keeps the last 4 weeks, deletes older runs.

### Monitor

`ops/cron/zarrinac-monitor.sh` runs hourly. Pipes `df`, `free`, and `pm2 jlist` output to `claude -p` for anomaly detection. Logs to `/var/log/zarrinac-monitor.log`.

SEO audit is disabled on `zarrin-ng-site` for now: `/usr/local/bin/seo-audit.sh` is
non-executable and there is no cron entry.

### Ops scripts location

Scripts under `ops/` are the source of truth. After a deploy pulls changes, manually copy affected scripts to their live locations (see `ops/README.md` for the exact copy commands). `deploy.sh` is intentionally not a symlink — bash reads a script as it runs, so `git pull` overwriting the executing file is unsafe.

### DB promotion / shared DB

The current production model uses the shared `zarrin` PostgreSQL database on `nexzarrin`.
Zarrinac runs on `zarrin-ng-site` and connects to that DB with:

```bash
DATABASE_URL="postgresql://reza_sf:***@172.17.0.10:5432/zarrin?schema=public&sslmode=no-verify"
NEXT_PUBLIC_SITE_ID="zarrinac"
```

`sslmode=no-verify` is intentional for the internal `zarrin-ng-site` → `nexzarrin` link because
the current Postgres TLS certificate is self-signed. It still encrypts the connection; switch to
`verify-full` after installing a trusted CA/certificate pair.

Do not drop/restore the shared production DB as part of a normal Zarrinac app deploy. Use
`ops/shared-db-runbook.md` for the one-time submission merge, shared DB cutover, and failover
procedures.

**Role/privilege gotchas (hit during the 2026-06-16 promotion on nexzarrin):**

- OS user `reza` ≠ DB role `reza_sf`. Bare `dropdb`/`createdb` fail with `role "reza" does not exist` — always specify `-h localhost -U reza_sf`.
- `createdb` needs the `CREATEDB` privilege. `reza_sf` originally lacked it (`permission denied to create database`); granted permanently with `sudo -u postgres psql -c 'ALTER ROLE reza_sf CREATEDB;'`. On a fresh cluster, recreate as superuser instead: `sudo -u postgres createdb -O reza_sf zarrin`.
- A password prompt that returns `permission denied …` or `database … does not exist` means **auth succeeded** (post-login errors) — the password is fine; the issue is privilege/state.
- ⚠️ **Shared DB:** hisense and zarrinac share one Postgres. A drop/restore replaces **both** sites' submissions with the local snapshot — only promote when the local DB is the intended source of truth for everything.

### znci.ir — second deployment of this tree

znci.ir is **the same repository** built with a different identity, not a fork. It runs as a Docker container on **SC1** (openSUSE Leap 16, `172.17.0.36`), app at `/var/www/znci/app`, media at `/var/www/znci/media`, behind Apache reverse-proxying `127.0.0.1:3010`. It ships **DB-less** — every DB-backed page is 308-forwarded off the domain — so it never touches the shared `zarrin` Postgres.

Everything znci-specific lives in `docker/`:

| File                  | Purpose                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `docker/Dockerfile`   | 3-stage build (`deps` → `builder` → `runner`), Next standalone, non-root |
| `docker/compose.yaml` | Port mapping, media bind-mount, runtime env                              |
| `docker/env.example`  | Template → `docker/.env` (gitignored)                                    |
| `docker/deploy.sh`    | Deploy script — canonical here, live copy at `/var/www/znci/deploy.sh`   |

The image's only build-level difference from the PM2 deploys is `output: 'standalone'`,
which `next.config.ts` adds when `NEXT_BUILD_STANDALONE=1` — a flag the Dockerfile sets
and nothing else does. Before 2026-09-09 this was a config-file swap whose overlay
imported `./next.config.site`, a module that existed only inside the image build; that is
why repo-level `tsc` and `eslint` reported an unresolvable import in `docker/`, and why
the Dockerfile had to `rm -rf docker` before `next build`. Both are gone.

**Deploy:** same shape as zarrinac's, one command on SC1:

```bash
/var/www/znci/deploy.sh    # git pull → identity preflight → compose up --build → health gate
```

It refuses to run if `docker/.env` does not carry `NEXT_PUBLIC_SITE_ID=znci` and `NEXT_PUBLIC_SITE_URL=https://znci.ir`. That guard is the point: at any other value the rebuild silently republishes znci.ir with zarrinac.com's home copy, recreating the duplicate-content condition described under SEO Infrastructure. Like `ops/deploy.sh`, the live copy sits outside the repo so a pull cannot rewrite the running script:

```bash
cp /var/www/znci/app/docker/deploy.sh /var/www/znci/deploy.sh && chmod +x /var/www/znci/deploy.sh
```

**Update flow:** a change merged to `main` reaches zarrinac.com via `/var/www/zarrinac/deploy.sh` and znci.ir via `/var/www/znci/deploy.sh`. There is no sync step and no second repo — that is why the two stay in step by default, and why anything intentionally different between them belongs behind `SITE_ID`, not in a divergent file.

Host-side specifics (Docker `bip` moved off the LAN range, SELinux contexts, port bound to loopback) are recorded in `docker/README.md`.

---

## Security Notes

- **Admin auth:** custom HMAC-SHA256 JWT, httpOnly cookie, 8-hour expiry. No NextAuth dependency.
- **Rate limiting:** in-memory, IP-based, on the login endpoint only (`lib/admin/rateLimit.ts`).
- **Security headers:** CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy set in `next.config.ts`.
- **No `new PrismaClient()`** in pages/routes — always import the singleton from `lib/db.ts`.
- **Input validation** at API boundaries: Zod schemas for complaints and surveys; never trust raw body data.
- **PostCSS malware note (2026-06-06):** `postcss.config.mjs` was found to contain blockchain/C2 malware and was removed. If you inherit this repo, rotate all secrets and audit the upstream `Zarrinac` branch.

---

## Content Management Tips

### Adding fallback product content

Extend the relevant fallback source (`content/tvProducts.ts`, `content/WmProducts.ts`, `content/RacProducts.ts`, `content/CacProducts.ts`, `content/RefProducts/`, or `content/DcodeProducts.ts`). Provide both `fa` and `en` copy blocks. Fallback content is not authoritative when the database is available.

### Adding a product (with DB)

Use the admin portal or a seed script. Insert a `Product` row + `ProductCopy` rows for each locale, and keep `position` set for deterministic listing order. For D'code, seed `DcodeProduct`, `DcodeVariant`, and `DcodeProductCopy` with `npm run db:seed:dcode`.

### Adding translations

Update both `messages/fa.json` and `messages/en.json`. They must stay in sync — hreflang depends on both locales having matching routes.

### Updating navigation

Edit `components/header/navigationData.ts` for menu structure and locale-specific labels.

### Adding SEO copy for a category

Add an entry to `lib/seo/categorySeoContent.ts` with `title`, `body`, and `faqs` arrays. The `CategorySeoSection` component will render it automatically.

### Connecting a DB for the first time

```bash
# Set DATABASE_URL in .env.local, then:
npm run db:migrate       # creates the schema
npm run db:seed          # seeds all data
npm run dev              # app now uses DB data
```

---

## Known Gotchas

1. **`withNextIntl()` must stay** — `next.config.ts` wraps config with the next-intl plugin. Removing it silently breaks all locale routing.

2. **No `middleware.ts`** — i18n routing is handled by the plugin. A `middleware.ts` file will conflict with it.

3. **Tailwind v4 syntax** — Tokens go in `@theme {}` blocks in `globals.css`, not in `tailwind.config.ts`. Using `@tailwind` directives instead of `@import 'tailwindcss'` breaks the build.

4. **ISR and `cache: 'no-store'` don't mix** — Product listing pages use `revalidate = 3600`. `cache: 'no-store'` on fetch calls inside them defeats ISR and can cause build failures.

5. **Locale validation throws** — The layout validates the locale param. Adding a locale requires updating `i18n/routing.ts` first.

6. **Fallback product coverage** — `FALLBACK_PRODUCTS` covers TVs, WMs, RAC, CAC. Refrigerators come from `content/RefProducts/`; D'code comes from `content/DcodeProducts.ts`. These are fallbacks so all URLs resolve when DB is absent.

7. **RTL flips layout** — Persian (fa) is RTL. Flex direction, carousel scroll, padding/margin semantics all reverse. Test both locales whenever touching layout or carousel components.

8. **DB is primary, JSON/content is fallback** — Product API routes, `lib/dcode/source.ts`, `lib/serviceCenterSource.ts`, and `lib/iranLocationSource.ts` query Postgres first. Static content/JSON files are emergency fallbacks, not authoritative.

9. **Media permissions** — The Next app runs as `reza` on the server. Media directory permissions must be `a+rX` (not `www-data`-only/`700`). A wrong permission causes `EACCES` and a 503 crash loop. `sync-media.sh` always applies this fix.

10. **`prisma.$disconnect()` usage** — Never call it inside route handlers or server components. Only use it at the end of seed scripts.

11. **Hreflang is HTML-only** — The next-intl HTTP Link-header hreflang was removed (produced malformed headers). Hreflang is emitted only as HTML `<link rel="alternate">` in page `<head>`.

12. **`SITE_CONTENT_LAST_MODIFIED` in `lib/seo/site.ts`** — A fixed date used as sitemap `lastmod` baseline. Only bump it when site content meaningfully changes — not on every deploy — to keep the signal trustworthy for crawlers.

13. **D'code nav is a plain link** — `components/header/navigationData.ts` keeps `dcode: []`; `hasSubMenu()` must continue treating that as no panel. Do not reintroduce an empty mega-menu on D'code hover.
