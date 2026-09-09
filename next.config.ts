import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

type RemotePattern = { protocol: 'http' | 'https'; hostname: string; pathname?: string };

// Base Next config wrapped with next-intl to inject locale support.
const remotePatterns: RemotePattern[] = [
  { protocol: 'http', hostname: 'zarrinac.com' },
  { protocol: 'https', hostname: 'zarrinac.com' },
];

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
if (mediaBase) {
  try {
    const mediaUrl = new URL(mediaBase);
    const host = mediaUrl.hostname;
    const protocols =
      mediaUrl.protocol === 'http:'
        ? ['http']
        : mediaUrl.protocol === 'https:'
          ? ['https']
          : ['http', 'https'];
    protocols.forEach((protocol) => {
      if (
        !remotePatterns.some(
          (pattern) => pattern.hostname === host && pattern.protocol === protocol,
        )
      ) {
        remotePatterns.push({ protocol: protocol as 'http' | 'https', hostname: host });
      }
    });
  } catch {
    // ignore invalid media base; fall back to default host list
  }
}

// Security response headers applied to every route. These harden against
// clickjacking, MIME sniffing, protocol downgrade, and referrer leakage.
// NOTE: Content-Security-Policy is intentionally omitted — a strict CSP needs
// per-app nonce/inline-script tuning (MUI, GA, Next runtime) and would break the
// app if added blind. Add it separately once a policy is validated.
const securityHeaders = [
  // Block rendering inside frames on other origins (clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop browsers from MIME-sniffing away from the declared Content-Type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Force HTTPS for two years incl. subdomains.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Send origin only on cross-origin requests; full URL stays same-origin.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

// Zarrinac is a 1:1 replica of the Hisense Iran site plus the D'code brand.
// To consolidate SEO signals and funnel visitors to the canonical Hisense site,
// every Hisense-replica section is permanently (308) forwarded to
// https://www.hisense-ir.com, preserving locale + sub-path. Intentionally NOT
// redirected: the Zarrinac home (`/[locale]`) and the functional `/admin` +
// `/api` routes. The D'code section (`/[locale]/dcode/*`) is now forwarded to
// its own standalone site (see DCODE_SITE_URL below). Keep this list in sync
// with the public routes under `app/[locale]/` whenever a Hisense section is
// added or renamed.
const HISENSE_SITE_URL = 'https://www.hisense-ir.com';
const HISENSE_SECTIONS = [
  'about',
  'cac',
  'complaint',
  'contact-us',
  'faq',
  'find-service-center',
  'hisense-repair',
  'portal',
  'products',
  'rac',
  'refrigerator',
  'request-representation',
  'support',
  'survey',
  'tv-hisense',
  'warranty-and-guarantee',
  'washing-machine',
];

// D'code spun off to its own standalone site (dcode.co.ir). Forward the whole
// `/[locale]/dcode/*` section there with a 308, just like the Hisense sections.
// The standalone site has NO `/dcode` URL prefix (its landing is `/[locale]`,
// TV list `/[locale]/tvs`, detail `/[locale]/tvs/<id>`), so the redirect strips
// the `dcode` segment while preserving locale + everything beneath it.
const DCODE_SITE_URL = 'https://dcode.co.ir';

// Container builds need `output: 'standalone'` — a self-contained
// .next/standalone/server.js with only the traced runtime deps, so the image is
// ~200 MB instead of shipping all of node_modules. It is opt-in via env and set
// only by docker/Dockerfile, so the PM2 deploys on zarrin-ng-site and nexzarrin
// build exactly as before.
//
// This used to be done by swapping this file out for docker/next.config.standalone.ts
// during the image build. That overlay imported a module that only ever existed
// inside the build, so repo-level `tsc`/`eslint` could never resolve it (TS2307 →
// no-unsafe-assignment) and the Dockerfile had to `rm -rf docker` to hide the same
// error from `next build`. One env-gated field replaces all of it.
const standaloneOutput = process.env.NEXT_BUILD_STANDALONE === '1';

const nextConfig: NextConfig = {
  ...(standaloneOutput ? { output: 'standalone' as const } : {}),
  images: {
    remotePatterns,
    // Serve modern formats (AVIF first, WebP fallback) for smaller payloads / better LCP.
    formats: ['image/avif', 'image/webp'],
  },
  redirects() {
    // `:path*` matches the section root AND any nested path (zero-or-more
    // segments), so each entry covers e.g. `/fa/products` and
    // `/fa/products/tvs/u7k` in one rule. `permanent: true` emits a 308, which
    // Google treats identically to a 301 for canonicalization/equity transfer.
    return Promise.resolve([
      ...HISENSE_SECTIONS.map((section) => ({
        source: `/:locale(fa|en)/${section}/:path*`,
        destination: `${HISENSE_SITE_URL}/:locale/${section}/:path*`,
        permanent: true,
      })),
      // D'code → standalone site, dropping the `/dcode` segment. `:path*` is
      // zero-or-more, so this single rule covers `/fa/dcode` (→ dcode.co.ir/fa)
      // and any nested path (`/fa/dcode/tvs/r6d` → dcode.co.ir/fa/tvs/r6d).
      {
        source: '/:locale(fa|en)/dcode/:path*',
        destination: `${DCODE_SITE_URL}/:locale/:path*`,
        permanent: true,
      },
    ]);
  },
  headers() {
    return Promise.resolve([
      {
        // Apply to every route.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]);
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
