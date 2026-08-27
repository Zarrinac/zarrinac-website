import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import type { Locale } from '@/i18n/routing';
import { mediaUrl } from '@/lib/mediaUrl';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';
import { buildLocalBusinessJsonLd } from '@/lib/seo/localBusiness';
import { buildSupportMetaDescription } from '@/lib/seo/productMeta';

const HERO_IMAGE = mediaUrl('/contact-us/contactUs-support-hero.jpg');
const SUPPORT_IMAGE = mediaUrl('/contact-us/contactUs-box1.jpg');

type IconType = typeof LocalPhoneOutlinedIcon;

type ContactAction = {
  label: string;
  href: string;
  external?: boolean;
};

type ContactChannel = {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  external?: boolean;
};

type ContactGroup = {
  title: string;
  subtitle: string;
  channels: ContactChannel[];
};

type InfoCard = {
  title: string;
  value: string;
  href?: string;
  icon: IconType;
  external?: boolean;
  wide?: boolean;
};

type ContactContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ContactAction[];
  };
  highlight: {
    title: string;
    description: string;
    topics: string[];
    imageAlt: string;
  };
  groups: ContactGroup[];
  infoCards: InfoCard[];
  map: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    query: string;
  };
};

const CONTACT_CONTENT: Record<Locale, ContactContent> = {
  fa: {
    hero: {
      eyebrow: 'نماینده رسمی هایسنس در ایران',
      title: 'ارتباط با صنایع زرین نمای کاسپین',
      description:
        'برای دریافت مشاوره خرید، پیگیری سفارش، پشتیبانی محصولات Hisense و همچنین برقراری ارتباط با بخش‌های مختلف مجموعه صنایع زرین نمای کاسپین، از طریق اطلاعات تماس زیر با ما در ارتباط باشید. زرین نمای کاسپین، تنها نماینده رسمی هایسنس در ایران، آماده پاسخگویی به مشتریان و نمایندگان فروش و خدمات در سراسر کشور است.',
      actions: [
        { label: 'تماس فوری با پشتیبانی', href: 'tel:02172133' },
        {
          label: 'واتساپ امور مشتریان',
          href: 'https://wa.me/989217381016',
          external: true,
        },
      ],
    },
    highlight: {
      title: 'پشتیبانی سریع و رسمی',
      description:
        'برای مشاوره خرید، پیگیری سفارش و خدمات پس از فروش، از مسیرهای رسمی زرین نمای کاسپین استفاده کنید.',
      topics: ['مشاوره خرید', 'پیگیری سفارش', 'پشتیبانی Hisense', 'شبکه نمایندگان'],
      imageAlt: 'پشتیبانی رسمی هایسنس ایران',
    },
    groups: [
      {
        title: 'امور مشتریان و نمایندگان',
        subtitle: 'ارتباط با امور مشتریان و نمایندگان',
        channels: [
          {
            label: 'تماس تلفنی',
            value: '021 72133',
            href: 'tel:02172133',
            icon: LocalPhoneOutlinedIcon,
          },
          {
            label: 'واتساپ',
            value: '0921 738 1016',
            href: 'https://wa.me/989217381016',
            icon: WhatsAppIcon,
            external: true,
          },
          {
            label: 'تلگرام',
            value: '0921 738 1016',
            href: 'https://t.me/+989217381016',
            icon: TelegramIcon,
            external: true,
          },
        ],
      },
      {
        title: 'بخش مالی و فروش',
        subtitle: 'ارتباط با بخش مالی و فروش',
        channels: [
          {
            label: 'تماس تلفنی',
            value: '021 72488',
            href: 'tel:02172488',
            icon: LocalPhoneOutlinedIcon,
          },
          {
            label: 'واتساپ',
            value: '0921 639 0779',
            href: 'https://wa.me/989216390779',
            icon: WhatsAppIcon,
            external: true,
          },
          {
            label: 'تلگرام',
            value: '0921 639 0779',
            href: 'https://t.me/+989216390779',
            icon: TelegramIcon,
            external: true,
          },
        ],
      },
    ],
    infoCards: [
      {
        title: 'اینستاگرام',
        value: '@zarrin.nama.caspian',
        href: 'https://instagram.com/zarrin.nama.caspian',
        icon: InstagramIcon,
        external: true,
      },
      {
        title: 'ایمیل رسمی',
        value: 'info@zarrinac.com',
        href: 'mailto:info@zarrinac.com',
        icon: EmailOutlinedIcon,
      },
      {
        title: 'آدرس دفتر مرکزی',
        value: 'تهران، میدان کتابی (احمدی روشن)، خ ساسانی پور، بن بست کاملیا، پلاک 6',
        icon: LocationOnOutlinedIcon,
        wide: true,
      },
    ],
    map: {
      eyebrow: 'نقشه دفتر مرکزی',
      title: 'موقعیت دفتر مرکزی',
      description: 'برای مسیریابی و مراجعه حضوری، موقعیت دفتر مرکزی را روی نقشه مشاهده کنید.',
      cta: 'مشاهده مسیر روی نقشه',
      query: 'Hisense Tehran Ketabi Square Sasanipour Kameliya',
    },
  },
  en: {
    hero: {
      eyebrow: 'Official Hisense Representative in Iran',
      title: 'Contact Zarrin Namaye Caspian',
      description:
        'For purchase advice, order follow-ups, Hisense support, or to reach different departments of Zarrin Namaye Caspian Industries, use the contact details below. We are ready to support customers, sales partners, and service teams nationwide.',
      actions: [
        { label: 'Call customer support', href: 'tel:02172133' },
        {
          label: 'WhatsApp customer care',
          href: 'https://wa.me/989217381016',
          external: true,
        },
      ],
    },
    highlight: {
      title: 'Official support, fast response',
      description:
        'Get purchase consulting, order tracking, and after-sales support through our official channels.',
      topics: ['Purchase advice', 'Order tracking', 'Hisense support', 'Dealer network'],
      imageAlt: 'Hisense Iran support team',
    },
    groups: [
      {
        title: 'Customer & Partner Relations',
        subtitle: 'Customer and partner relations',
        channels: [
          {
            label: 'Phone',
            value: '021 72133',
            href: 'tel:02172133',
            icon: LocalPhoneOutlinedIcon,
          },
          {
            label: 'WhatsApp',
            value: '+98 921 738 1016',
            href: 'https://wa.me/989217381016',
            icon: WhatsAppIcon,
            external: true,
          },
          {
            label: 'Telegram',
            value: '+98 921 738 1016',
            href: 'https://t.me/+989217381016',
            icon: TelegramIcon,
            external: true,
          },
        ],
      },
      {
        title: 'Finance & Sales',
        subtitle: 'Finance and sales team',
        channels: [
          {
            label: 'Phone',
            value: '021 72488',
            href: 'tel:02172488',
            icon: LocalPhoneOutlinedIcon,
          },
          {
            label: 'WhatsApp',
            value: '+98 921 639 0779',
            href: 'https://wa.me/989216390779',
            icon: WhatsAppIcon,
            external: true,
          },
          {
            label: 'Telegram',
            value: '+98 921 639 0779',
            href: 'https://t.me/+989216390779',
            icon: TelegramIcon,
            external: true,
          },
        ],
      },
    ],
    infoCards: [
      {
        title: 'Instagram',
        value: '@zarrin.nama.caspian',
        href: 'https://instagram.com/zarrin.nama.caspian',
        icon: InstagramIcon,
        external: true,
      },
      {
        title: 'Official email',
        value: 'info@zarrinac.com',
        href: 'mailto:info@zarrinac.com',
        icon: EmailOutlinedIcon,
      },
      {
        title: 'Head office address',
        value:
          'No. 6, Kameliya Dead End, Sasanipour St., Ketabi Square (Ahmadi Roshan Sq.), Tehran, Iran',
        icon: LocationOnOutlinedIcon,
        wide: true,
      },
    ],
    map: {
      eyebrow: 'Head office map',
      title: 'Head office location',
      description: 'Use the map for directions to the Tehran headquarters.',
      cta: 'Open in Google Maps',
      query: 'Hisense Tehran Ketabi Square Sasanipour Kameliya',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const routeTranslations = await getTranslations('Routes.contact');
  const localizedPath = `/${locale}/contact-us`;
  const languageAlternates = getLanguageAlternates('/contact-us');
  const ogImageUrl = HERO_IMAGE.startsWith('http') ? HERO_IMAGE : `${SITE_URL}${HERO_IMAGE}`;
  const metaDescription = buildSupportMetaDescription(locale, 'contact');

  return {
    title: routeTranslations('title'),
    description: metaDescription,
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: routeTranslations('title'),
      description: metaDescription,
      url: `${SITE_URL}${localizedPath}`,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: routeTranslations('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: routeTranslations('title'),
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ContactUsPage() {
  const locale = await getLocale();
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  const routeTranslations = await getTranslations('Routes.contact');
  const content = CONTACT_CONTENT[resolvedLocale];
  const breadcrumbItems = createBreadcrumbItems(resolvedLocale, {
    label: routeTranslations('title'),
    href: `/${resolvedLocale}/contact-us`,
  });
  const isRTL = resolvedLocale === 'fa';
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(content.map.query)}&output=embed`;
  const mapLink = `https://www.google.com/maps?q=${encodeURIComponent(content.map.query)}`;
  const alignClass = isRTL ? 'text-right' : 'text-left';
  const officialLinks =
    resolvedLocale === 'fa'
      ? {
          eyebrow: 'صفحات رسمی',
          title: 'صفحات اصلی هایسنس ایران',
          items: [
            {
              href: `/${resolvedLocale}`,
              label: 'صفحه اصلی هایسنس ایران',
              description: 'معرفی رسمی برند، محصولات و مسیرهای اصلی ارتباط با زرین نمای کاسپین.',
            },
            {
              href: `/${resolvedLocale}/about`,
              label: 'درباره زرین نمای کاسپین',
              description: 'آشنایی با نمایندگی رسمی، شبکه فروش و تاریخچه فعالیت مجموعه در ایران.',
            },
            {
              href: `/${resolvedLocale}/warranty-and-guarantee`,
              label: 'گارانتی و خدمات',
              description: 'اطلاعات گارانتی رسمی، شرایط خدمات و مسیرهای پشتیبانی محصولات هایسنس.',
            },
            {
              href: `/${resolvedLocale}/hisense-repair`,
              label: 'خدمات تعمیر و پشتیبانی',
              description: 'ثبت درخواست تعمیر، سرویس و پشتیبانی رسمی محصولات هایسنس.',
            },
            {
              href: `/${resolvedLocale}/complaint`,
              label: 'فرم شکایت',
              description: 'ثبت شکایت و پیگیری مسائل مرتبط با خدمات، گارانتی یا کیفیت محصول.',
            },
          ],
        }
      : {
          eyebrow: 'Official pages',
          title: 'Primary Hisense Iran pages',
          items: [
            {
              href: `/${resolvedLocale}`,
              label: 'Hisense Iran homepage',
              description:
                'Primary brand page for products, company signals, and official channels.',
            },
            {
              href: `/${resolvedLocale}/about`,
              label: 'About Zarrin Namaye Caspian',
              description:
                'Learn about the official representative, distribution network, and brand story.',
            },
            {
              href: `/${resolvedLocale}/warranty-and-guarantee`,
              label: 'Warranty and service',
              description:
                'Official warranty information, service conditions, and support pathways.',
            },
            {
              href: `/${resolvedLocale}/hisense-repair`,
              label: 'Repair and support',
              description: 'Request official repair, service, and product support.',
            },
            {
              href: `/${resolvedLocale}/complaint`,
              label: 'Complaint form',
              description: 'Submit service, warranty, or product complaints for direct follow-up.',
            },
          ],
        };
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: content.hero.title,
    description: content.hero.description,
    url: `${SITE_URL}/${resolvedLocale}/contact-us`,
    inLanguage: getLocaleLanguage(resolvedLocale),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name:
        resolvedLocale === 'fa'
          ? 'شرکت صنایع زرین نمای کاسپین'
          : 'Zarrin Namaye Caspian Industries',
      url: SITE_URL,
      telephone: '+98-21-72133',
      email: 'info@zarrinac.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kameliya Dead end, Sasanipour St.',
        addressLocality: 'Tehran',
        addressRegion: 'Tehran',
        postalCode: '1994736431',
        addressCountry: 'IR',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: '+98-21-72133',
          areaServed: 'IR',
          availableLanguage: ['fa', 'en'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+98-21-72488',
          areaServed: 'IR',
          availableLanguage: ['fa', 'en'],
        },
      ],
    },
  };

  return (
    <div className="space-y-8 pb-12 pt-6 sm:space-y-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={contactPageSchema} />
      <JsonLd data={buildLocalBusinessJsonLd(resolvedLocale)} />
      <PageBreadcrumbs items={breadcrumbItems} locale={resolvedLocale} className="pt-0 sm:pt-0" />
      <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-10">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE} alt="" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/40 to-(--brand-color)/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,179,172,0.35),transparent_55%)]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">
            {content.hero.eyebrow}
          </p>
          <div className={`space-y-5 ${alignClass}`}>
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{content.hero.title}</h1>
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              {content.hero.description}
            </p>
          </div>
          <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {content.hero.actions.map((action, index) => {
              const isPrimary = index === 0;
              const linkProps = action.external
                ? { target: '_blank', rel: 'noreferrer' }
                : undefined;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  {...linkProps}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isPrimary
                      ? 'bg-white text-(--brand-color) hover:bg-white/90'
                      : 'border border-white/60 text-white hover:border-white'
                  }`}
                >
                  {action.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            {content.groups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-5 shadow-lg sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--text-subtle-color)">
                  {group.subtitle}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-(--default-black-font)">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.channels.map((channel) => {
                    const linkProps = channel.external
                      ? { target: '_blank', rel: 'noreferrer' }
                      : undefined;
                    const Icon = channel.icon;
                    return (
                      <li
                        key={channel.label}
                        className="flex items-start gap-3 rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-3 transition hover:-translate-y-0.5 hover:border-(--brand-color) sm:p-4"
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-(--brand-color) shadow">
                          <Icon fontSize="small" />
                        </span>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-(--default-black-font)">
                            {channel.label}
                          </p>
                          <a
                            href={channel.href}
                            {...linkProps}
                            dir="ltr"
                            className="text-base font-semibold text-(--text-muted-color) transition hover:text-(--brand-color)"
                          >
                            {channel.value}
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-lg">
            <div className="relative h-48 w-full sm:h-60">
              <Image
                src={SUPPORT_IMAGE}
                alt={content.highlight.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-(--overlay-color) via-transparent to-transparent" />
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              <h3 className="text-xl font-bold text-(--default-black-font)">
                {content.highlight.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--text-muted-color)">
                {content.highlight.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {content.highlight.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-(--border-color) bg-(--surface-muted-color) px-3 py-1 text-xs font-semibold text-(--default-black-font)"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/${resolvedLocale}`}
                  className="text-sm font-semibold text-(--brand-color) transition hover:text-(--brand-color-dark)"
                >
                  {resolvedLocale === 'fa' ? 'صفحه اصلی هایسنس ایران' : 'Hisense Iran homepage'}
                </Link>
                <Link
                  href={`/${resolvedLocale}/about`}
                  className="text-sm font-semibold text-(--brand-color) transition hover:text-(--brand-color-dark)"
                >
                  {resolvedLocale === 'fa' ? 'درباره زرین نمای کاسپین' : 'About the company'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OfficialLinksSection
        locale={resolvedLocale}
        eyebrow={officialLinks.eyebrow}
        title={officialLinks.title}
        items={officialLinks.items}
      />

      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.infoCards.map((card) => {
            const Icon = card.icon;
            const linkProps = card.external ? { target: '_blank', rel: 'noreferrer' } : undefined;
            return (
              <div
                key={card.title}
                className={`rounded-3xl border border-(--border-color) bg-linear-to-br from-(--surface-color) via-(--surface-color) to-(--surface-muted-color) p-5 shadow-lg sm:p-6 ${
                  card.wide ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-(--brand-color) shadow">
                    <Icon fontSize="small" />
                  </span>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--text-subtle-color)">
                      {card.title}
                    </p>
                    {card.href ? (
                      <a
                        href={card.href}
                        {...linkProps}
                        dir="ltr"
                        className="text-base font-semibold text-(--default-black-font) transition hover:text-(--brand-color)"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-sm leading-relaxed text-(--text-muted-color)">
                        {card.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-xl lg:grid-cols-3">
          <div className="flex flex-col gap-3 p-5 lg:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--text-subtle-color)">
              {content.map.eyebrow}
            </p>
            <h2 className="text-2xl font-bold text-(--default-black-font)">{content.map.title}</h2>
            <p className="text-sm leading-relaxed text-(--text-muted-color)">
              {content.map.description}
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-(--border-color) px-4 py-2 text-sm font-semibold text-(--text-muted-color) transition hover:border-(--brand-color) hover:text-(--brand-color)"
            >
              {content.map.cta}
            </a>
          </div>
          <div className="relative min-h-65 lg:col-span-2">
            <iframe
              title={content.map.title}
              src={mapSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
