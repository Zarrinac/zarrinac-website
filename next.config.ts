import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

type RemotePattern = { protocol: 'http' | 'https'; hostname: string; pathname?: string };

// Base Next config wrapped with next-intl to inject locale support.
const remotePatterns: RemotePattern[] = [
  { protocol: 'http', hostname: 'www.zarrinac.com' },
  { protocol: 'https', hostname: 'www.zarrinac.com' },
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
  // Force HTTPS for two years incl. subdomains (site is HTTPS-only on www).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Send origin only on cross-origin requests; full URL stays same-origin.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Serve modern formats (AVIF first, WebP fallback) for smaller payloads / better LCP.
    formats: ['image/avif', 'image/webp'],
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
