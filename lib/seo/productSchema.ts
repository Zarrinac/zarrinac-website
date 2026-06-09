import type { Locale } from '@/i18n/routing';
import { SITE_URL, getLocaleLanguage, toAbsoluteUrl } from './site';

// Shared schema.org Product builder so TV/RAC/WMS/CAC and refrigerator detail
// pages emit consistent Product + Brand structured data.
//
// `offers` decision: the site intentionally publishes no prices (volatile rial
// pricing, distributor model — quotes go through authorized representatives). A
// price-less Offer is invalid for Google rich results, so we emit NO `offers` by
// default. The builder is forward-compatible: pass a positive `price` and it emits
// a valid Offer (priceCurrency defaults to IRR, availability to InStock, seller =
// the Organization) — unlocking product rich results with zero call-site changes
// the moment products carry a price.

type ProductOfferAvailability = 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder';

type ProductJsonLdInput = {
  locale: Locale;
  name: string;
  description?: string;
  /** Absolute canonical URL of the product page. */
  url: string;
  /** Primary image src (relative or absolute). */
  image: string;
  sku?: string | null;
  mpn?: string | null;
  /** Localized category label, e.g. "تلویزیون هایسنس". */
  category?: string;
  /** Optional gallery/extra image srcs. */
  additionalImages?: string[];
  /** Optional price. When > 0, a valid `offers` node is emitted. */
  price?: number | null;
  /** ISO 4217 currency for the offer. Defaults to Iranian Rial. */
  priceCurrency?: string;
  /** Stock state for the offer. Defaults to InStock. */
  availability?: ProductOfferAvailability;
};

export const buildProductJsonLd = ({
  locale,
  name,
  description,
  url,
  image,
  sku,
  mpn,
  category,
  additionalImages = [],
  price,
  priceCurrency = 'IRR',
  availability = 'InStock',
}: ProductJsonLdInput) => {
  const images = Array.from(
    new Set(
      [image, ...additionalImages].filter((src): src is string => Boolean(src)).map(toAbsoluteUrl),
    ),
  );

  const hasPrice = typeof price === 'number' && Number.isFinite(price) && price > 0;
  const offers = hasPrice
    ? {
        offers: {
          '@type': 'Offer',
          price: String(price),
          priceCurrency,
          availability: `https://schema.org/${availability}`,
          url,
          seller: { '@id': `${SITE_URL}#organization` },
        },
      }
    : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(sku ? { sku } : {}),
    ...(mpn ? { mpn } : {}),
    ...(category ? { category } : {}),
    brand: { '@type': 'Brand', name: 'Hisense' },
    manufacturer: { '@type': 'Organization', name: 'Hisense' },
    url,
    inLanguage: getLocaleLanguage(locale),
    isRelatedTo: { '@id': `${SITE_URL}#organization` },
    ...offers,
  };
};
