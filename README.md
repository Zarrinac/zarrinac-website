# Hisense Iran Website

Marketing site for Hisense Iran built with Next.js 16, `next-intl`, and optional Prisma-backed product data. The TV catalog falls back to bundled content when no database connection is present.

## Quick Start

- Copy envs: `cp .env.example .env` then set `DATABASE_URL` (optional) and `NEXT_PUBLIC_SITE_URL`.
- Install deps: `npm install`
- Develop: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Build/start: `npm run build && npm run start`

## Scripts

- `npm run dev` – Start the dev server.
- `npm run build` – Production build (runs `npm run sitemap` afterwards).
- `npm run start` – Serve the production build.
- `npm run lint` – ESLint check.
- `npm run format` – Prettier format helper.
- `npm run sitemap` – Generate locale-aware sitemaps/robots.
- `npm run prepare` – Install Husky hooks.

## Documentation

See `DOCS.md` for architecture, data flow, content management, and operations guidance. Keep it updated whenever you add routes, APIs, or new content sources.
