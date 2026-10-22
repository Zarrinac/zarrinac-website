import type { MetadataRoute } from 'next';
import { loadProducts } from '@/lib/api/products/source';
import { REF_PRODUCTS } from '@/content/RefProducts';
import { routing } from '@/i18n/routing';
import { SITE_ID } from '@/lib/siteId';
import {
  HOME_CONTENT_LAST_MODIFIED,
  SECTIONS_CONTENT_LAST_MODIFIED,
  getLanguageAlternates,
  getLocalizedPath,
  toAbsoluteUrl,
} from '@/lib/seo/site';

// What each deployment of this tree publishes (see next.config.ts):
// - zarrinac.com serves the Hisense-replica sections itself (since 2026-10-22), so its
//   sitemap lists the home, the static sections and the full product catalog.
// - znci.ir still 308-forwards those sections to hisense-ir.com and /dcode to
//   dcode.co.ir, so it lists only its home. Advertising a redirected URL here would
//   be a mixed signal (sitemap says "index me", server says "308 elsewhere").

// Refresh alongside the public catalog. Each category uses exactly the same
// DB-first/fallback loader as its listing, including models added after a build.
export const revalidate = 3600;

const SERVES_HISENSE_SECTIONS = SITE_ID === 'zarrinac';

// Canonical section URLs only. Alias routes (/rac, /cac, /tv-hisense, /washing-machine,
// /support/*) permanently redirect to these, and /portal is noindex.
const STATIC_PATHS = [
  '/about',
  '/contact-us',
  '/hisense-repair',
  '/complaint',
  '/survey',
  '/faq',
  '/warranty-and-guarantee',
  '/find-service-center',
  '/request-representation',
];

const CATEGORIES = [
  ['tvs', 'TVS'],
  ['rac', 'RAC'],
  ['cac', 'CAC'],
  ['wms', 'WMS'],
] as const;

type PageEntry = { path: string; lastModified: Date; images?: string[] };

function productModifiedAt(updatedAt?: string): Date {
  const timestamp = updatedAt ? Date.parse(updatedAt) : NaN;
  return Number.isFinite(timestamp) && timestamp > SECTIONS_CONTENT_LAST_MODIFIED.getTime()
    ? new Date(timestamp)
    : SECTIONS_CONTENT_LAST_MODIFIED;
}

async function sectionEntries(): Promise<PageEntry[]> {
  const entries: PageEntry[] = STATIC_PATHS.map((path) => ({
    path,
    lastModified: SECTIONS_CONTENT_LAST_MODIFIED,
  }));

  const catalogs = await Promise.all(
    CATEGORIES.map(async ([slug, category]) => ({ slug, ...(await loadProducts(category)) })),
  );

  for (const { slug, products } of catalogs) {
    const details = products.map((product) => ({
      path: `/products/${slug}/${(product.slug || product.id).toLowerCase()}`,
      lastModified: productModifiedAt(product.updatedAt),
      images: product.imageUrl ? [toAbsoluteUrl(product.imageUrl)] : undefined,
    }));
    entries.push(
      {
        path: `/products/${slug}`,
        lastModified: new Date(
          Math.max(
            SECTIONS_CONTENT_LAST_MODIFIED.getTime(),
            ...details.map((p) => +p.lastModified),
          ),
        ),
      },
      ...details,
    );
  }

  // Refrigerator pages intentionally use bundled content, independently of DB.
  entries.push(
    { path: '/refrigerator', lastModified: SECTIONS_CONTENT_LAST_MODIFIED },
    ...REF_PRODUCTS.map((product) => ({
      path: `/refrigerator/${product.id.toLowerCase()}`,
      lastModified: SECTIONS_CONTENT_LAST_MODIFIED,
      images: [
        toAbsoluteUrl(typeof product.image === 'string' ? product.image : product.image.src),
      ],
    })),
  );

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The homepage carries its own <lastmod> (see HOME_CONTENT_LAST_MODIFIED) so a
  // sitemap resubmit gives Google a real change signal for the differentiated home.
  const entries: PageEntry[] = [
    { path: '', lastModified: HOME_CONTENT_LAST_MODIFIED },
    ...(SERVES_HISENSE_SECTIONS ? await sectionEntries() : []),
  ];

  return [...new Map(entries.map((entry) => [entry.path, entry])).values()].flatMap(
    ({ path, lastModified, images }) =>
      routing.locales.map((locale) => ({
        url: toAbsoluteUrl(getLocalizedPath(locale, path)),
        lastModified,
        ...(images ? { images } : {}),
        alternates: { languages: getLanguageAlternates(path) },
      })),
  );
}
