// Injects organization and website JSON-LD for search engines per locale.
import type { Locale } from '@/i18n/routing';
import JsonLd from './JsonLd';
import { SITE_URL, getLocaleLanguage } from '@/lib/seo/site';

// Google renders the Organization `logo` in search results / the knowledge
// panel. Use the full Hisense wordmark (transparent background) rather than the
// favicon so the official Hisense Iran site is recognizable in results.
const LOGO_URL = `${SITE_URL}/icons/hisense-logo-full.svg`;

const ORGANIZATION_CONTENT = {
  fa: {
    name: 'شرکت صنایع زرین نمای کاسپین',
    description:
      'تنها نماینده رسمی هایسنس در ایران با شبکه فروش و خدمات پس از فروش سراسری برای محصولات خانگی و صنعتی.',
  },
  en: {
    name: 'Zarrin Namaye caspian Industries',
    description:
      'Exclusive Hisense distributor in Iran delivering nationwide sales and after-sales service for consumer electronics and HVAC systems.',
  },
};

const WEBSITE_CONTENT = {
  fa: {
    name: 'هایسنس ایران | زرین نمای کاسپین',
    description:
      'مرجع رسمی معرفی محصولات، گارانتی و مسیرهای ارتباطی هایسنس ایران تحت مدیریت زرین نمای کاسپین.',
  },
  en: {
    name: 'Hisense Iran | Zarrin Namaye Caspian',
    description:
      'Official Hisense Iran website for products, warranty details, and verified support channels operated by Zarrin Namaye Caspian.',
  },
};

type StructuredDataProps = {
  locale: Locale;
};

export default function StructuredData({ locale }: StructuredDataProps) {
  const orgContent = ORGANIZATION_CONTENT[locale];
  const websiteContent = WEBSITE_CONTENT[locale];
  const websiteLanguage = getLocaleLanguage(locale);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: orgContent.name,
    legalName: orgContent.name,
    url: SITE_URL,
    logo: LOGO_URL,
    description: orgContent.description,
    sameAs: [
      'https://www.instagram.com/hisenseiran',
      'https://www.linkedin.com/company/zarrin-namaye-caspian',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+98-21-72133',
        availableLanguage: ['fa', 'en'],
        areaServed: 'IR',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kameliya Dead end, Sasanipour St.',
      addressLocality: 'Tehran',
      addressRegion: 'Tehran',
      postalCode: '1994736431',
      addressCountry: 'IR',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: websiteContent.name,
    description: websiteContent.description,
    inLanguage: websiteLanguage,
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
    </>
  );
}
