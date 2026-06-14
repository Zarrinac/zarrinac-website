# Admin Deployment Checklist

This admin panel runs under `/admin` in the same Next.js app. It does not add new Prisma models, so there is no new migration required for the admin UI itself.

## Required Environment Variables

Set these on the server before build/start:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
NEXT_PUBLIC_SITE_URL="https://zarrinac.com"
NEXT_PUBLIC_CONTENT_SOURCE="remote"
NEXT_PUBLIC_MEDIA_BASE_URL="/media"
INTERNAL_API_BASE_URL="http://localhost:3000"
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="use-a-strong-password"
ADMIN_SESSION_SECRET="use-a-long-random-secret-at-least-32-chars"
```

Optional public tracking variables can stay as they are currently configured:

```env
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""
NEXT_PUBLIC_GOOGLE_ADS_ID=""
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
NEXT_PUBLIC_BING_SITE_VERIFICATION=""
```

## First Deployment / New Server

Run from the project directory:

```bash
npm ci
NODE_ENV=production npx prisma generate
NODE_ENV=production npm run db:deploy
NODE_ENV=production npm run db:seed
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

Use `npm run db:seed` only when the production database still needs initial product, location, download, and service-representative data. Do not run it blindly if production content has already been manually edited unless the seed scripts are confirmed to be idempotent for that dataset.

## Normal Redeploy

For code-only updates:

```bash
npm ci
NODE_ENV=production npx prisma generate
NODE_ENV=production npm run db:deploy
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

## Admin Smoke Test

After start:

1. Open `https://zarrinac.com/admin`.
2. Confirm it redirects to `/admin/login`.
3. Sign in with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
4. Check `/admin/complaints` and `/admin/surveys`.
5. Confirm public pages like `/fa` still load.

If login returns `403 Forbidden`, check that `NEXT_PUBLIC_SITE_URL` exactly matches the browser origin, for example `https://zarrinac.com`. If the app is behind Nginx, also pass these headers to Next:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Notes

- `/admin`, `/admin/*`, and `/api/admin/*` are protected by signed HttpOnly session cookies.
- Admin pages send `noindex`, `no-store`, and frame-protection headers.
- `ADMIN_SESSION_SECRET` should be different from `ADMIN_PASSWORD`.
- Rotating `ADMIN_SESSION_SECRET` logs out current admin sessions.
- `INTERNAL_API_BASE_URL` is used by server-rendered pages to call app APIs without looping through public HTTPS/Nginx.
