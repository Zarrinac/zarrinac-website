import { defineRouting } from 'next-intl/routing';

// Central locale configuration for next-intl routing helpers and middleware.
export const routing = defineRouting({
  locales: ['fa', 'en'],
  defaultLocale: 'fa',
  localeDetection: false,
  // Suppress next-intl's middleware hreflang HTTP `Link` header. We already emit
  // curated HTML <link rel="alternate" hreflang> tags per page (correct https URLs
  // + per-page x-default) via generateMetadata; the middleware header duplicated
  // them with http:// URLs and a root x-default, which Screaming Frog flagged.
  alternateLinks: false,
  pathnames: {
    '/': '/',
  },
});

export type Locale = (typeof routing.locales)[number];

export type Pathname = keyof (typeof routing)['pathnames'];
