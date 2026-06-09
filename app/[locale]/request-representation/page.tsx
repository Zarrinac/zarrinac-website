import type { Metadata } from 'next';
import Link from 'next/link';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getLocale, getTranslations } from 'next-intl/server';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

type IconType = typeof StorefrontOutlinedIcon;

type RepresentationSection = {
  id: string;
  title: string;
  summary: string;
  description: string;
  whatsappLabel: string;
  whatsappNumber: string;
  whatsappHref: string;
  requirement: string;
  responseTime: string;
  icon: IconType;
  openByDefault?: boolean;
};

type RepresentationContent = {
  introTitle: string;
  introParagraphs: string[];
  sectionsTitle: string;
  highlights: Array<{
    title: string;
    description: string;
    icon: IconType;
  }>;
  representationSections: RepresentationSection[];
  cta: {
    title: string;
    description: string;
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
  officialLinks: {
    eyebrow: string;
    title: string;
    items: Array<{
      href: string;
      label: string;
      description: string;
    }>;
  };
};

const REPRESENTATION_CONTENT: Record<Locale, RepresentationContent> = {
  fa: {
    introTitle: 'عضوی از خانواده بزرگ نمایندگان زرین نمای کاسپین باشید',
    introParagraphs: [
      'با دریافت نمایندگی رسمی صنایع زرین نمای کاسپین، از مزایای همکاری با شبکه فروش و خدمات محصولات Hisense بهره‌مند شوید. نمایندگان رسمی ما در سراسر ایران از پشتیبانی کامل، آموزش‌های تخصصی و دسترسی به محصولات باکیفیت برخوردار هستند.',
      'برای شروع همکاری، بخش موردنظر خود را انتخاب کنید و اطلاعات اولیه را از مسیر اعلام‌شده ارسال کنید. تیم ما پس از بررسی اولیه، مراحل بعدی و شرایط همکاری را به‌صورت شفاف با شما هماهنگ می‌کند.',
    ],
    sectionsTitle: 'انتخاب نوع نمایندگی',
    highlights: [
      {
        title: 'شبکه رسمی فروش',
        description: 'همکاری مستقیم با نماینده رسمی Hisense در ایران برای توسعه فروش منطقه‌ای.',
        icon: StorefrontOutlinedIcon,
      },
      {
        title: 'خدمات پس از فروش',
        description: 'پیوستن به شبکه نصب، تعمیر و پشتیبانی محصولات هایسنس در سراسر کشور.',
        icon: HandymanOutlinedIcon,
      },
      {
        title: 'فرآیند روشن',
        description: 'دریافت اطلاعات اولیه از واتساپ و پیگیری توسط کارشناسان مجموعه.',
        icon: VerifiedOutlinedIcon,
      },
    ],
    representationSections: [
      {
        id: 'sales',
        title: 'درخواست نمایندگی فروش',
        summary: 'برای دریافت نمایندگی فروش محصولات هایسنس اقدام کنید.',
        description:
          'جهت دریافت نمایندگی فروش شرکت صنایع زرین نمای کاسپین و دریافت اطلاعات اولیه، از طریق واتساپ با بخش فروش در ارتباط باشید.',
        whatsappLabel: 'واتساپ فروش',
        whatsappNumber: '0921 639 0779',
        whatsappHref: 'https://wa.me/989216390779',
        requirement: 'معرفی شهر، حوزه فعالیت و سوابق فروش خود را ارسال کنید.',
        responseTime: 'شنبه تا چهارشنبه از ساعت 9 تا 15 پاسخگوی شما خواهیم بود.',
        icon: StorefrontOutlinedIcon,
        openByDefault: true,
      },
      {
        id: 'service',
        title: 'درخواست نمایندگی نصب و خدمات پس از فروش',
        summary: 'برای نمایندگی خدمات، نصب و پشتیبانی محصولات هایسنس درخواست ارسال کنید.',
        description:
          'جهت دریافت نمایندگی خدمات شرکت صنایع زرین نمای کاسپین و دریافت اطلاعات اولیه، مدارک اولیه خود را از طریق واتساپ خدمات ارسال کنید.',
        whatsappLabel: 'واتساپ خدمات',
        whatsappNumber: '0921 738 1016',
        whatsappHref: 'https://wa.me/989217381016',
        requirement:
          'جواز کسب یا مدارک فعالیت خدماتی خود را ارسال کنید و منتظر تماس کارشناسان ما باشید.',
        responseTime: 'درخواست‌ها پس از بررسی اولیه توسط تیم خدمات پیگیری می‌شوند.',
        icon: HandymanOutlinedIcon,
      },
    ],
    cta: {
      title: 'برای شروع همکاری آماده‌اید؟',
      description:
        'اگر درباره شرایط همکاری یا انتخاب نوع نمایندگی سوال دارید، با امور مشتریان و نمایندگان تماس بگیرید.',
      primary: {
        label: 'تماس با امور نمایندگان',
        href: 'tel:02172133',
      },
      secondary: {
        label: 'مشاهده اطلاعات تماس',
        href: '/contact-us',
      },
    },
    officialLinks: {
      eyebrow: 'مسیرهای مرتبط',
      title: 'لینک‌های رسمی همکاری و پشتیبانی',
      items: [
        {
          href: '/contact-us',
          label: 'تماس با هایسنس ایران',
          description: 'شماره‌ها، آدرس دفتر مرکزی و مسیرهای ارتباط با بخش فروش و خدمات.',
        },
        {
          href: '/portal',
          label: 'پرتال نمایندگان خدمات',
          description: 'مسیر دسترسی نمایندگان خدمات پس از فروش مجموعه.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'اطلاعات شبکه خدمات رسمی، نصب و تعمیر محصولات Hisense.',
        },
      ],
    },
  },
  en: {
    introTitle: 'Join Zarrin Namaye Caspian official partner network',
    introParagraphs: [
      'Apply to become an official Zarrin Namaye Caspian representative and work with the Hisense sales and service network in Iran. Our authorized partners receive operational support, product access, and guidance from the official representative team.',
      'Choose the relevant representation type and send your initial information through the listed WhatsApp channel. Our team will review the request and coordinate the next steps with you.',
    ],
    sectionsTitle: 'Choose a representation type',
    highlights: [
      {
        title: 'Official sales network',
        description:
          'Work directly with the official Hisense representative in Iran for regional sales.',
        icon: StorefrontOutlinedIcon,
      },
      {
        title: 'After-sales service',
        description: 'Join the installation, repair, and support network for Hisense products.',
        icon: HandymanOutlinedIcon,
      },
      {
        title: 'Clear process',
        description: 'Submit initial details through WhatsApp and receive follow-up from the team.',
        icon: VerifiedOutlinedIcon,
      },
    ],
    representationSections: [
      {
        id: 'sales',
        title: 'Sales Representative Request',
        summary: 'Apply for Hisense product sales representation.',
        description:
          'To request sales representation for Zarrin Namaye Caspian Industries and receive initial information, contact the sales team on WhatsApp.',
        whatsappLabel: 'Sales WhatsApp',
        whatsappNumber: '+98 921 639 0779',
        whatsappHref: 'https://wa.me/989216390779',
        requirement: 'Send your city, business area, and sales background.',
        responseTime: 'We respond Saturday to Wednesday, 9:00 to 15:00.',
        icon: StorefrontOutlinedIcon,
        openByDefault: true,
      },
      {
        id: 'service',
        title: 'After-Sales Service Representative Request',
        summary: 'Apply for installation, service, and support representation.',
        description:
          'To request service representation for Zarrin Namaye Caspian Industries and receive initial information, send your documents to the service WhatsApp line.',
        whatsappLabel: 'Service WhatsApp',
        whatsappNumber: '+98 921 738 1016',
        whatsappHref: 'https://wa.me/989217381016',
        requirement:
          'Send your business license or service activity documents and wait for our experts to contact you.',
        responseTime: 'Requests are reviewed and followed up by the service team.',
        icon: HandymanOutlinedIcon,
      },
    ],
    cta: {
      title: 'Ready to start a partnership?',
      description:
        'For questions about requirements or the right representation type, contact customer and partner relations.',
      primary: {
        label: 'Call partner relations',
        href: 'tel:02172133',
      },
      secondary: {
        label: 'Contact details',
        href: '/contact-us',
      },
    },
    officialLinks: {
      eyebrow: 'Related paths',
      title: 'Official partnership and support links',
      items: [
        {
          href: '/contact-us',
          label: 'Contact Hisense Iran',
          description:
            'Verified phone numbers, head office address, and sales or service channels.',
        },
        {
          href: '/portal',
          label: 'Service representative portal',
          description: 'Access route for authorized after-sales service representatives.',
        },
        {
          href: '/hisense-repair',
          label: 'Repair and support',
          description: 'Information about the official service, installation, and repair network.',
        },
      ],
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.requestRepresentation');
  const localizedPath = `/${locale}/request-representation`;
  const languageAlternates = getLanguageAlternates('/request-representation');

  return {
    title: routeTranslations('title'),
    description: routeTranslations('description'),
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: routeTranslations('title'),
      description: routeTranslations('description'),
      url: `${SITE_URL}${localizedPath}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: routeTranslations('title'),
      description: routeTranslations('description'),
    },
  };
}

export default async function RequestRepresentationPage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.requestRepresentation');
  const content = REPRESENTATION_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/request-representation`,
  });
  const isRTL = locale === 'fa';
  const resolveHref = (href: string) => (href.startsWith('/') ? `/${locale}${href}` : href);
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: routeTranslations('title'),
    description: routeTranslations('description'),
    url: `${SITE_URL}/${locale}/request-representation`,
    inLanguage: getLocaleLanguage(locale),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: locale === 'fa' ? 'شرکت صنایع زرین نمای کاسپین' : 'Zarrin Namaye Caspian Industries',
      url: SITE_URL,
      telephone: '+98-21-72133',
    },
  };

  return (
    <div className="space-y-10 pb-16 pt-6 sm:space-y-12 sm:pt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={pageSchema} />

      <RouteHero
        eyebrow={routeTranslations('eyebrow')}
        title={routeTranslations('title')}
        description={routeTranslations('description')}
        locale={locale}
        breadcrumbItems={breadcrumbItems}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-(--default-black-font) sm:text-3xl">
            {content.introTitle}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-(--text-muted-color) sm:text-base sm:leading-8">
            {content.introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-5 shadow-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color)">
                  <Icon fontSize="small" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-(--default-black-font)">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--text-muted-color)">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-5 text-center text-2xl font-bold text-(--default-black-font)">
          {content.sectionsTitle}
        </h2>
        <div className="overflow-hidden border border-(--border-color) bg-(--surface-color) shadow-sm">
          {content.representationSections.map((section) => {
            const Icon = section.icon;
            return (
              <details
                key={section.id}
                open={section.openByDefault}
                className="group border-b border-(--border-color) last:border-b-0 open:bg-(--surface-muted-color)"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold text-(--default-black-font) transition hover:bg-(--surface-muted-color) focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-(--brand-color) sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color) group-open:bg-(--brand-color) group-open:text-white">
                      <Icon fontSize="small" />
                    </span>
                    <span className="min-w-0">
                      <span className="block">{section.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-(--text-muted-color)">
                        {section.summary}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-xl font-semibold leading-none text-(--brand-color) before:content-['+'] group-open:before:content-['-']"
                  />
                </summary>
                <div className="border-t border-(--border-color) px-4 py-5 sm:px-5">
                  <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                    <div className="space-y-4 text-sm leading-7 text-(--text-muted-color)">
                      <p>{section.description}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                            <BadgeOutlinedIcon fontSize="small" />
                            {locale === 'fa' ? 'مدارک اولیه' : 'Initial details'}
                          </p>
                          <p className="mt-2 text-sm font-medium leading-6 text-(--default-black-font)">
                            {section.requirement}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                            <AccessTimeOutlinedIcon fontSize="small" />
                            {locale === 'fa' ? 'زمان پاسخگویی' : 'Response time'}
                          </p>
                          <p className="mt-2 text-sm font-medium leading-6 text-(--default-black-font)">
                            {section.responseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <a
                      href={section.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm transition hover:border-(--brand-color)"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white">
                        <WhatsAppIcon fontSize="small" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                          {section.whatsappLabel}
                        </span>
                        <span
                          className="mt-1 block text-lg font-bold text-(--default-black-font)"
                          dir="ltr"
                        >
                          {section.whatsappNumber}
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-(--brand-color) px-6 py-8 text-white shadow-lg sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <SupportAgentOutlinedIcon fontSize="small" />
              {locale === 'fa' ? 'امور نمایندگان' : 'Partner relations'}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{content.cta.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">{content.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={content.cta.primary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-(--brand-color) transition hover:bg-white/90"
            >
              <LocalPhoneOutlinedIcon fontSize="small" />
              {content.cta.primary.label}
            </a>
            <Link
              href={resolveHref(content.cta.secondary.href)}
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
            >
              {content.cta.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <OfficialLinksSection
        locale={locale}
        eyebrow={content.officialLinks.eyebrow}
        title={content.officialLinks.title}
        items={content.officialLinks.items.map((item) => ({
          ...item,
          href: resolveHref(item.href),
        }))}
      />
    </div>
  );
}
