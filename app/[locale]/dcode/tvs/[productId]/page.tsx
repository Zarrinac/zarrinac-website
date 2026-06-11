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

const buildProductJsonLd = (
  locale: Locale,
  productId: string,
  product: NonNullable<Awaited<ReturnType<typeof getDcodeProductById>>>,
) => {
  const copy = product.copy[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: copy.name,
    description: copy.description || copy.tagline,
    brand: { '@type': 'Brand', name: DCODE_BRAND.name },
    category: 'LED TV',
    image: toAbsoluteUrl(imageToUrl(product.heroImage)),
    url: `${SITE_URL}/${locale}/dcode/tvs/${productId}`,
    inLanguage: getLocaleLanguage(locale),
    // No `offers`: prices are not published, so an Offer is omitted rather than
    // emitting a price-less (invalid) one.
    model: product.variants.map((variant) => ({
      '@type': 'ProductModel',
      name: `${copy.name} ${variant.size}`,
      sku: variant.sku,
    })),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Resolution', value: product.resolution },
      { '@type': 'PropertyValue', name: 'Operating system', value: product.os },
      { '@type': 'PropertyValue', name: 'Storage', value: product.storage },
    ],
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
          buildProductJsonLd(locale, productId, product),
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
