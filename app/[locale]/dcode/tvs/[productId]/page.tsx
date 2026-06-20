import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import DcodeShowcase from '@/components/dcode/DcodeShowcase';
import { DCODE_BLEED_CLASS } from '@/components/dcode/dcodeTheme';
import { getDcodeProductById } from '@/lib/dcode/source';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { ImageSource } from '@/types/tv';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';

// ISR: cache the detail page (and its DB-backed product fetch) and refresh hourly.
export const revalidate = 3600;

type PageParams = { locale?: string; productId?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');
const imageToUrl = (image: ImageSource): string => (typeof image === 'string' ? image : image.src);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const productId = (resolved?.productId ?? '').toLowerCase();
  const product = await getDcodeProductById(productId);
  if (!product) return {};

  const copy = product.copy[locale];
  const languageAlternates = getLanguageAlternates(`/dcode/tvs/${productId}`);
  return {
    title: copy.name,
    description: copy.description || copy.tagline,
    openGraph: {
      title: copy.name,
      description: copy.description || copy.tagline,
      url: `/${locale}/dcode/tvs/${productId}`,
      type: 'website',
      images: [{ url: imageToUrl(product.heroImage) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.name,
      description: copy.description || copy.tagline,
      images: [imageToUrl(product.heroImage)],
    },
    alternates: {
      canonical: `/${locale}/dcode/tvs/${productId}`,
      languages: languageAlternates,
    },
    metadataBase: new URL(SITE_URL),
  };
}

// This site is informational (no e-commerce, no published prices), so the detail
// page is described as a `WebPage` whose `about` is a generic `Thing` — NOT a
// schema.org `Product`. A price-less `Product` triggers Google's "Either offers,
// review, or aggregateRating should be specified" warning and is never eligible
// for product rich results anyway, while faking an Offer/rating violates Google
// policy. Mirrors the Hisense product `productPageSchema` (WebPage + about Thing).
const buildProductPageJsonLd = (
  locale: Locale,
  productId: string,
  product: NonNullable<Awaited<ReturnType<typeof getDcodeProductById>>>,
) => {
  const copy = product.copy[locale];
  const url = `${SITE_URL}/${locale}/dcode/tvs/${productId}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.name,
    description: copy.description || copy.tagline,
    url,
    inLanguage: getLocaleLanguage(locale),
    isPartOf: { '@id': `${SITE_URL}#website` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(imageToUrl(product.heroImage)),
    },
    about: {
      '@type': 'Thing',
      name: copy.name,
      description: copy.description || copy.tagline,
      url,
      image: toAbsoluteUrl(imageToUrl(product.heroImage)),
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Brand', value: DCODE_BRAND.name },
        { '@type': 'PropertyValue', name: 'Category', value: 'LED TV' },
        { '@type': 'PropertyValue', name: 'Resolution', value: product.resolution },
        { '@type': 'PropertyValue', name: 'Operating system', value: product.os },
        { '@type': 'PropertyValue', name: 'Storage', value: product.storage },
        ...product.variants.map((variant) => ({
          '@type': 'PropertyValue' as const,
          name: `Model ${variant.size}`,
          value: variant.sku,
        })),
      ],
    },
  };
};

export default async function DcodeTvDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const productId = (resolved?.productId ?? '').toLowerCase();

  const product = await getDcodeProductById(productId);
  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const copy = product.copy[locale];

  const breadcrumbItems = createBreadcrumbItems(
    locale,
    { label: copy.name, href: `/${locale}/dcode/tvs/${productId}` },
    [
      { label: DCODE_BRAND.name, href: `/${locale}/dcode` },
      { label: t('tvs.title'), href: `/${locale}/dcode/tvs` },
    ],
  );

  const labels = {
    selectSize: t('detail.selectSize'),
    model: t('detail.model'),
    specifications: t('detail.specifications'),
    keyFeatures: t('detail.keyFeatures'),
    gallery: t('detail.gallery'),
    dimensionsWithStand: t('detail.dimensionsWithStand'),
    dimensionsWithoutStand: t('detail.dimensionsWithoutStand'),
    netWeight: t('detail.netWeight'),
    watchVideo: t('detail.watchVideo'),
  };

  return (
    <div className="pb-16">
      <JsonLd
        data={[
          createBreadcrumbJsonLd(breadcrumbItems),
          buildProductPageJsonLd(locale, productId, product),
        ]}
      />
      <div className={DCODE_BLEED_CLASS}>
        <DcodeShowcase
          product={product}
          locale={locale}
          labels={labels}
          breadcrumbItems={breadcrumbItems}
        />
      </div>
    </div>
  );
}
