# Hisense Iran Website – Quick Guide

This is a simplified, reader-friendly overview of how to run and understand the app. For full details, see `DOCS.md`.

## What the app is

- Next.js 16 (App Router) marketing site for Hisense Iran with FA/EN locales.
- Uses `next-intl` for translations; optional Postgres + Prisma for product data.
- Falls back to bundled TV content if no database is configured.

## Setup

1. Copy envs: `cp .env.example .env`
2. Fill:
   - `DATABASE_URL` (optional) – Postgres connection string.
   - `NEXT_PUBLIC_SITE_URL` – Base URL for links/SEO.
3. Install deps: `npm install`

## Everyday commands

- Dev server: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Build: `npm run build`
- Start prod: `npm run start`
- Sitemap: `npm run sitemap` (runs after build)

## Data flow (products)

- API routes:
  - `GET /api/products` → product list (DB first, fallback content otherwise).
  - `GET /api/products/[id]` → single product by id/slug (same fallback logic).
- Prisma models live in `prisma/schema.prisma` (`Product` + `ProductCopy`).
- Without `DATABASE_URL`, pages and APIs use the bundled catalog in `content/tvProducts.ts`.

## Routing

- Default locale: `fa`. Root (`/`) redirects to `/{locale}`.
- Locale layout: `app/[locale]/layout.tsx` loads translations, header/footer, metadata.
- Key pages:
  - Home: `app/[locale]/page.tsx`
  - TV catalog: `app/[locale]/products/[category]/page.tsx` (category `tvs`)
  - Product detail: `app/[locale]/products/[category]/[productId]/page.tsx`
  - Other routes (rac, cac, refrigerator, washing-machine, faq, warranty-and-guarantee, contact-us, portal, complaint, survey) currently show an under-construction page via `createRoutePage`.
- 404: `app/[locale]/not-found.tsx` (re-exported at `app/not-found.tsx`).

## Content & translations

- Static TV data: `content/tvProducts.ts` (uses types in `types/tv.ts`).
- About page copy: `content/about/*.json`.
- Translations: `messages/en.json`, `messages/fa.json`.
- Navigation copy: `components/header/navigationData.ts`.

## Styling & theming

- Global tokens and Tailwind base: `assets/styles/globals.css`.
- Theme toggle (light/dark) via `components/theme/ThemeProvider` + `ThemeToggle`; stored in `localStorage`.

## SEO

- Structured data: `components/seo/StructuredData.tsx`.
- Sitemaps/robots: `next-sitemap.config.js` (locale-aware, defaults `/` to `/fa`).
- Metadata built per-locale in `app/[locale]/layout.tsx` and TV pages.

## Maintenance tips

- When adding routes or content, update translations and content files.
- When changing product shapes, adjust `lib/api/products/normalizers.ts` and `lib/api/products/types.ts`.
- Keep `DOCS.md` in sync for deeper technical notes.
