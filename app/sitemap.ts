import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL, SITE_CONTENT_LAST_MODIFIED } from '@/lib/seo/site';

// Zarrinac forwards every Hisense-replica section to hisense-ir.com via 308
// redirects (see next.config.ts). The sitemap must therefore list ONLY the URLs
// that still resolve on this domain — the home page and the D'code brand
// section. Advertising redirected URLs here would emit a mixed signal (sitemap
// says "index me", server says "308 elsewhere").

const STATIC_PATHS = ['/dcode', '/dcode/tvs', '/dcode/tvs/r6d'];

const buildLanguageAlternates = (path: string): Record<string, string> => {
  const languages = routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${SITE_URL}/${locale}${path}`;
    return acc;
  }, {});
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  return languages;
};

const priorityForPath = (path: string): number => {
  if (path === '') return 1;
  // Product detail pages (e.g. /products/tvs/u7k) sit one level deeper.
  return path.split('/').filter(Boolean).length > 2 ? 0.7 : 0.8;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = SITE_CONTENT_LAST_MODIFIED;
  const logicalPaths = Array.from(new Set(['', ...STATIC_PATHS]));

  return logicalPaths.flatMap((path) => {
    const languages = buildLanguageAlternates(path);
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
      priority: priorityForPath(path),
      alternates: { languages },
    }));
  });
}
