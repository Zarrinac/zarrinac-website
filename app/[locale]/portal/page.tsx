import type { Metadata } from 'next';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { getLocale, getTranslations } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import RouteHero from '@/components/routes/RouteHero';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

const AFTER_SALES_PORTAL_URL = 'https://hisense-portal.sarvcrm.com/hisense';

type IconType = typeof AdminPanelSettingsOutlinedIcon;

type PortalContent = {
  introTitle: string;
  introParagraphs: string[];
  accessTitle: string;
  accessDescription: string;
  portalButton: string;
  notice: string;
  cards: Array<{
    title: string;
    description: string;
    icon: IconType;
  }>;
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

const PORTAL_CONTENT: Record<Locale, PortalContent> = {
  fa: {
    introTitle: 'پرتال نمایندگان خدمات پس از فروش',
    introParagraphs: [
      'این بخش فقط برای نمایندگان خدمات پس از فروش صنایع زرین نمای کاسپین در نظر گرفته شده است. نمایندگان خدمات می‌توانند از طریق پرتال، اطلاعات و ابزارهای مورد نیاز برای پیگیری امور خدماتی را در اختیار داشته باشند.',
      'اگر نماینده خدمات هستید، از لینک زیر وارد پرتال شوید. در صورت نداشتن دسترسی، از مسیرهای رسمی پشتیبانی با تیم خدمات در ارتباط باشید.',
    ],
    accessTitle: 'نمایندگان خدمات از طریق لینک زیر به پرتال خود دسترسی پیدا می‌کنند',
    accessDescription: 'ورود به سامانه نیازمند دسترسی معتبر نمایندگی خدمات پس از فروش است.',
    portalButton: 'دسترسی به پرتال',
    notice:
      'این پرتال مخصوص نمایندگان خدمات پس از فروش است و برای نمایندگان فروش یا مشتریان عمومی استفاده نمی‌شود.',
    cards: [
      {
        title: 'دسترسی نمایندگان خدمات',
        description: 'ورود به سامانه رسمی پیگیری و مدیریت امور خدمات پس از فروش.',
        icon: AdminPanelSettingsOutlinedIcon,
      },
      {
        title: 'پیگیری فرایندهای خدماتی',
        description: 'استفاده از ابزارهای عملیاتی ویژه شبکه خدمات رسمی.',
        icon: AssignmentTurnedInOutlinedIcon,
      },
      {
        title: 'پشتیبانی رسمی',
        description: 'ارتباط با تیم خدمات برای هماهنگی، راهنمایی و رفع مشکل دسترسی.',
        icon: SupportAgentOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'مسیرهای مرتبط',
      title: 'لینک‌های رسمی برای نمایندگان خدمات',
      items: [
        {
          href: '/request-representation',
          label: 'درخواست نمایندگی خدمات',
          description: 'ارسال درخواست برای نمایندگی نصب و خدمات پس از فروش.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'اطلاعات خدمات رسمی تعمیر، نصب و پشتیبانی محصولات Hisense.',
        },
        {
          href: '/contact-us',
          label: 'تماس با پشتیبانی',
          description: 'راه‌های رسمی ارتباط با امور مشتریان، فروش و خدمات.',
        },
      ],
    },
  },
  en: {
    introTitle: 'After-Sales Service Representatives Portal',
    introParagraphs: [
      'This area is intended only for Zarrin Namaye Caspian after-sales service representatives. Service representatives can use the portal to access the tools and information needed for official service operations.',
      'If you are an authorized service representative, use the link below to access the portal. If you do not have access, contact the service team through the official support channels.',
    ],
    accessTitle: 'Service representatives can access their portal through the link below',
    accessDescription: 'Portal login requires valid after-sales service representative access.',
    portalButton: 'Access portal',
    notice:
      'This portal is reserved for after-sales service representatives and is not intended for sales representatives or general customers.',
    cards: [
      {
        title: 'Service representative access',
        description: 'Enter the official system for after-sales service operations.',
        icon: AdminPanelSettingsOutlinedIcon,
      },
      {
        title: 'Service process follow-up',
        description: 'Use operational tools dedicated to the official service network.',
        icon: AssignmentTurnedInOutlinedIcon,
      },
      {
        title: 'Official support',
        description: 'Coordinate with the service team for guidance or access issues.',
        icon: SupportAgentOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'Related paths',
      title: 'Official links for service representatives',
      items: [
        {
          href: '/request-representation',
          label: 'Request service representation',
          description: 'Apply for installation and after-sales service representation.',
        },
        {
          href: '/hisense-repair',
          label: 'Repair and support',
          description: 'Information about official repair, installation, and support services.',
        },
        {
          href: '/contact-us',
          label: 'Contact support',
          description: 'Official channels for customer care, sales, and service teams.',
        },
      ],
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.portal');
  const localizedPath = `/${locale}/portal`;
  const languageAlternates = getLanguageAlternates('/portal');

  return {
    title: routeTranslations('title'),
    description: routeTranslations('description'),
    // Representative-only access portal (outbound login): keep out of the index but
    // allow crawling links so equity still flows to linked public pages.
    robots: { index: false, follow: true },
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

export default async function PortalPage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.portal');
  const content = PORTAL_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/portal`,
  });
  const isRTL = locale === 'fa';
  const resolveHref = (href: string) => (href.startsWith('/') ? `/${locale}${href}` : href);
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: routeTranslations('title'),
    description: routeTranslations('description'),
    url: `${SITE_URL}/${locale}/portal`,
    inLanguage: getLocaleLanguage(locale),
    audience: {
      '@type': 'Audience',
      audienceType:
        locale === 'fa' ? 'نمایندگان خدمات پس از فروش' : 'After-sales service representatives',
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
          {content.cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-5 shadow-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color)">
                  <Icon fontSize="small" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-(--default-black-font)">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--text-muted-color)">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) px-5 py-8 text-center shadow-sm sm:px-8 sm:py-10">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--brand-color) text-white">
            <VerifiedOutlinedIcon fontSize="small" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-(--default-black-font) sm:text-2xl">
            {content.accessTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-(--text-muted-color)">
            {content.accessDescription}
          </p>
          <a
            href={AFTER_SALES_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-(--brand-color) px-6 py-3 text-sm font-bold text-white transition hover:bg-(--brand-color-dark) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
          >
            {content.portalButton}
            <LaunchOutlinedIcon fontSize="small" />
          </a>
          <p className="mx-auto mt-5 max-w-2xl text-xs leading-6 text-(--text-subtle-color)">
            {content.notice}
          </p>
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
