import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Visibility } from '@mui/icons-material';
import type { Locale } from '@/i18n/routing';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import CategorySeoSection from '@/components/seo/CategorySeoSection';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import { mediaUrl } from '@/lib/mediaUrl';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { CATEGORY_SEO_CONTENT } from '@/lib/seo/categorySeoContent';
import { buildCategoryMetaDescription, buildCategoryMetaTitle } from '@/lib/seo/productMeta';

const bannerAsset = (path: string) => mediaUrl(`/products/refrigerator/banner/${path}`);
const productAsset = (path: string) => mediaUrl(`/products/refrigerator/${path}`);

const HERO_BANNERS = {
  desktop: bannerAsset('refrigerator-no-1.webp'),
  mobile: bannerAsset('refrigerator-no-1-mob.webp'),
};

type ProductTitle = Partial<Record<'en' | 'fa', string>>;

type RefrigeratorProduct = {
  id: string;
  label: string;
  image: string;
  title?: string | ProductTitle;
};

const REFRIGERATOR_PRODUCTS = [
  {
    id: 'sbs-650',
    label: 'SBS-650',
    image: productAsset('sbs-650/Sbs-650-card.png'),
    title: {
      fa: 'یخچال فریزر ساید بای ساید 650',
      en: 'Side-by-Side Refrigerator 650',
    },
  },
  {
    id: 'rft-560',
    label: 'RFT-560',
    image: productAsset('rft-560/rft-560-card.png'),
    title: {
      fa: 'یخچال فریزر بالا مدل 560',
      en: 'Top-Mount Refrigerator 560',
    },
  },
  {
    id: 'rfc500',
    label: 'RFC500',
    image: productAsset('rfc-500/rfc-500-card.png'),
    title: {
      fa: 'یخچال فریزر کمبی مدل 500',
      en: 'Combi Refrigerator 500',
    },
  },
  {
    id: 'rfc300',
    label: 'RFC300',
    image: productAsset('rfc-300/rfc-300-card.jpg'),
    title: {
      fa: 'یخچال فریزر کمبی مدل 300',
      en: 'Combi Refrigerator 300',
    },
  },
  {
    id: 'rs-370',
    label: 'RS-370',
    image: productAsset('rs-370/rs-370-card.png'),
    title: {
      fa: 'یخچال هایسنس مدل RS-370',
      en: 'Hisense Refrigerator RS-370',
    },
  },
  {
    id: 'fs-270',
    label: 'FS-270',
    image: productAsset('fs-270/fs-270-card.jpg'),
    title: {
      fa: 'فریزر هایسنس مدل FS-270',
      en: 'Hisense Freezer FS-270',
    },
  },
  {
    id: 'fc-310',
    label: 'FC-310',
    image: productAsset('fc-310/fc-310-card.png'),
    title: {
      fa: 'فریزر صندوقی هایسنس مدل FC-310',
      en: 'Hisense Chest Freezer FC-310',
    },
  },
  {
    id: 'fc-210',
    label: 'FC-210',
    image: productAsset('fc-210/fc-210-card.jpg'),
    title: {
      fa: 'فریزر صندوقی هایسنس مدل FC-210',
      en: 'Hisense Chest Freezer FC-210',
    },
  },
] satisfies readonly RefrigeratorProduct[];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const routeTranslations = await getTranslations('Routes.refrigerator');
  const languageAlternates = getLanguageAlternates('/refrigerator');
  const ogImage = HERO_BANNERS.desktop;
  const ogImageUrl =
    typeof ogImage === 'string' && ogImage.length > 0
      ? ogImage.startsWith('http')
        ? ogImage
        : `${SITE_URL}${ogImage}`
      : undefined;
  const metaDescription = buildCategoryMetaDescription(locale, 'refrigerator');

  return {
    title: buildCategoryMetaTitle(locale, routeTranslations('title')),
    description: metaDescription,
    openGraph: {
      title: routeTranslations('title'),
      description: metaDescription,
      url: `/${locale}/refrigerator`,
      type: 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: routeTranslations('title'),
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    alternates: {
      canonical: `/${locale}/refrigerator`,
      languages: languageAlternates,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function RefrigeratorPage() {
  const locale = await getLocale();
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  const routeTranslations = await getTranslations('Routes.refrigerator');
  const detailsLabel = (await getTranslations('TvHisensePage'))('actions.details');
  const breadcrumbItems = createBreadcrumbItems(resolvedLocale, {
    label: routeTranslations('title'),
    href: `/${resolvedLocale}/refrigerator`,
  });
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: routeTranslations('title'),
    description: routeTranslations('description'),
    url: `${SITE_URL}/${resolvedLocale}/refrigerator`,
    inLanguage: getLocaleLanguage(resolvedLocale),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: REFRIGERATOR_PRODUCTS.map((product, index) => {
        const title =
          typeof product.title === 'object'
            ? (product.title?.[resolvedLocale] ?? product.label)
            : (product.title ?? product.label);

        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/${resolvedLocale}/refrigerator/${product.id}`,
          item: {
            '@type': 'Thing',
            name: title,
            identifier: product.label,
            image: toAbsoluteUrl(product.image),
            url: `${SITE_URL}/${resolvedLocale}/refrigerator/${product.id}`,
          },
        };
      }),
    },
  };
  const officialLinks =
    locale === 'fa'
      ? {
          eyebrow: 'مسیرهای رسمی',
          title: 'لینک‌های رسمی هایسنس ایران',
          items: [
            {
              href: `/${locale}`,
              label: 'صفحه اصلی هایسنس ایران',
              description: 'معرفی رسمی برند و دسته‌بندی اصلی محصولات هایسنس در ایران.',
            },
            {
              href: `/${locale}/about`,
              label: 'درباره نمایندگی رسمی',
              description: 'اطلاعات زرین نمای کاسپین و شبکه فروش و خدمات رسمی برند.',
            },
            {
              href: `/${locale}/contact-us`,
              label: 'تماس و مشاوره خرید',
              description: 'دریافت مشاوره، استعلام و ارتباط با دفتر مرکزی هایسنس ایران.',
            },
            {
              href: `/${locale}/warranty-and-guarantee`,
              label: 'گارانتی یخچال و خدمات',
              description: 'شرایط خدمات پس از فروش و گارانتی رسمی محصولات هایسنس.',
            },
          ],
        }
      : {
          eyebrow: 'Official paths',
          title: 'Official Hisense Iran links',
          items: [
            {
              href: `/${locale}`,
              label: 'Hisense Iran homepage',
              description:
                'Primary brand page for categories, products, and official company signals.',
            },
            {
              href: `/${locale}/about`,
              label: 'About the official representative',
              description:
                'Learn about Zarrin Namaye Caspian and the official distribution network.',
            },
            {
              href: `/${locale}/contact-us`,
              label: 'Contact and purchase advice',
              description: 'Reach the official team for inquiries, support, and purchase guidance.',
            },
            {
              href: `/${locale}/warranty-and-guarantee`,
              label: 'Warranty and service',
              description: 'Review official after-sales service and warranty information.',
            },
          ],
        };

  return (
    <div className="pb-16 space-y-12 lg:space-y-16 lg:pb-24">
      <JsonLd data={collectionSchema} />
      <PageBreadcrumbs items={breadcrumbItems} locale={resolvedLocale} className="pt-5 sm:pt-6" />
      <div className="-mx-4 sm:-mx-6 lg:-mx-10 max-w-360 3xl:mx-auto">
        <div className="relative w-full overflow-hidden rounded-3xl shadow-(--panel-shadow)">
          <div className="relative w-full aspect-16/7">
            <Image
              src={HERO_BANNERS.desktop}
              alt={routeTranslations('title')}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="hidden object-cover md:block"
            />
            <Image
              src={HERO_BANNERS.mobile}
              alt={routeTranslations('title')}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover md:hidden"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 mx-auto max-w-480 sm:px-6 lg:px-10">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-2xl font-bold text-(--default-black-font) sm:text-3xl">
            {routeTranslations('title')}
          </h1>
          <p className="mt-3 text-base text-(--text-muted-color) sm:text-lg">
            {routeTranslations('description')}
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {REFRIGERATOR_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/refrigerator/${product.id}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-(--panel-shadow) transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--overlay-color) 55%,transparent)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
            >
              <div className="relative w-full overflow-hidden">
                <div className="relative aspect-4/3 w-full bg-(--surface-color)">
                  <Image
                    src={product.image}
                    alt={product.label}
                    fill
                    className="object-contain transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-(--overlay-color) via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="flex justify-center pb-5">
                    <div className="relative inline-flex">
                      <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--default-black-font) px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition duration-200 peer-hover:opacity-100 peer-focus-visible:opacity-100">
                        {detailsLabel}
                      </span>
                      <span
                        className="peer inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-(--default-black-font) shadow-sm ring-1 ring-(--border-color) transition duration-200 hover:bg-(--brand-color) hover:text-white hover:ring-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                        aria-label={detailsLabel}
                      >
                        <Visibility fontSize="small" className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{detailsLabel}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-1.5 p-4 sm:gap-2 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--text-subtle-color)">
                  {product.label}
                </p>
                <h3 className="text-base font-bold text-(--default-black-font) sm:text-xl">
                  {typeof product.title === 'object'
                    ? (product.title?.[locale as keyof ProductTitle] ?? product.label)
                    : (product.title ?? product.label)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CategorySeoSection
        content={CATEGORY_SEO_CONTENT.refrigerator[resolvedLocale]}
        locale={resolvedLocale}
      />

      <OfficialLinksSection
        locale={locale}
        eyebrow={officialLinks.eyebrow}
        title={officialLinks.title}
        items={officialLinks.items}
      />
    </div>
  );
}
