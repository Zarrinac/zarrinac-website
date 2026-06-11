import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import JsonLd from '@/components/seo/JsonLd';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import { DCODE_BLEED_CLASS, DCODE_THEME_STYLE } from '@/components/dcode/dcodeTheme';
import { getDcodeProducts } from '@/lib/dcode/source';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

// ISR: cache the brand landing (and its DB-backed product fetch), refresh hourly.
export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const languageAlternates = getLanguageAlternates('/dcode');
  return {
    title: t('landing.metaTitle'),
    description: t('landing.metaDescription'),
    openGraph: {
      title: t('landing.metaTitle'),
      description: t('landing.metaDescription'),
      url: `/${locale}/dcode`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('landing.metaTitle'),
      description: t('landing.metaDescription'),
    },
    alternates: { canonical: `/${locale}/dcode`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeLandingPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });

  const products = await getDcodeProducts();
  const featured = products[0];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: DCODE_BRAND.name,
    href: `/${locale}/dcode`,
  });
  const Chevron = locale === 'fa' ? HiChevronLeft : HiChevronRight;

  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: DCODE_BRAND.name,
    url: `${SITE_URL}/${locale}/dcode`,
    inLanguage: getLocaleLanguage(locale),
    slogan: t('landing.tagline'),
  };

  return (
    <div className="pb-16">
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), brandSchema]} />
      <div
        style={DCODE_THEME_STYLE}
        className={`${DCODE_BLEED_CLASS} bg-(--dcode-black) text-(--dcode-text)`}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {/* Breadcrumb — part of the hero */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-(--dcode-text-muted) sm:text-sm">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <li key={item.href} className="flex items-center gap-1.5">
                    {isLast ? (
                      <span className="text-(--dcode-text)">{item.label}</span>
                    ) : (
                      <Link href={item.href} className="transition-colors hover:text-(--dcode-red)">
                        {item.label}
                      </Link>
                    )}
                    {!isLast && <Chevron aria-hidden className="opacity-60" />}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Hero */}
          <section className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <DcodeLogo className="h-12 w-auto" priority />
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {t('landing.tagline')}
              </h1>
              <p className="text-base leading-relaxed text-(--dcode-text-muted) sm:text-lg">
                {t('landing.description')}
              </p>
              <Link
                href={`/${locale}/dcode/tvs`}
                className="inline-flex items-center gap-2 rounded-full bg-(--dcode-red) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
              >
                {t('landing.exploreTvs')}
                <Chevron aria-hidden />
              </Link>
            </div>

            {featured && (
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={featured.heroImage}
                  alt={featured.copy[locale].name}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </section>

          {/* Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold">{t('landing.productsHeading')}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href={`/${locale}/dcode/tvs`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-(--dcode-border) bg-(--dcode-surface-muted) transition-colors hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
              >
                {featured && (
                  <div className="relative aspect-4/3 w-full bg-(--dcode-black)">
                    <Image
                      src={featured.heroImage}
                      alt={t('landing.tvsCardTitle')}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <h3 className="text-lg font-bold text-(--dcode-text)">
                    {t('landing.tvsCardTitle')}
                  </h3>
                  <p className="text-sm text-(--dcode-text-muted)">
                    {t('landing.tvsCardDescription')}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-(--dcode-red)">
                    {t('landing.explore')}
                    <Chevron aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
