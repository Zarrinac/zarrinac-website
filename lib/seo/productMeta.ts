import type { Locale } from '@/i18n/routing';
import { IS_ZARRINAC_SITE } from '@/lib/seo/siteBrand';

// Product names already include the brand and model. Keep the useful model near
// the front and describe the actual specification/price-enquiry experience.
// Avoid shared/mislocalised DB taglines; there is no fixed Google character limit.
//
// zarrinac.com serves the same catalog as hisense-ir.com, so every builder here has a
// zarrinac variant with its own wording (IS_ZARRINAC_SITE): the titles and snippets of
// the two domains must not read as copies of each other.

export const buildProductMetaTitle = (locale: Locale, name: string): string => {
  if (IS_ZARRINAC_SITE) {
    return locale === 'fa'
      ? `${name} | خرید با گارانتی از زرین نمای کاسپین`
      : `${name} | Buy from Zarrin Namaye Caspian`;
  }
  return locale === 'fa' ? `${name} | مشخصات و استعلام قیمت` : `${name} | Specs & Price Enquiry`;
};

const buildZarrinacProductDescription = (locale: Locale, name: string): string =>
  locale === 'fa'
    ? `${name} را با گارانتی رسمی و خدمات پس از فروش سراسری از زرین نمای کاسپین، توزیع‌کننده رسمی هایسنس در ایران، تهیه کنید؛ مشخصات فنی کامل این مدل و استعلام قیمت روز.`
    : `Buy the ${name} from Zarrin Namaye Caspian, the official Hisense distributor in Iran: full specifications, the official warranty, nationwide after-sales service and today’s price on request.`;

export const buildProductMetaDescription = (locale: Locale, name: string): string => {
  if (IS_ZARRINAC_SITE) return buildZarrinacProductDescription(locale, name);
  return locale === 'fa'
    ? `خرید ${name} با گارانتی رسمی و خدمات پس از فروش سراسری از نمایندگی رسمی هایسنس ایران، زرین نمای کاسپین. مشخصات کامل و استعلام قیمت روز.`
    : `Explore ${name} specifications and features. Contact Hisense Iran for current pricing, official warranty information, and nationwide after-sales support.`;
};

// Keep the visible category heading independent from the search-result title.
export const buildCategoryMetaTitle = (locale: string, routeTitle: string): string => {
  if (IS_ZARRINAC_SITE) {
    return locale === 'fa'
      ? `${routeTitle} | خرید از زرین نمای کاسپین`
      : `${routeTitle} | Zarrin Namaye Caspian`;
  }
  return locale === 'fa'
    ? `${routeTitle} | خرید و قیمت | هایسنس ایران`
    : `${routeTitle} | Hisense Iran`;
};

// Describe the local catalog, without implying every model has the same features.
type CategoryMetaKey = 'tvs' | 'wms' | 'rac' | 'cac' | 'refrigerator';

const CATEGORY_META_DESCRIPTIONS: Record<CategoryMetaKey, Record<'fa' | 'en', string>> = {
  tvs: {
    fa: 'خرید تلویزیون‌های هایسنس با پنل‌های ULED، Mini-LED و QLED، تصویر پرنور و صدای حرفه‌ای از نمایندگی رسمی ایران؛ همراه با گارانتی و خدمات پس از فروش سراسری.',
    en: 'Shop Hisense ULED, Mini-LED, and QLED TVs with vivid picture and premium sound from the official Iran distributor, with warranty and nationwide service.',
  },
  wms: {
    fa: 'مقایسه ماشین لباسشویی هایسنس مدل‌های 8010 و 8012 با ظرفیت ۸ کیلوگرم، برنامه‌های شست‌وشو و مشخصات فنی؛ استعلام قیمت، گارانتی و خدمات از زرین نمای کاسپین.',
    en: 'Compare Hisense 8010 and 8012 washing machines: 8 kg capacity, spin speeds, wash programs and specifications. Contact Hisense Iran for pricing and warranty.',
  },
  rac: {
    fa: 'کولر گازی هایسنس در مدل‌های دیواری، اینورتر و ایستاده؛ مقایسه ظرفیت و مشخصات هر مدل و استعلام قیمت، شرایط گارانتی، نصب و خدمات پس از فروش از زرین نمای کاسپین.',
    en: 'Compare Hisense wall-mounted, inverter and floor-standing air conditioners by capacity and specifications. Ask Hisense Iran about pricing, installation and warranty.',
  },
  cac: {
    fa: 'داکت اسپلیت هایسنس سری HID برای تهویه مطبوع تجاری؛ مقایسه ظرفیت سرمایش و گرمایش، ابعاد و مشخصات فنی مدل‌ها و دریافت مشاوره و استعلام قیمت از زرین نمای کاسپین.',
    en: 'Explore Hisense HID ducted air conditioners for commercial projects. Compare cooling and heating capacities, dimensions and specifications, and request a quote.',
  },
  refrigerator: {
    fa: 'مقایسه یخچال و فریزر هایسنس در مدل‌های ساید بای ساید، کمبی و صندوقی؛ بررسی ظرفیت، ابعاد و امکانات هر مدل و استعلام قیمت و گارانتی از نمایندگی زرین نمای کاسپین.',
    en: 'Compare Hisense refrigerators and freezers, including side-by-side, combi and chest models. Check capacity, dimensions and features, then ask about pricing and warranty.',
  },
};

const ZARRINAC_CATEGORY_META_DESCRIPTIONS: Record<CategoryMetaKey, Record<'fa' | 'en', string>> = {
  tvs: {
    fa: 'تلویزیون‌های هایسنس U7K، Q7Q، Q6Q، A4AN و A3Q را با گارانتی رسمی از زرین نمای کاسپین بخرید؛ مقایسه پنل، اندازه و امکانات هوشمند، استعلام قیمت روز و خدمات پس از فروش سراسری.',
    en: 'Buy Hisense U7K, Q7Q, Q6Q, A4AN and A3Q TVs with the official warranty from Zarrin Namaye Caspian. Compare panels, sizes and smart features, and ask for today’s price.',
  },
  wms: {
    fa: 'ماشین لباسشویی هایسنس مدل 8010 و 8012 با ظرفیت ۸ کیلوگرم؛ مقایسه دور موتور و برنامه‌ها، خرید با گارانتی رسمی و نصب و تعمیر توسط نمایندگان مجاز زرین نمای کاسپین.',
    en: 'Hisense 8010 and 8012 washing machines, 8 kg each: compare spin speeds and programs, then buy with the official warranty and nationwide service from Zarrin Namaye Caspian.',
  },
  rac: {
    fa: 'کولر گازی هایسنس سری HIH، HRH، HRTC و HFH از زرین نمای کاسپین؛ انتخاب ظرفیت BTU مناسب، استعلام قیمت، نصب توسط نمایندگان مجاز، قطعات یدکی اصل و گارانتی رسمی.',
    en: 'Hisense HIH, HRH, HRTC and HFH air conditioners from Zarrin Namaye Caspian: choose the right BTU capacity, get a quote, and book authorized installation and service.',
  },
  cac: {
    fa: 'داکت اسپلیت هایسنس سری HID برای ساختمان‌های اداری، تجاری و صنعتی؛ مشاوره فنی، تأمین تجهیزات، استعلام قیمت پروژه و خدمات پس از فروش سراسری از زرین نمای کاسپین.',
    en: 'Hisense HID ducted splits for offices, retail and industrial projects: technical consultation, equipment supply, project quotes and after-sales service from Zarrin Namaye Caspian.',
  },
  refrigerator: {
    fa: 'یخچال فریزر هایسنس ساید بای ساید، کمبی و فریزر صندوقی از زرین نمای کاسپین؛ مقایسه ظرفیت و ابعاد، خرید با گارانتی رسمی، قطعات یدکی اصل و خدمات پس از فروش سراسری.',
    en: 'Hisense side-by-side, combi and chest freezer models from Zarrin Namaye Caspian: compare capacity and size, then buy with the official warranty and nationwide service.',
  },
};

export const buildCategoryMetaDescription = (locale: string, category: CategoryMetaKey): string =>
  (IS_ZARRINAC_SITE ? ZARRINAC_CATEGORY_META_DESCRIPTIONS : CATEGORY_META_DESCRIPTIONS)[category][
    locale === 'fa' ? 'fa' : 'en'
  ];

// Contact & find-service-center: their route `description` is meta-only, but still short — give
// each its own ~150-160 char description (official-representative + nationwide-coverage signals).
type SupportMetaKey = 'contact' | 'findServiceCenter';

const SUPPORT_META_DESCRIPTIONS: Record<SupportMetaKey, Record<'fa' | 'en', string>> = {
  contact: {
    fa: 'برای فروش، نصب، خدمات پس از فروش یا همکاری تجاری با دفتر مرکزی تهران و تیم‌های منطقه‌ای زرین نمای کاسپین، نماینده رسمی هایسنس در ایران، در ارتباط باشید.',
    en: 'Contact Zarrin Namaye Caspian, the official Hisense representative in Iran, for sales, installation, after-sales service, or partnership requests nationwide.',
  },
  findServiceCenter: {
    fa: 'نزدیک‌ترین نماینده رسمی خدمات پس از فروش هایسنس را بر اساس استان، شهر و نوع فعالیت، همراه با اطلاعات تماس کامل، از شبکه مجاز زرین نمای کاسپین در ایران پیدا کنید.',
    en: 'Find the nearest official Hisense after-sales service representative by province, city, and service type across the Zarrin Namaye Caspian network in Iran.',
  },
};

const ZARRINAC_SUPPORT_META_DESCRIPTIONS: Record<SupportMetaKey, Record<'fa' | 'en', string>> = {
  contact: {
    fa: 'تماس با صنایع زرین نمای کاسپین، توزیع‌کننده رسمی هایسنس در ایران: دفتر مرکزی تهران، فروش، نصب، خدمات پس از فروش و درخواست همکاری تجاری از سراسر کشور.',
    en: 'Get in touch with Zarrin Namaye Caspian, the official Hisense distributor in Iran: Tehran head office, sales, installation, after-sales service and trade partnerships.',
  },
  findServiceCenter: {
    fa: 'فهرست نمایندگان مجاز خدمات پس از فروش زرین نمای کاسپین در سراسر ایران؛ با انتخاب استان، شهر و نوع خدمت، نشانی و شماره تماس نزدیک‌ترین نماینده را ببینید.',
    en: 'The Zarrin Namaye Caspian authorized after-sales service network across Iran: pick a province, city and service type to see the nearest representative’s address and phone.',
  },
};

export const buildSupportMetaDescription = (locale: string, page: SupportMetaKey): string =>
  (IS_ZARRINAC_SITE ? ZARRINAC_SUPPORT_META_DESCRIPTIONS : SUPPORT_META_DESCRIPTIONS)[page][
    locale === 'fa' ? 'fa' : 'en'
  ];
