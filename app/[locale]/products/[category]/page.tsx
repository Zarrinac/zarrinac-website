import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import TvHeroCarousel from '@/components/tv/TvHeroCarousel';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import CategorySeoSection from '@/components/seo/CategorySeoSection';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import { FALLBACK_PRODUCTS } from '@/lib/api/products/normalizers';
import type { ApiProduct } from '@/lib/api/products/types';
import {
  categoryFromSlug,
  type ProductCategory,
  type ProductCategorySlug,
} from '@/lib/api/products/categories';
import { mediaUrl } from '@/lib/mediaUrl';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { createInternalApiUrl } from '@/lib/api/internalUrl';
import { CATEGORY_SEO_CONTENT } from '@/lib/seo/categorySeoContent';
import { buildCategoryMetaTitle } from '@/lib/seo/productMeta';

// ISR: cache category listings (and their DB-backed product fetch) and refresh
// hourly instead of re-querying the database on every request/crawl.
export const revalidate = 3600;

const bannerAsset = (path: string) => mediaUrl(`/tv-banner/${path}`);

const HERO_SLIDES = [
  { id: 'rgb', image: bannerAsset('tv04.tv-rgb-ban.jpg') },
  { id: 'ux', image: bannerAsset('tv01.ux-mini-led-tv.jpg') },
  { id: 'u8', image: bannerAsset('tv02.u8-mini-led-tv.jpg') },
  { id: 'u7', image: bannerAsset('tv03.u7-mini-led-tv.jpg') },
] as const;

type PageParams = {
  locale?: string;
  category?: string;
};

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

const fetchProducts = async (
  categorySlug: ProductCategorySlug,
  category: ProductCategory,
): Promise<ApiProduct[]> => {
  const fallback = FALLBACK_PRODUCTS.filter((product) => product.category === category);
  const apiUrl = createInternalApiUrl(`/api/products?category=${categorySlug}`);
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!response.ok) {
      return fallback;
    }
    let data: ApiProduct[];
    try {
      data = (await response.json()) as ApiProduct[];
    } catch {
      return fallback;
    }
    return Array.isArray(data) && data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
};

const buildProductListJsonLd = ({
  locale,
  categorySlug,
  title,
  description,
  products,
  lang,
}: {
  locale: Locale;
  categorySlug: ProductCategorySlug;
  title: string;
  description: string;
  products: ApiProduct[];
  lang: 'fa' | 'en';
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: title,
  description,
  url: `${SITE_URL}/${locale}/products/${categorySlug}`,
  inLanguage: getLocaleLanguage(locale),
  mainEntity: {
    '@type': 'ItemList',
    name: title,
    itemListElement: products.map((product, index) => {
      const copy = product.copy[lang] ?? product.copy.en;
      const slug = (product.slug ?? product.id).toLocaleLowerCase();

      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/${locale}/products/${categorySlug}/${slug}`,
        item: {
          '@type': 'Thing',
          name: copy.name,
          description: copy.tagline,
          identifier: product.sku ?? product.id,
          image: toAbsoluteUrl(product.imageUrl),
          url: `${SITE_URL}/${locale}/products/${categorySlug}/${slug}`,
        },
      };
    }),
  },
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolved?.locale ?? (await getLocale());
  setRequestLocale(locale);
  const categorySlug = (resolved?.category ?? '').toLowerCase() as ProductCategorySlug;
  const category = categoryFromSlug(categorySlug);

  if (!category) {
    return {};
  }

  if (category === 'TVS') {
    const routeTranslations = await getTranslations('Routes.tvHisense');
    const pageTranslations = await getTranslations('TvHisensePage');
    const keywordsRaw: unknown = pageTranslations.raw('metadata.keywords');
    const languageAlternates = getLanguageAlternates(`/products/${categorySlug}`);
    const ogImage = HERO_SLIDES[0]?.image;
    const ogImageUrl =
      typeof ogImage === 'string' && ogImage.length > 0
        ? ogImage.startsWith('http')
          ? ogImage
          : `${SITE_URL}${ogImage}`
        : undefined;

    return {
      title: buildCategoryMetaTitle(locale, routeTranslations('title')),
      description: routeTranslations('description'),
      keywords: Array.isArray(keywordsRaw) ? keywordsRaw : undefined,
      openGraph: {
        title: routeTranslations('title'),
        description: routeTranslations('description'),
        url: `/${locale}/products/${categorySlug}`,
        type: 'website',
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: routeTranslations('title'),
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: routeTranslations('title'),
        description: routeTranslations('description'),
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
      alternates: {
        canonical: `/${locale}/products/${categorySlug}`,
        languages: languageAlternates,
      },
      metadataBase: new URL(SITE_URL),
    };
  }

  if (category === 'WMS') {
    const routeTranslations = await getTranslations('Routes.washingMachine');
    const languageAlternates = getLanguageAlternates(`/products/${categorySlug}`);
    return {
      title: buildCategoryMetaTitle(locale, routeTranslations('title')),
      description: routeTranslations('description'),
      openGraph: {
        title: routeTranslations('title'),
        description: routeTranslations('description'),
        url: `/${locale}/products/${categorySlug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: routeTranslations('title'),
        description: routeTranslations('description'),
      },
      alternates: {
        canonical: `/${locale}/products/${categorySlug}`,
        languages: languageAlternates,
      },
      metadataBase: new URL(SITE_URL),
    };
  }

  if (category === 'RAC') {
    const routeTranslations = await getTranslations('Routes.rac');
    const languageAlternates = getLanguageAlternates(`/products/${categorySlug}`);
    return {
      title: buildCategoryMetaTitle(locale, routeTranslations('title')),
      description: routeTranslations('description'),
      openGraph: {
        title: routeTranslations('title'),
        description: routeTranslations('description'),
        url: `/${locale}/products/${categorySlug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: routeTranslations('title'),
        description: routeTranslations('description'),
      },
      alternates: {
        canonical: `/${locale}/products/${categorySlug}`,
        languages: languageAlternates,
      },
      metadataBase: new URL(SITE_URL),
    };
  }

  if (category === 'CAC') {
    const routeTranslations = await getTranslations('Routes.cac');
    const languageAlternates = getLanguageAlternates(`/products/${categorySlug}`);
    return {
      title: buildCategoryMetaTitle(locale, routeTranslations('title')),
      description: routeTranslations('description'),
      openGraph: {
        title: routeTranslations('title'),
        description: routeTranslations('description'),
        url: `/${locale}/products/${categorySlug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: routeTranslations('title'),
        description: routeTranslations('description'),
      },
      alternates: {
        canonical: `/${locale}/products/${categorySlug}`,
        languages: languageAlternates,
      },
      metadataBase: new URL(SITE_URL),
    };
  }

  return {};
}

export default async function ProductsCategoryPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolved?.locale ?? (await getLocale());
  setRequestLocale(locale);
  const categorySlug = (resolved?.category ?? '').toLowerCase() as ProductCategorySlug;
  const category = categoryFromSlug(categorySlug);

  if (!category) {
    notFound();
  }

  if (category === 'TVS') {
    const [routeTranslations, pageTranslations] = await Promise.all([
      getTranslations('Routes.tvHisense'),
      getTranslations('TvHisensePage'),
    ]);
    const products = await fetchProducts(categorySlug, category);
    const detailsLabel = pageTranslations('actions.details');
    const lang: 'fa' | 'en' = locale === 'fa' ? 'fa' : 'en';
    const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
    const breadcrumbItems = createBreadcrumbItems(resolvedLocale, {
      label: routeTranslations('title'),
      href: `/${resolvedLocale}/products/${categorySlug}`,
    });
    const listSchema = buildProductListJsonLd({
      locale: resolvedLocale,
      categorySlug,
      title: routeTranslations('title'),
      description: routeTranslations('description'),
      products,
      lang,
    });
    const officialLinks =
      locale === 'fa'
        ? {
            eyebrow: 'مسیرهای رسمی',
            title: 'صفحات اصلی هایسنس ایران',
            items: [
              {
                href: `/${locale}`,
                label: 'صفحه اصلی هایسنس ایران',
                description: 'مرجع رسمی برند، دسته‌بندی محصولات و سیگنال اصلی جستجوی برند.',
              },
              {
                href: `/${locale}/about`,
                label: 'درباره زرین نمای کاسپین',
                description: 'آشنایی با نمایندگی رسمی و شبکه فروش و خدمات برند در ایران.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'تماس و مشاوره خرید',
                description: 'ارتباط با تیم رسمی برای خرید، استعلام و پشتیبانی محصولات.',
              },
              {
                href: `/${locale}/warranty-and-guarantee`,
                label: 'گارانتی و خدمات',
                description: 'اطلاعات گارانتی، خدمات پس از فروش و شرایط پشتیبانی رسمی.',
              },
            ],
          }
        : {
            eyebrow: 'Official paths',
            title: 'Primary Hisense Iran pages',
            items: [
              {
                href: `/${locale}`,
                label: 'Hisense Iran homepage',
                description:
                  'Primary brand hub for official products, categories, and entity signals.',
              },
              {
                href: `/${locale}/about`,
                label: 'About Zarrin Namaye Caspian',
                description:
                  'Official representative profile, network scale, and company background.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'Contact and sales advice',
                description:
                  'Reach the official team for support, purchases, and product guidance.',
              },
              {
                href: `/${locale}/warranty-and-guarantee`,
                label: 'Warranty and service',
                description: 'Official warranty terms and after-sales service information.',
              },
            ],
          };

    const heroSlides = HERO_SLIDES.map((slide) => ({
      id: slide.id,
      image: slide.image,
      eyebrow: pageTranslations(`heroSlides.${slide.id}.eyebrow`),
      title: pageTranslations(`heroSlides.${slide.id}.title`),
      subtitle: pageTranslations(`heroSlides.${slide.id}.subtitle`),
    }));

    return (
      <div className="pb-16 space-y-14 lg:space-y-20 lg:pb-24">
        <JsonLd data={listSchema} />
        <PageBreadcrumbs items={breadcrumbItems} locale={resolvedLocale} className="pt-5 sm:pt-6" />
        <div className="-mx-4 sm:-mx-6 lg:-mx-10 max-w-360 3xl:mx-auto">
          <TvHeroCarousel slides={heroSlides} locale={locale} />
        </div>

        <div className="w-full px-4 mx-auto max-w-480 sm:px-6 lg:px-10">
          <div className="mb-8 text-center">
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{routeTranslations('title')}</h1>
            <p className="mt-3 text-base text-(--text-muted-color) sm:text-lg">
              {routeTranslations('description')}
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {products.map((product, index) => {
              const copy = product.copy[lang] ?? product.copy.en;
              const featureTags = (product.extras ?? []).slice(0, 3).filter(Boolean);
              const overlayFeatures =
                featureTags.length > 0
                  ? featureTags
                  : [product.panel, product.refreshRate, product.os].filter(Boolean).slice(0, 3);
              return (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${categorySlug}/${(product.slug ?? product.id).toLocaleLowerCase()}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-(--panel-shadow) transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--overlay-color) 55%,transparent)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                >
                  <div className="relative w-full overflow-hidden">
                    <div className="relative aspect-4/3 w-full bg-(--surface-color)">
                      <Image
                        src={product.imageUrl}
                        alt={copy.name}
                        fill
                        priority={index === 0}
                        className="object-contain transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-(--overlay-color) via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="flex h-10 w-full items-center gap-2 bg-linear-to-b from-(--surface-hover-color) to-(--surface-color) px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--default-black-font)">
                        {overlayFeatures.map((feature) => (
                          <span key={feature} className="flex-1 leading-4 text-center">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-center pb-5">
                        <div className="relative inline-flex">
                          <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--default-black-font) px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition duration-200 peer-hover:opacity-100 peer-focus-visible:opacity-100">
                            {detailsLabel}
                          </span>
                          <span
                            className="peer inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-(--default-black-font) shadow-sm ring-1 ring-(--border-color) transition duration-200 group-hover:bg-white group-hover:text-black dark:group-hover:text-black hover:bg-(--brand-color) hover:text-white hover:ring-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                            aria-label={detailsLabel}
                          >
                            <Visibility fontSize="small" className="w-5 h-5" aria-hidden="true" />
                            <span className="sr-only">{detailsLabel}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-1.5 p-4 sm:gap-2 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--text-subtle-color)">
                      {product.series}
                    </p>
                    <h3 className="text-base font-bold text-(--default-black-font) sm:text-xl">
                      {copy.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {CATEGORY_SEO_CONTENT[categorySlug]?.[resolvedLocale] && (
          <CategorySeoSection
            content={CATEGORY_SEO_CONTENT[categorySlug][resolvedLocale]}
            locale={resolvedLocale}
          />
        )}

        <OfficialLinksSection
          locale={locale}
          eyebrow={officialLinks.eyebrow}
          title={officialLinks.title}
          items={officialLinks.items}
        />
      </div>
    );
  }

  if (category === 'WMS' || category === 'RAC' || category === 'CAC') {
    const routeKey =
      category === 'RAC'
        ? 'Routes.rac'
        : category === 'CAC'
          ? 'Routes.cac'
          : 'Routes.washingMachine';
    const [routeTranslations, pageTranslations] = await Promise.all([
      getTranslations(routeKey),
      getTranslations('TvHisensePage'),
    ]);
    const products = await fetchProducts(categorySlug, category);
    const lang: 'fa' | 'en' = locale === 'fa' ? 'fa' : 'en';
    const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
    const detailsLabel = pageTranslations('actions.details');
    const breadcrumbItems = createBreadcrumbItems(resolvedLocale, {
      label: routeTranslations('title'),
      href: `/${resolvedLocale}/products/${categorySlug}`,
    });
    const listSchema = buildProductListJsonLd({
      locale: resolvedLocale,
      categorySlug,
      title: routeTranslations('title'),
      description: routeTranslations('description'),
      products,
      lang,
    });
    const officialLinks =
      locale === 'fa'
        ? {
            eyebrow: 'مسیرهای رسمی',
            title: 'صفحات اصلی هایسنس ایران',
            items: [
              {
                href: `/${locale}`,
                label: 'صفحه اصلی هایسنس ایران',
                description: 'مرجع رسمی برند و دسته‌بندی محصولات هایسنس در ایران.',
              },
              {
                href: `/${locale}/about`,
                label: 'درباره نمایندگی رسمی',
                description: 'معرفی زرین نمای کاسپین و شبکه فروش و خدمات رسمی برند.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'تماس و مشاوره',
                description: 'مشاوره خرید، استعلام و ارتباط با تیم رسمی هایسنس ایران.',
              },
              ...(category === 'CAC'
                ? [
                    {
                      href: `/${locale}/products/cac`,
                      label: 'تهویه مطبوع تجاری هایسنس',
                      description: 'مرجع راهکارهای CAC و سیستم‌های کانالی و تجاری هایسنس.',
                    },
                  ]
                : [
                    {
                      href: `/${locale}/hisense-repair`,
                      label: 'خدمات تعمیر و پشتیبانی',
                      description: 'ثبت درخواست سرویس و پشتیبانی رسمی محصولات هایسنس.',
                    },
                  ]),
            ],
          }
        : {
            eyebrow: 'Official paths',
            title: 'Primary Hisense Iran pages',
            items: [
              {
                href: `/${locale}`,
                label: 'Hisense Iran homepage',
                description:
                  'Official brand hub for categories, products, and core company signals.',
              },
              {
                href: `/${locale}/about`,
                label: 'About the official representative',
                description:
                  'Learn about Zarrin Namaye Caspian and the national distribution network.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'Contact and consultation',
                description:
                  'Reach the official team for support, purchases, and product questions.',
              },
              ...(category === 'CAC'
                ? [
                    {
                      href: `/${locale}/products/cac`,
                      label: 'Commercial air conditioning',
                      description:
                        'Official CAC hub for ducted and commercial Hisense climate solutions.',
                    },
                  ]
                : [
                    {
                      href: `/${locale}/hisense-repair`,
                      label: 'Repair and support',
                      description: 'Official service, maintenance, and repair request page.',
                    },
                  ]),
            ],
          };

    return (
      <div className="pb-16 space-y-12 lg:space-y-16 lg:pb-24">
        <JsonLd data={listSchema} />
        <RouteHero
          eyebrow={routeTranslations('eyebrow')}
          title={routeTranslations('title')}
          description={routeTranslations('description')}
          locale={resolvedLocale}
          breadcrumbItems={breadcrumbItems}
        />

        <div className="w-full px-4 mx-auto max-w-480 sm:px-6 lg:px-10">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {products.map((product, index) => {
              const copy = product.copy[lang] ?? product.copy.en;
              const seriesLabel = product.seriesLabel ?? product.series;
              const seriesLabelDir =
                lang === 'fa' && /[A-Za-z]/.test(seriesLabel) ? 'ltr' : undefined;
              const featureTags = (product.extras ?? []).slice(0, 3).filter(Boolean);
              const fallbackTags = [seriesLabel, ...(product.sizes ?? [])]
                .filter(Boolean)
                .slice(0, 3);
              const overlayFeatures = featureTags.length > 0 ? featureTags : fallbackTags;
              return (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${categorySlug}/${(product.slug ?? product.id).toLocaleLowerCase()}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-(--panel-shadow) transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--overlay-color) 55%,transparent)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                >
                  <div className="relative w-full overflow-hidden">
                    <div className="relative aspect-4/3 w-full bg-(--surface-color)">
                      <Image
                        src={product.imageUrl}
                        alt={copy.name}
                        fill
                        priority={index === 0}
                        className="object-contain transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-(--overlay-color) via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="flex h-10 w-full items-center gap-2 bg-linear-to-b from-(--surface-hover-color) to-(--surface-color) px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--default-black-font)">
                        {overlayFeatures.map((feature) => (
                          <span key={feature} className="flex-1 leading-4 text-center">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-center pb-5">
                        <div className="relative inline-flex">
                          <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--default-black-font) px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition duration-200 peer-hover:opacity-100 peer-focus-visible:opacity-100">
                            {detailsLabel}
                          </span>
                          <span
                            className="peer inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-(--default-black-font) shadow-sm ring-1 ring-(--border-color) transition duration-200 group-hover:bg-white group-hover:text-black dark:group-hover:text-black hover:bg-(--brand-color) hover:text-white hover:ring-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                            aria-label={detailsLabel}
                          >
                            <Visibility fontSize="small" className="w-5 h-5" aria-hidden="true" />
                            <span className="sr-only">{detailsLabel}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-1.5 p-4 sm:gap-2 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--text-subtle-color)">
                      <span dir={seriesLabelDir}>{seriesLabel}</span>
                    </p>
                    <h3 className="text-base font-bold text-(--default-black-font) sm:text-xl">
                      {copy.name}
                    </h3>
                    <p className="text-xs text-(--text-muted-color) sm:text-sm">{copy.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {CATEGORY_SEO_CONTENT[categorySlug]?.[resolvedLocale] && (
          <CategorySeoSection
            content={CATEGORY_SEO_CONTENT[categorySlug][resolvedLocale]}
            locale={resolvedLocale}
          />
        )}

        <OfficialLinksSection
          locale={locale}
          eyebrow={officialLinks.eyebrow}
          title={officialLinks.title}
          items={officialLinks.items}
        />
      </div>
    );
  }

  notFound();
}
