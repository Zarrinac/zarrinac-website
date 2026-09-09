import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import HeroBanner from '@/components/hero/HeroBanner';
import CategorySpotlights from '@/components/home/CategorySpotlights';
import type { SpotlightCard } from '@/components/home/CategorySpotlights';
import CatalogDownloadSection from '@/components/catalog/CatalogDownloadSection';
import JsonLd from '@/components/seo/JsonLd';
import { mediaUrl } from '@/lib/mediaUrl';
import { getLanguageAlternates, getLocaleLanguage, SITE_URL, toAbsoluteUrl } from '@/lib/seo/site';
import { getHomeSeoContent, type HomepageLocale } from '@/content/homeSeoContent';

// Locale-aware homepage renders the hero carousel and localized category spotlights.

const bannerAsset = (path: string) => mediaUrl(`/banner/${path}`);

const SPOTLIGHT_SOURCES = [
  {
    id: 'tv',
    href: '/products/tvs',
    image: bannerAsset('Fix-Banner-02-Back.webp'),
    mobileImage: bannerAsset('Fix-Banner-02-Back-mobile.webp'),
  },
  {
    id: 'refrigerator',
    href: '/refrigerator',
    image: bannerAsset('Fix-Banner-03-Back.webp'),
    mobileImage: bannerAsset('Fix-Banner-03-Back-mobile.webp'),
  },
  {
    id: 'washingMachine',
    href: '/products/wms',
    image: bannerAsset('Fix-Banner-04-Back.webp'),
    mobileImage: bannerAsset('Fix-Banner-04-Back-mobile.webp'),
  },
  {
    id: 'rac',
    href: '/products/rac',
    image: bannerAsset('Fix-Banner-05-Back.webp'),
    mobileImage: bannerAsset('Fix-Banner-05-Back-mobile.webp'),
  },
] as const satisfies ReadonlyArray<Pick<SpotlightCard, 'id' | 'href' | 'image' | 'mobileImage'>>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const resolvedLocale: HomepageLocale = locale === 'en' ? 'en' : 'fa';
  const seoContent = getHomeSeoContent(resolvedLocale);
  const canonical = `/${resolvedLocale}`;
  const ogImage = toAbsoluteUrl(bannerAsset('Fix-Banner-07.webp'));

  return {
    title: seoContent.title,
    description: seoContent.description,
    alternates: {
      canonical,
      languages: getLanguageAlternates('/'),
    },
    openGraph: {
      title: seoContent.title,
      description: seoContent.description,
      url: `${SITE_URL}${canonical}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoContent.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoContent.title,
      description: seoContent.description,
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const categoryTranslations = await getTranslations('HomePage.categories');
  const locale = await getLocale();
  const resolvedLocale: HomepageLocale = locale === 'en' ? 'en' : 'fa';
  const seoContent = getHomeSeoContent(resolvedLocale);
  const isRTL = resolvedLocale === 'fa';
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoContent.title,
    description: seoContent.description,
    url: `${SITE_URL}/${resolvedLocale}`,
    inLanguage: getLocaleLanguage(resolvedLocale),
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    about: {
      '@id': `${SITE_URL}#organization`,
    },
  };

  const localizedSpotlights: SpotlightCard[] = SPOTLIGHT_SOURCES.map((spotlight) => ({
    ...spotlight,
    eyebrow: categoryTranslations(`items.${spotlight.id}.eyebrow`),
    title: categoryTranslations(`items.${spotlight.id}.title`),
    description: categoryTranslations(`items.${spotlight.id}.description`),
    cta: categoryTranslations(`items.${spotlight.id}.cta`),
    href: `/${locale}${spotlight.href}`,
  }));

  return (
    <>
      <JsonLd data={pageSchema} />
      <div className="-mx-4 sm:-mx-6 lg:-mx-10">
        <HeroBanner />
      </div>
      <section className="bg-(--surface-color) py-12 lg:py-16" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-(--brand-color)">
              {seoContent.eyebrow}
            </p>
            <h1 className="text-3xl font-bold leading-snug tracking-tight text-(--default-black-font) sm:text-4xl">
              {seoContent.heading}
            </h1>
            {seoContent.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-3xl text-base leading-8 text-(--text-muted-color) sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {seoContent.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${resolvedLocale}${link.href}`}
                  className="inline-flex items-center rounded-full border border-(--border-color) px-4 py-2 text-sm font-semibold text-(--default-black-font) transition hover:border-(--brand-color) hover:text-(--brand-color)"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {seoContent.trustSignals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-3xl border border-(--border-color) bg-(--surface-muted-color) p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-(--brand-color)">{signal.value}</p>
                <p className="mt-2 text-sm leading-7 text-(--text-muted-color)">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CategorySpotlights
        eyebrow={categoryTranslations('eyebrow')}
        title={categoryTranslations('title')}
        items={localizedSpotlights}
        locale={locale}
      />
      <CatalogDownloadSection
        eyebrow={seoContent.catalog.eyebrow}
        heading={seoContent.catalog.heading}
        description={seoContent.catalog.description}
        cta={seoContent.catalog.cta}
        note={seoContent.catalog.note}
        isRTL={isRTL}
      />
    </>
  );
}
