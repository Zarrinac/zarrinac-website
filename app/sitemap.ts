import type { MetadataRoute } from 'next';
import { FALLBACK_PRODUCTS } from '@/lib/api/products/normalizers';
import { categoryToSlug } from '@/lib/api/products/categories';
import { REF_PRODUCTS } from '@/content/RefProducts';
import { routing } from '@/i18n/routing';
import { SITE_URL, SITE_CONTENT_LAST_MODIFIED } from '@/lib/seo/site';

// Native sitemap built from the same product source the pages serve. Using the
// content-backed product list (the API's fallback source) guarantees every URL
// resolves and includes models generated programmatically (e.g. RAC HIH/HRH
// series) that the previous regex-based generator silently dropped.

const STATIC_PATHS = [
  '/products/tvs',
  '/products/rac',
  '/products/cac',
  '/refrigerator',
  '/products/wms',
  '/about',
  '/contact-us',
  '/hisense-repair',
  '/complaint',
  '/survey',
  '/faq',
  '/warranty-and-guarantee',
  '/portal',
  '/find-service-center',
  '/request-representation',
];

const productPaths = (): string[] => {
  const categoryProductPaths = FALLBACK_PRODUCTS.reduce<string[]>((acc, product) => {
    const slug = categoryToSlug(product.category);
    if (slug) {
      acc.push(`/products/${slug}/${(product.slug ?? product.id).toLowerCase()}`);
    }
    return acc;
  }, []);

  const refrigeratorPaths = REF_PRODUCTS.map(
    (product) => `/refrigerator/${product.id.toLowerCase()}`,
  );

  return [...categoryProductPaths, ...refrigeratorPaths];
};

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
  const logicalPaths = Array.from(new Set(['', ...STATIC_PATHS, ...productPaths()]));

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
