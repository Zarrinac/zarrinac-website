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

export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');
const imageToUrl = (image: ImageSource): string => (typeof image === 'string' ? image : image.src);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const languageAlternates = getLanguageAlternates('/dcode/tvs');
  return {
    title: t('tvs.metaTitle'),
    description: t('tvs.metaDescription'),
    openGraph: {
      title: t('tvs.metaTitle'),
      description: t('tvs.metaDescription'),
      url: `/${locale}/dcode/tvs`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('tvs.metaTitle'),
      description: t('tvs.metaDescription'),
    },
    alternates: { canonical: `/${locale}/dcode/tvs`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeTvsCategoryPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });

  const products = await getDcodeProducts();

  const breadcrumbItems = createBreadcrumbItems(
    locale,
    { label: t('tvs.title'), href: `/${locale}/dcode/tvs` },
    [{ label: DCODE_BRAND.name, href: `/${locale}/dcode` }],
  );
  const Chevron = locale === 'fa' ? HiChevronLeft : HiChevronRight;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('tvs.title'),
    description: t('tvs.metaDescription'),
    url: `${SITE_URL}/${locale}/dcode/tvs`,
    inLanguage: getLocaleLanguage(locale),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/${locale}/dcode/tvs/${product.id}`,
        item: {
          '@type': 'Thing',
          name: product.copy[locale].name,
          image: toAbsoluteUrl(imageToUrl(product.heroImage)),
          url: `${SITE_URL}/${locale}/dcode/tvs/${product.id}`,
        },
      })),
    },
  };

  return (
    <div className="pb-16">
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), collectionSchema]} />
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
          <header className="space-y-4">
            <DcodeLogo className="h-9 w-auto" priority />
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t('tvs.title')}</h1>
            <p className="text-base text-(--dcode-text-muted) sm:text-lg">{t('tvs.tagline')}</p>
          </header>

          {/* Product grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const copy = product.copy[locale];
              const sizes = product.variants.map((variant) => variant.size).join(' · ');
              return (
                <Link
                  key={product.id}
                  href={`/${locale}/dcode/tvs/${product.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-(--dcode-border) bg-(--dcode-surface-muted) transition-colors hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
                >
                  <div className="relative aspect-4/3 w-full bg-(--dcode-black)">
                    <Image
                      src={product.heroImage}
                      alt={copy.name}
                      fill
                      priority={index === 0}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
                      {product.series}
                    </p>
                    <h2 className="text-lg font-bold text-(--dcode-text)">{copy.name}</h2>
                    <p className="text-sm text-(--dcode-text-muted)">{copy.tagline}</p>
                    <p className="mt-2 text-xs font-semibold text-(--dcode-text-muted)" dir="ltr">
                      {sizes}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-(--dcode-red)">
                      {t('tvs.viewProduct')}
                      <Chevron aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
