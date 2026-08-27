import type { Locale } from '@/i18n/routing';

// Buying-intent <title> and <meta description> templates for product detail pages.
//
// The product `name` already carries the category + brand (e.g. "تلویزیون Q6Q هایسنس",
// "کولر گازی اینورتر هایسنس HIH-24TG") and is unique per SKU, so these templates wrap it
// with purchase-intent terms (خرید/قیمت/مشخصات) + the site brand. This fixes three SEO issues
// at once: titles under 30 chars, titles identical to the <h1>, and duplicate/short/
// mislocalised meta descriptions.
//
// We deliberately DO NOT use the DB `tagline` for meta: many are duplicated across sibling
// SKUs (all HID duct units share one tagline, all HRH/HIH/HRTC/HFH series likewise) and a
// few are mislocalised (the q6q fa tagline is English) — both hurt SEO. The clean, visible
// product name/<h1> on the page is unchanged; only the head metadata is enriched.

export const buildProductMetaTitle = (locale: Locale, name: string): string =>
  locale === 'fa' ? `${name} | خرید، قیمت و مشخصات | هایسنس ایران` : `${name} | Hisense Iran`;

export const buildProductMetaDescription = (locale: Locale, name: string): string =>
  locale === 'fa'
    ? `خرید ${name} با گارانتی رسمی و خدمات پس از فروش سراسری از نمایندگی رسمی هایسنس ایران، زرین نمای کاسپین. مشخصات کامل و استعلام قیمت روز.`
    : `Buy the ${name} from Hisense Iran's official distributor — genuine product, warranty, and nationwide after-sales service.`;

// Category listing pages: the route title (e.g. "ماشین لباسشویی هایسنس") is also reused as a
// visible label/H1 elsewhere, so we wrap only the <title> field in `generateMetadata` — not
// the translation value — to lengthen short category titles without any side effects.
export const buildCategoryMetaTitle = (locale: string, routeTitle: string): string =>
  locale === 'fa' ? `${routeTitle} | خرید و قیمت | هایسنس ایران` : `${routeTitle} | Hisense Iran`;

// Bespoke <meta description> per category/page (both ~150-162 chars, fa+en in sync).
// The route `description` that category & refrigerator listings render as a visible subtitle
// is intentionally short, and a generic "append a suffix" approach can't map every base into
// the 150-165 window without over/undershooting — so the meta field gets its own purpose-
// written copy here (purchase-intent + official-distributor signals) without touching on-page text.
type CategoryMetaKey = 'tvs' | 'wms' | 'rac' | 'cac' | 'refrigerator';

const CATEGORY_META_DESCRIPTIONS: Record<CategoryMetaKey, Record<'fa' | 'en', string>> = {
  tvs: {
    fa: 'خرید تلویزیون‌های هایسنس با پنل‌های ULED، Mini-LED و QLED، تصویر پرنور و صدای حرفه‌ای از نمایندگی رسمی ایران؛ همراه با گارانتی و خدمات پس از فروش سراسری.',
    en: 'Shop Hisense ULED, Mini-LED, and QLED TVs with vivid picture and premium sound from the official Iran distributor, with warranty and nationwide service.',
  },
  wms: {
    fa: 'خرید ماشین لباسشویی هایسنس با برنامه بخار ضدآلرژی، موتور اینورتر کم‌صدا و ظرفیت بالا از نمایندگی رسمی ایران؛ همراه با گارانتی و خدمات پس از فروش سراسری.',
    en: 'Shop Hisense washing machines with Allergy Steam, quiet inverter motors, and large capacity from the official Iran distributor, with warranty and service.',
  },
  rac: {
    fa: 'خرید کولر گازی اسپلیت اینورتر هایسنس با کنترل هوشمند و سرمایش مطمئن و کم‌صدا از نمایندگی رسمی ایران؛ همراه با گارانتی، نصب و خدمات پس از فروش در سراسر کشور.',
    en: 'Shop Hisense inverter split air conditioners with smart control and quiet cooling from the official Iran distributor, with warranty, install and service.',
  },
  cac: {
    fa: 'خرید سیستم‌های تهویه مطبوع تجاری هایسنس شامل VRF و داکت اسپلیت برای پروژه‌های بزرگ از نمایندگی رسمی ایران؛ همراه با پشتیبانی فنی و خدمات پس از فروش سراسری.',
    en: 'Hisense commercial HVAC: VRF and ducted split systems for hotels, malls, and large projects from the official Iran distributor with nationwide support.',
  },
  refrigerator: {
    fa: 'خرید یخچال و فریزر هایسنس در مدل‌های ساید بای ساید، کمبی و صندوقی با Total No-Frost از نمایندگی رسمی ایران؛ همراه با گارانتی و خدمات پس از فروش سراسری.',
    en: 'Shop Hisense refrigerators and freezers — side-by-side, combi, and chest models with Total No-Frost from the official Iran distributor, with warranty.',
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
