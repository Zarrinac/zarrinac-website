import type { Locale } from '@/i18n/routing';
import { mediaUrl } from '@/lib/mediaUrl';
import { SITE_URL, getLocaleLanguage, toAbsoluteUrl } from './site';
import { IS_ZARRINAC_SITE } from './siteBrand';

// Shared LocalBusiness structured data for contact / service pages. LocalBusiness
// (a subtype of Organization) is the strongest signal for local/branded search and
// map results in Iran. It references the global Organization node via parentOrganization
// so search engines treat them as one entity rather than duplicates.

const DEFAULT_CONTENT: Record<Locale, { name: string; description: string }> = {
  fa: {
    name: 'هایسنس ایران | زرین نمای کاسپین',
    description:
      'نمایندگی رسمی هایسنس در ایران؛ فروش و خدمات پس از فروش تلویزیون، یخچال فریزر، ماشین لباسشویی و تهویه مطبوع هایسنس با گارانتی رسمی و شبکه نمایندگان سراسری.',
  },
  en: {
    name: 'Hisense Iran | Zarrin Namaye Caspian',
    description:
      'Official Hisense distributor in Iran offering sales and after-sales service for TVs, refrigerators, washing machines, and HVAC systems with official warranty and nationwide authorized representatives.',
  },
};

// zarrinac.com names the business as the company itself (see siteBrand.ts).
const ZARRINAC_CONTENT: Record<Locale, { name: string; description: string }> = {
  fa: {
    name: 'صنایع زرین نمای کاسپین',
    description:
      'توزیع‌کننده رسمی هایسنس در ایران؛ فروش، نصب و خدمات پس از فروش تلویزیون، کولر گازی، یخچال فریزر و ماشین لباسشویی هایسنس از طریق شبکه سراسری نمایندگان مجاز.',
  },
  en: {
    name: 'Zarrin Namaye Caspian Industries',
    description:
      'The official Hisense distributor in Iran: sales, installation and after-sales service for Hisense TVs, air conditioners, refrigerators and washing machines through a nationwide authorized network.',
  },
};

const CONTENT = IS_ZARRINAC_SITE ? ZARRINAC_CONTENT : DEFAULT_CONTENT;

export const buildLocalBusinessJsonLd = (locale: Locale) => {
  const content = CONTENT[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#localbusiness`,
    name: content.name,
    description: content.description,
    url: SITE_URL,
    image: toAbsoluteUrl(mediaUrl('/banner/Fix-Banner-07.webp')),
    logo: `${SITE_URL}/icons/hisense-logo-full.svg`,
    telephone: '+98-21-72133',
    email: 'info@zarrinac.com',
    priceRange: '$$',
    inLanguage: getLocaleLanguage(locale),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kameliya Dead end, Sasanipour St.',
      addressLocality: 'Tehran',
      addressRegion: 'Tehran',
      postalCode: '1994736431',
      addressCountry: 'IR',
    },
    areaServed: { '@type': 'Country', name: 'Iran' },
    parentOrganization: { '@id': `${SITE_URL}#organization` },
    sameAs: [
      'https://www.instagram.com/hisenseiran',
      'https://www.linkedin.com/company/zarrin-namaye-caspian',
    ],
  };
};
