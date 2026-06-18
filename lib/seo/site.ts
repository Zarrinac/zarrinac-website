import type { Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarrinac.com').replace(
  /\/$/,
  '',
);

// Stable sitemap <lastmod> baseline. Using a fixed date (instead of `new Date()` at
// build time) keeps the signal trustworthy — bump this only when site content
// meaningfully changes, so crawlers don't see "everything changed" on every deploy.
export const SITE_CONTENT_LAST_MODIFIED = new Date('2026-06-18T00:00:00Z');

export type SeoBreadcrumbItem = {
  label: string;
  href: string;
};

export const getLocaleLanguage = (locale: Locale) => (locale === 'fa' ? 'fa-IR' : 'en-US');

export const getHomeLabel = (locale: Locale) => (locale === 'fa' ? 'خانه' : 'Home');

export const toAbsoluteUrl = (href: string) => {
  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return `${SITE_URL}${href.startsWith('/') ? href : `/${href}`}`;
};

export const getLocalizedPath = (locale: Locale, path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
};

export const getLanguageAlternates = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const languageAlternates = routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = toAbsoluteUrl(getLocalizedPath(locale, normalizedPath));
    return acc;
  }, {});

  languageAlternates['x-default'] = toAbsoluteUrl(
    getLocalizedPath(routing.defaultLocale, normalizedPath),
  );

  return languageAlternates;
};

export const createBreadcrumbItems = (
  locale: Locale,
  current: SeoBreadcrumbItem,
  parents: SeoBreadcrumbItem[] = [],
): SeoBreadcrumbItem[] => [
  { label: getHomeLabel(locale), href: `/${locale}` },
  ...parents,
  current,
];

export const createBreadcrumbJsonLd = (items: SeoBreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: toAbsoluteUrl(item.href),
  })),
});
