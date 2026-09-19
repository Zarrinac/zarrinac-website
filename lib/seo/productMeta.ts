import type { Locale } from '@/i18n/routing';

// Product names already include the brand and model. Keep the useful model near
// the front and describe the actual specification/price-enquiry experience.
// Avoid shared/mislocalised DB taglines; there is no fixed Google character limit.

export const buildProductMetaTitle = (locale: Locale, name: string): string =>
  locale === 'fa' ? `${name} | مشخصات و استعلام قیمت` : `${name} | Specs & Price Enquiry`;

export const buildProductMetaDescription = (locale: Locale, name: string): string =>
  locale === 'fa'
    ? `خرید ${name} با گارانتی رسمی و خدمات پس از فروش سراسری از نمایندگی رسمی هایسنس ایران، زرین نمای کاسپین. مشخصات کامل و استعلام قیمت روز.`
    : `Explore ${name} specifications and features. Contact Hisense Iran for current pricing, official warranty information, and nationwide after-sales support.`;

// Keep the visible category heading independent from the search-result title.
export const buildCategoryMetaTitle = (locale: string, routeTitle: string): string =>
  locale === 'fa' ? `${routeTitle} | خرید و قیمت | هایسنس ایران` : `${routeTitle} | Hisense Iran`;

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

export const buildCategoryMetaDescription = (locale: string, category: CategoryMetaKey): string =>
  CATEGORY_META_DESCRIPTIONS[category][locale === 'fa' ? 'fa' : 'en'];

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

export const buildSupportMetaDescription = (locale: string, page: SupportMetaKey): string =>
  SUPPORT_META_DESCRIPTIONS[page][locale === 'fa' ? 'fa' : 'en'];
