import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import type { Locale } from '@/i18n/routing';
import JsonLd from '@/components/seo/JsonLd';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import { createBreadcrumbItems, getLanguageAlternates, SITE_URL } from '@/lib/seo/site';

type IconType = typeof LocalPhoneOutlinedIcon;

type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

type HeroCardItem = {
  label: string;
  value: string;
  href?: string;
  icon: IconType;
  external?: boolean;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: IconType;
};

type StepItem = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type RepairContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
    actions: HeroAction[];
    cardTitle: string;
    cardItems: HeroCardItem[];
  };
  features: {
    title: string;
    items: FeatureItem[];
  };
  devices: {
    title: string;
    description: string;
    items: string[];
  };
  steps: {
    title: string;
    items: StepItem[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  cta: {
    title: string;
    description: string;
    primary: HeroAction;
    secondary: HeroAction;
  };
};

const REPAIR_CONTENT: Record<Locale, RepairContent> = {
  fa: {
    hero: {
      eyebrow: 'خدمات رسمی تعمیر و نگهداری',
      title: 'خدمات تعمیر و پشتیبانی محصولات هایسنس',
      description:
        'اگر به دنبال تعمیرکار هایسنس برای تلویزیون، کولرگازی، یخچال یا ماشین لباسشویی هستید، تیم فنی زرین نمای کاسپین آماده پاسخگویی است. خدمات تعمیر و پشتیبانی محصولات Hisense با قطعات اصلی و تکنسین‌های آموزش‌دیده انجام می‌شود.',
      highlights: ['اعزام سریع تکنسین', 'پوشش سراسری', 'قطعات اصلی', 'گارانتی خدمات'],
      actions: [
        { label: 'تماس با مرکز خدمات', href: 'tel:02172133' },
        { label: 'واتساپ خدمات', href: 'https://wa.me/989217381016', external: true },
      ],
      cardTitle: 'راه‌های ارتباط برای خدمات و تعمیرات رسمی',
      cardItems: [
        {
          label: 'تماس تلفنی',
          value: '021 72133',
          href: 'tel:02172133',
          icon: LocalPhoneOutlinedIcon,
        },
        {
          label: 'واتساپ خدمات',
          value: '0921 738 1016',
          href: 'https://wa.me/989217381016',
          icon: WhatsAppIcon,
          external: true,
        },
        {
          label: 'ایمیل رسمی',
          value: 'info@zarrinac.com',
          href: 'mailto:info@zarrinac.com',
          icon: EmailOutlinedIcon,
        },
        {
          label: 'ساعات پاسخگویی',
          value: 'شنبه تا چهارشنبه 8:30 تا 16:00 | پنجشنبه 8:30 تا 13:00',
          icon: AccessTimeOutlinedIcon,
        },
        {
          label: 'دفتر مرکزی',
          value: 'تهران، میدان کتابی (احمدی روشن)، خ ساسانی پور، بن‌بست کاملیا، پلاک 6',
          icon: LocationOnOutlinedIcon,
        },
      ],
    },
    features: {
      title: 'چرا تعمیرکار رسمی هایسنس؟',
      items: [
        {
          title: 'تکنسین‌های آموزش‌دیده',
          description: 'تعمیرکار هایسنس با آموزش‌های تخصصی و استانداردهای رسمی.',
          icon: EngineeringOutlinedIcon,
        },
        {
          title: 'قطعات اصلی و تایید شده',
          description: 'استفاده از قطعات اورجینال و سازگار با محصولات Hisense.',
          icon: Inventory2OutlinedIcon,
        },
        {
          title: 'پشتیبانی رسمی پس از تعمیر',
          description: 'پیگیری کیفیت خدمات و ثبت سوابق تعمیر در شبکه رسمی.',
          icon: SupportAgentOutlinedIcon,
        },
        {
          title: 'گارانتی خدمات',
          description: 'شفافیت در هزینه‌ها و ارائه ضمانت برای خدمات انجام‌شده.',
          icon: VerifiedOutlinedIcon,
        },
      ],
    },
    devices: {
      title: 'چه دستگاه‌هایی را تعمیر می‌کنیم؟',
      description: 'پوشش خدمات برای محصولات اصلی Hisense در سراسر کشور.',
      items: [
        'تلویزیون و نمایشگر',
        'کولرگازی و سیستم‌های تهویه',
        'یخچال و فریزر',
        'ماشین لباسشویی',
      ],
    },
    steps: {
      title: 'مراحل دریافت خدمات تعمیر',
      items: [
        {
          title: 'ثبت درخواست',
          description: 'از طریق تماس یا واتساپ مشکل دستگاه را اعلام کنید.',
        },
        {
          title: 'هماهنگی زمان',
          description: 'کارشناسان زمان مناسب را برای مراجعه یا پیگیری مشخص می‌کنند.',
        },
        {
          title: 'اعزام تکنسین',
          description: 'تعمیرکار هایسنس با تجهیزات کامل به محل اعزام می‌شود.',
        },
        {
          title: 'ارائه گزارش و ضمانت',
          description: 'هزینه، قطعات مصرفی و ضمانت خدمات به‌صورت شفاف ارائه می‌شود.',
        },
      ],
    },
    faq: {
      title: 'سوالات پرتکرار',
      items: [
        {
          question: 'چطور درخواست تعمیرکار هایسنس ثبت کنم؟',
          answer: 'کافی است با شماره 021 72133 تماس بگیرید یا از واتساپ خدمات استفاده کنید.',
        },
        {
          question: 'آیا از قطعات اصلی استفاده می‌شود؟',
          answer: 'بله، تعمیرات با قطعات اصلی و تایید شده توسط نمایندگی رسمی انجام می‌شود.',
        },
        {
          question: 'هزینه تعمیر چگونه اعلام می‌شود؟',
          answer: 'پس از بررسی اولیه، هزینه به‌صورت شفاف اعلام و سپس تعمیر انجام می‌شود.',
        },
      ],
    },
    cta: {
      title: 'برای دریافت مشاوره یا ثبت درخواست خدمات رسمی آماده‌ایم',
      description:
        'اگر نیاز به تعمیر فوری یا هماهنگی سرویس دارید، همین حالا از راه‌های ارتباطی زیر اقدام کنید.',
      primary: { label: 'تماس با مرکز خدمات', href: 'tel:02172133' },
      secondary: {
        label: 'جزئیات تماس',
        href: '/contact-us',
      },
    },
  },
  en: {
    hero: {
      eyebrow: 'Official repair & maintenance service',
      title: 'Official Hisense Repair and Support',
      description:
        'If you need a trained Hisense repair technician for TVs, air conditioners, refrigerators, or washing machines, Zarrin Namaye Caspian is here to help. We provide official service for Hisense with genuine parts and certified technicians.',
      highlights: [
        'Fast technician dispatch',
        'Nationwide coverage',
        'Genuine parts',
        'Service warranty',
      ],
      actions: [
        { label: 'Call service center', href: 'tel:02172133' },
        { label: 'WhatsApp service', href: 'https://wa.me/989217381016', external: true },
      ],
      cardTitle: 'Contact the official service and repair team',
      cardItems: [
        {
          label: 'Phone',
          value: '021 72133',
          href: 'tel:02172133',
          icon: LocalPhoneOutlinedIcon,
        },
        {
          label: 'WhatsApp service',
          value: '+98 921 738 1016',
          href: 'https://wa.me/989217381016',
          icon: WhatsAppIcon,
          external: true,
        },
        {
          label: 'Official email',
          value: 'info@zarrinac.com',
          href: 'mailto:info@zarrinac.com',
          icon: EmailOutlinedIcon,
        },
        {
          label: 'Working hours',
          value: 'Sat - Wed 8:30 - 16:00 | Thu 8:30 - 13:00',
          icon: AccessTimeOutlinedIcon,
        },
        {
          label: 'Head office',
          value: 'No. 6, Kameliya Dead End, Sasanipour St., Ketabi Square, Tehran, Iran',
          icon: LocationOnOutlinedIcon,
        },
      ],
    },
    features: {
      title: 'Why choose official Hisense repair?',
      items: [
        {
          title: 'Certified technicians',
          description: 'Trained experts who understand Hisense hardware and diagnostics.',
          icon: EngineeringOutlinedIcon,
        },
        {
          title: 'Genuine parts',
          description: 'Original components for Hisense products.',
          icon: Inventory2OutlinedIcon,
        },
        {
          title: 'Post-service support',
          description: 'Service records and quality follow-up through the official network.',
          icon: SupportAgentOutlinedIcon,
        },
        {
          title: 'Service warranty',
          description: 'Transparent costs and warranty for completed repairs.',
          icon: VerifiedOutlinedIcon,
        },
      ],
    },
    devices: {
      title: 'Supported devices',
      description: 'Official service coverage for Hisense products nationwide.',
      items: [
        'Television & display',
        'Residential & commercial HVAC',
        'Refrigerator & freezer',
        'Washing machine',
      ],
    },
    steps: {
      title: 'How to get repair service',
      items: [
        {
          title: 'Submit request',
          description: 'Contact us via phone or WhatsApp and describe the issue.',
        },
        {
          title: 'Schedule visit',
          description: 'Our team coordinates the best time for service or follow-up.',
        },
        {
          title: 'Technician dispatch',
          description: 'A certified Hisense repair technician visits with proper tools.',
        },
        {
          title: 'Report & warranty',
          description: 'Transparent costs, used parts, and service warranty are provided.',
        },
      ],
    },
    faq: {
      title: 'Common questions',
      items: [
        {
          question: 'How do I request a Hisense repair technician?',
          answer: 'Call 021 72133 or message the WhatsApp service line.',
        },
        {
          question: 'Do you use genuine parts?',
          answer: 'Yes, all repairs use original parts approved by the official representative.',
        },
        {
          question: 'How are repair costs communicated?',
          answer: 'Costs are explained after initial diagnostics and before any repair starts.',
        },
      ],
    },
    cta: {
      title: 'Need official Hisense service or repair support?',
      description: 'Reach out now to schedule service or get expert guidance for your device.',
      primary: { label: 'Call service center', href: 'tel:02172133' },
      secondary: { label: 'Contact details', href: '/contact-us' },
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const routeTranslations = await getTranslations('Routes.hisenseRepair');
  const localizedPath = `/${locale}/hisense-repair`;
  const languageAlternates = getLanguageAlternates('/hisense-repair');

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

export default async function HisenseRepairPage() {
  const locale = await getLocale();
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  const routeTranslations = await getTranslations('Routes.hisenseRepair');
  const content = REPAIR_CONTENT[resolvedLocale];
  const breadcrumbItems = createBreadcrumbItems(resolvedLocale, {
    label: routeTranslations('title'),
    href: `/${resolvedLocale}/hisense-repair`,
  });
  const isRTL = resolvedLocale === 'fa';
  const resolveHref = (href: string) => (href.startsWith('/') ? `/${resolvedLocale}${href}` : href);
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.hero.title,
    description: content.hero.description,
    url: `${SITE_URL}/${resolvedLocale}/hisense-repair`,
    serviceType:
      resolvedLocale === 'fa'
        ? 'خدمات تعمیر و پشتیبانی محصولات هایسنس'
        : 'Hisense repair and support',
    areaServed: {
      '@type': 'Country',
      name: 'Iran',
    },
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name:
        resolvedLocale === 'fa'
          ? 'شرکت صنایع زرین نمای کاسپین'
          : 'Zarrin Namaye Caspian Industries',
      url: SITE_URL,
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="space-y-12 pb-16 pt-8 sm:space-y-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <PageBreadcrumbs items={breadcrumbItems} locale={resolvedLocale} className="pt-0 sm:pt-0" />
      <section className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) px-6 py-10 shadow-lg sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,179,172,0.18),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-(--text-subtle-color)">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-(--default-black-font) sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-(--text-muted-color) sm:text-lg">
              {content.hero.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.hero.actions.map((action, index) => {
                const isPrimary = index === 0;
                const linkProps = action.external
                  ? { target: '_blank', rel: 'noreferrer' }
                  : undefined;
                return (
                  <a
                    key={action.label}
                    href={resolveHref(action.href)}
                    {...linkProps}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) ${
                      isPrimary
                        ? 'bg-(--brand-color) text-white hover:bg-(--brand-color-dark)'
                        : 'border border-(--border-color) text-(--text-muted-color) hover:border-(--brand-color) hover:text-(--brand-color)'
                    }`}
                  >
                    {action.label}
                  </a>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.hero.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-(--border-color) bg-(--surface-muted-color) px-3 py-1 text-xs font-semibold text-(--default-black-font)"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-(--default-black-font)">
              {content.hero.cardTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-(--text-muted-color)">
              {content.hero.cardItems.map((item) => {
                const Icon = item.icon;
                const linkProps = item.external
                  ? { target: '_blank', rel: 'noreferrer' }
                  : undefined;
                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color)">
                      <Icon fontSize="small" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--text-subtle-color)">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={resolveHref(item.href)}
                          {...linkProps}
                          dir="ltr"
                          className="mt-1 block text-sm font-semibold text-(--default-black-font) transition hover:text-(--brand-color)"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-semibold text-(--default-black-font)">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-(--default-black-font)">
            {content.features.title}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.features.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-(--brand-color)"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color)">
                    <Icon fontSize="small" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-(--default-black-font)">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--text-muted-color)">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-(--default-black-font)">
            {content.devices.title}
          </h2>
          <p className="mt-3 text-sm text-(--text-muted-color)">{content.devices.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {content.devices.items.map((device) => (
              <span
                key={device}
                className="rounded-full border border-(--border-color) bg-(--surface-muted-color) px-3 py-1 text-xs font-semibold text-(--default-black-font)"
              >
                {device}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-(--default-black-font)">{content.steps.title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.steps.items.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--text-subtle-color)">
                  {`${index + 1}`.padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-base font-semibold text-(--default-black-font)">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-(--text-muted-color)">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-(--default-black-font)">{content.faq.title}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {content.faq.items.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-4"
              >
                <p className="text-sm font-semibold text-(--default-black-font)">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-(--text-muted-color)">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl bg-(--brand-color) px-6 py-8 text-white shadow-lg sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-bold">{content.cta.title}</h2>
            <p className="mt-2 text-sm text-white/85">{content.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={resolveHref(content.cta.primary.href)}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-(--brand-color) transition hover:bg-white/90"
            >
              {content.cta.primary.label}
            </a>
            <a
              href={resolveHref(content.cta.secondary.href)}
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
            >
              {content.cta.secondary.label}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
