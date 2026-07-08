import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import HeroBanner from '@/components/hero/HeroBanner';
import CategorySpotlights from '@/components/home/CategorySpotlights';
import type { SpotlightCard } from '@/components/home/CategorySpotlights';
import JsonLd from '@/components/seo/JsonLd';
import { mediaUrl } from '@/lib/mediaUrl';
import { getLanguageAlternates, getLocaleLanguage, SITE_URL, toAbsoluteUrl } from '@/lib/seo/site';

// Locale-aware homepage renders the hero carousel and localized category spotlights.

const bannerAsset = (path: string) => mediaUrl(`/banner/${path}`);

type HomepageLocale = 'fa' | 'en';

const HOME_SEO_CONTENT: Record<
  HomepageLocale,
  {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    trustSignals: Array<{ value: string; label: string }>;
    quickLinks: Array<{ href: string; label: string }>;
  }
> = {
  fa: {
    title: "زرین نمای کاسپین | بازرگانی لوازم خانگی هایسنس و برند تلویزیون دیکد D'code",
    description:
      "زرین نمای کاسپین، گروه بازرگانی وارد‌کننده محصولات هایسنس در ایران و صاحب‌ امتیاز برند تلویزیون دیکد D'code؛ خانه برندهای لوازم خانگی و صوتی-تصویری با خدمات سراسری.",
    eyebrow: 'گروه زرین نمای کاسپین',
    heading: "زرین نمای کاسپین؛ خانه برندهای هایسنس و دیکد D'code",
    paragraphs: [
      'شرکت زرین نمای کاسپین یک مجموعه بازرگانی در حوزه لوازم خانگی و محصولات صوتی-تصویری است که مسئولیت واردات، عرضه و پشتیبانی محصولات هایسنس در ایران را بر عهده دارد.',
      "در کنار همکاری با هایسنس، برند اختصاصی تلویزیون دیکد (D'code) نیز توسط زرین نمای کاسپین معرفی شده است؛ خط تولید تلویزیون‌های هوشمند LED 4K مدل R6D با طراحی مدرن در سه سایز ۵۵، ۶۵ و ۷۵ اینچ.",
      "این صفحه دروازه ورود به دنیای برندهای زرین نمای کاسپین است؛ از محصولات و خدمات هایسنس ایران تا تلویزیون‌های اختصاصی دیکد D'code و مسیرهای رسمی ارتباط با ما.",
    ],
    trustSignals: [
      { value: "دیکد D'code", label: 'برند اختصاصی تلویزیون‌های هوشمند LED 4K' },
      { value: 'هایسنس', label: 'واردات و پشتیبانی رسمی محصولات هایسنس در ایران' },
      { value: 'خدمات سراسری', label: 'شبکه فروش و خدمات پس از فروش در سراسر کشور' },
    ],
    quickLinks: [
      { href: '/dcode', label: "تلویزیون‌های دیکد D'code" },
      { href: '/about', label: 'درباره زرین نمای کاسپین' },
      { href: '/contact-us', label: 'تماس با ما' },
      { href: '/warranty-and-guarantee', label: 'گارانتی و خدمات' },
      { href: '/hisense-repair', label: 'خدمات پس از فروش هایسنس' },
    ],
  },
  en: {
    title: "Zarrin Namaye Caspian | Hisense Home Appliances & D'code TVs",
    description:
      "Zarrin Namaye Caspian imports and supports Hisense products in Iran and owns the D'code TV brand — the home of appliance and electronics brands with nationwide after-sales service.",
    eyebrow: 'Zarrin Namaye Caspian Group',
    heading: "Zarrin Namaye Caspian — Home of Hisense & D'code",
    paragraphs: [
      'Zarrin Namaye Caspian is a trading group in the home-appliance and consumer-electronics sector, responsible for importing, distributing, and supporting Hisense products across Iran.',
      "Alongside its Hisense partnership, the company runs its own television brand, D'code — the R6D line of 4K UHD Android smart LED TVs in 55, 65, and 75 inches, with a clean, modern design.",
      "This page is the gateway to the Zarrin Namaye Caspian brands: from Hisense Iran's products and support to the exclusive D'code TV range and our official contact channels.",
    ],
    trustSignals: [
      { value: "D'code", label: 'Our own brand of 4K smart LED televisions' },
      { value: 'Hisense', label: 'Official import and support of Hisense in Iran' },
      { value: 'Nationwide', label: 'Sales and after-sales service across the country' },
    ],
    quickLinks: [
      { href: '/dcode', label: "D'code televisions" },
      { href: '/about', label: 'About Zarrin Namaye Caspian' },
      { href: '/contact-us', label: 'Contact us' },
      { href: '/warranty-and-guarantee', label: 'Warranty and service' },
      { href: '/hisense-repair', label: 'Hisense after-sales service' },
    ],
  },
};

// Locale-aware homepage renders the hero carousel and localized category spotlights.

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
  const seoContent = HOME_SEO_CONTENT[resolvedLocale];
  const canonical = `/${resolvedLocale}`;
  const ogImage = toAbsoluteUrl(bannerAsset('Fix-Banner-07.jpg'));

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
  const seoContent = HOME_SEO_CONTENT[resolvedLocale];
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
    </>
  );
}
