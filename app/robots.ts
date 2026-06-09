import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

// Native robots route so the production site URL is always derived from
// NEXT_PUBLIC_SITE_URL at request time instead of a build-generated file that
// can be shipped with a stale (e.g. localhost) host.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
