# syntax=docker/dockerfile:1.7
#
# znci.ir — containerised copy of the zarrinac.com deployment.
#
# Reproduces what PM2 runs on zarrin-ng-site (/var/www/zarrinac/app): the same
# tree, the same `next build`, the same 308 forwards to hisense-ir.com and
# dcode.co.ir. Only the public identity differs, and it is injected purely
# through build args — no source file in this repo is modified for the image.
#
# NEXT_PUBLIC_* values are INLINED by Next at build time (in server bundles and
# middleware too, not just the client), so they must arrive as build args here,
# not as runtime env. Anything that is read at request time — admin secrets,
# DATABASE_URL — stays runtime env and lives in compose.
#
# Build:  docker build -f docker/Dockerfile -t znci-website:latest .
# Run:    docker compose -f docker/compose.yaml up -d

ARG NODE_VERSION=24-bookworm-slim

########################  deps  ################################################
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# HUSKY=0 skips the `prepare: husky` postinstall — there is no .git in the
# build context (see .dockerignore) and git hooks are meaningless in an image.
ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# `npm ci` is FULL (not --omit=dev): building Next needs typescript,
# @tailwindcss/postcss and dotenv, exactly like ops/deploy.sh on the server.
# The postinstall `prisma generate` goes through prisma.config.ts, which
# resolves env('DATABASE_URL') — a throwaway value satisfies it without any
# reachable database. Prisma 7 uses the WASM query compiler with the pg driver
# adapter, so no native engine binary is downloaded or needed at runtime.
RUN --mount=type=cache,target=/root/.npm \
    DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" \
    npm ci

########################  builder  #############################################
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Public identity for this deployment (baked into the bundle) -------------
ARG NEXT_PUBLIC_SITE_URL=https://znci.ir
# SITE_ID tags rows written to the shared database. lib/siteId.ts defaults to
# 'hisense', so it must be set explicitly even though this build ships DB-less.
ARG NEXT_PUBLIC_SITE_ID=zarrinac
# Matches the server: media is served from /media, NOT from public/ root.
# (Leaving NEXT_PUBLIC_CONTENT_SOURCE unset is deliberate — setting it to
# "local" would make mediaUrl() strip the /media prefix and every asset 404.)
ARG NEXT_PUBLIC_MEDIA_BASE_URL=/media
# Analytics/verification default to EMPTY on purpose: reusing zarrinac.com's
# GA property or GSC token on a second domain pollutes both. Pass your own.
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_GTM_ID=
ARG NEXT_PUBLIC_GOOGLE_ADS_ID=
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
ARG NEXT_PUBLIC_BING_SITE_VERIFICATION=

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_SITE_ID=${NEXT_PUBLIC_SITE_ID} \
    NEXT_PUBLIC_MEDIA_BASE_URL=${NEXT_PUBLIC_MEDIA_BASE_URL} \
    NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID} \
    NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID} \
    NEXT_PUBLIC_GOOGLE_ADS_ID=${NEXT_PUBLIC_GOOGLE_ADS_ID} \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} \
    NEXT_PUBLIC_BING_SITE_VERIFICATION=${NEXT_PUBLIC_BING_SITE_VERIFICATION}

# Run the in-repo malware guard against the REAL next.config.ts before it is
# swapped out below — the prebuild hook would otherwise only ever see the
# Docker overlay, silently dropping the check that ops/deploy.sh also performs.
RUN node scripts/scan-build-config.mjs

# Swap in the standalone overlay (see docker/next.config.standalone.ts). The
# original config keeps every rule; it is only re-exported with output:'standalone'.
# docker/ is then dropped: `next build` type-checks the whole tree, and the
# overlay's `./next.config.site` import resolves only from the repo root.
RUN mv next.config.ts next.config.site.ts \
    && cp docker/next.config.standalone.ts next.config.ts \
    && rm -rf docker

# No DATABASE_URL here on purpose. Product/category pages prerender through the
# DB->fallback chain; with no DB configured they take the bundled static data
# straight away instead of stalling on a connection that will never succeed.
# (Those routes are 308-forwarded at runtime anyway — only the home page and
# /admin + /api are actually served from this domain.)
RUN npm run build

########################  runner  ##############################################
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    INTERNAL_API_BASE_URL=http://127.0.0.1:3000

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs --home /app nextjs

# Standalone bundles server.js + only the traced runtime deps. `public/` and
# `.next/static` are NOT included by the tracer and must be copied explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# sharp powers next/image optimisation. Copy it (and its platform binaries)
# explicitly rather than trusting the tracer to have picked up a dependency
# that Next resolves dynamically at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

# Bind-mount target for the media library. Same split as the server, where
# public/media symlinks to /var/www/zarrinac/media: next/image's optimiser
# fetches its relative source through an INTERNAL request to this Node server,
# which has no /media route — it has to resolve off disk under public/.
RUN mkdir -p ./public/media && chown nextjs:nodejs ./public/media

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
