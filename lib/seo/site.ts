import type { Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { SITE_ID, type SiteId } from '@/lib/siteId';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarrinac.com').replace(
  /\/$/,
  '',
);

// Stable sitemap <lastmod> baseline. Using a fixed date (instead of `new Date()` at
// build time) keeps the signal trustworthy — bump this only when site content
// meaningfully changes, so crawlers don't see "everything changed" on every deploy.
export const SITE_CONTENT_LAST_MODIFIED = new Date('2026-06-18T00:00:00Z');

// Homepage-specific <lastmod>. The home content was differentiated from hisense-ir.com
// (to resolve the cross-domain "duplicate canonical" GSC issue, where Google folded the
// two identical homepages) after the baseline above, so the home URL carries its own
// fresher date — a targeted change signal for Google to recrawl the differentiated home.
//
// Per-site, because zarrinac.com and znci.ir build from this same tree with different
// home copy (content/homeSeoContent.ts). Differentiating znci's home changes znci's home
// only; bumping one shared constant would falsely tell Google that zarrinac.com's home
// changed as well — the exact false-freshness signal the split above exists to avoid.
// Bump a deployment's entry whenever you edit that deployment's home copy.
const ZARRINAC_HOME_LAST_MODIFIED = new Date('2026-07-26T00:00:00Z');

const HOME_CONTENT_LAST_MODIFIED_BY_SITE: Partial<Record<SiteId, Date>> = {
  zarrinac: ZARRINAC_HOME_LAST_MODIFIED,
  // znci.ir's home was given its own trade-partner copy on 2026-09-09.
  znci: new Date('2026-09-09T00:00:00Z'),
};

export const HOME_CONTENT_LAST_MODIFIED =
  HOME_CONTENT_LAST_MODIFIED_BY_SITE[SITE_ID] ?? ZARRINAC_HOME_LAST_MODIFIED;

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
