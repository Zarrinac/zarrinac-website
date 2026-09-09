import { SITE_ID, type SiteId } from '@/lib/siteId';

// Per-site home page copy.
//
// The home is the only marketing page this codebase serves on more than one domain:
// zarrinac.com and znci.ir build from the SAME tree (see docker/) and 308-forward every
// other section away. If both homes carried the same title/H1/body, Google would fold
// them into one cluster and pick the canonical itself — exactly what happened between
// zarrinac.com and hisense-ir.com in 2026-07 (26x "Duplicate, Google chose different
// canonical than user"). So the two blocks below are deliberately DIVERGENT content, not
// translations or variants of one another: different angle, different keyword targets.
// zarrinac.com speaks to consumers about the brand portfolio; znci.ir speaks to trade
// partners about the company and its supply chain. Keep it that way when editing either.
//
// The site is resolved at BUILD time — Next inlines NEXT_PUBLIC_SITE_ID — so changing a
// deployment's identity requires a rebuild, never just a restart.

export type HomepageLocale = 'fa' | 'en';

export type HomeSeoContent = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  trustSignals: Array<{ value: string; label: string }>;
  quickLinks: Array<{ href: string; label: string }>;
  catalog: {
    eyebrow: string;
    heading: string;
    description: string;
    cta: string;
    note: string;
  };
};

const ZARRINAC_HOME: Record<HomepageLocale, HomeSeoContent> = {
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
    catalog: {
      eyebrow: 'کاتالوگ هایسنس',
      heading: 'کاتالوگ واردات و عرضه محصولات هایسنس',
      description:
        'فهرست کامل محصولات هایسنسی که زرین نمای کاسپین در ایران وارد و عرضه می‌کند؛ مشخصات فنی، ظرفیت‌ها و شماره مدل‌ها در یک فایل، برای همکاران تجاری، نمایندگان فروش و مشتریان.',
      cta: 'دریافت کاتالوگ (PDF)',
      note: 'فایل PDF — حدود ۱۰ مگابایت',
    },
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
    catalog: {
      eyebrow: 'Hisense catalog',
      heading: 'Our Hisense import and distribution catalog',
      description:
        'The full range of Hisense products Zarrin Namaye Caspian imports and distributes in Iran — specifications, capacities, and model numbers in a single file for trade partners, dealers, and customers.',
      cta: 'Get the catalog (PDF)',
      note: 'PDF file — about 10 MB',
    },
  },
};

const ZNCI_HOME: Record<HomepageLocale, HomeSeoContent> = {
  fa: {
    title: 'صنایع زرین نمای کاسپین (ZNCI) | واردات و تأمین لوازم خانگی و صوتی-تصویری',
    description:
      'صنایع زرین نمای کاسپین (ZNCI)؛ شرکت واردکننده و تأمین‌کننده لوازم خانگی و محصولات صوتی-تصویری در ایران — تأمین کالا، توزیع سراسری و همکاری با نمایندگان و همکاران تجاری.',
    eyebrow: 'شرکت صنایع زرین نمای کاسپین',
    heading: 'صنایع زرین نمای کاسپین؛ واردات، تأمین و توزیع لوازم خانگی در ایران',
    paragraphs: [
      'صنایع زرین نمای کاسپین (ZNCI) یک شرکت بازرگانی ایرانی در زنجیره تأمین لوازم خانگی و محصولات صوتی-تصویری است؛ از سفارش‌گذاری و واردات تا انبارش، توزیع و پشتیبانی فنی کالا در سراسر کشور.',
      "فعالیت این مجموعه بر دو بازوی اصلی استوار است: تأمین و پشتیبانی محصولات هایسنس در ایران، و معرفی و عرضه تلویزیون‌های برند اختصاصی دیکد (D'code).",
      'این صفحه معرفی شرکت برای همکاران تجاری، نمایندگان فروش و متقاضیان همکاری است؛ درخواست نمایندگی، استعلام کالا و مسیرهای رسمی ارتباط با ZNCI.',
    ],
    trustSignals: [
      { value: 'زنجیره تأمین', label: 'واردات، انبارش و توزیع کالا در سراسر ایران' },
      { value: 'همکاری تجاری', label: 'پذیرش نمایندگی فروش و همکاران تجاری' },
      { value: 'پشتیبانی فنی', label: 'خدمات پس از فروش و تأمین قطعات یدکی' },
    ],
    quickLinks: [
      { href: '/request-representation', label: 'درخواست نمایندگی فروش' },
      { href: '/about', label: 'معرفی شرکت' },
      { href: '/contact-us', label: 'راه‌های ارتباط با ما' },
      { href: '/dcode', label: "برند تلویزیون دیکد D'code" },
      { href: '/find-service-center', label: 'مراکز خدمات پس از فروش' },
    ],
    catalog: {
      eyebrow: 'کاتالوگ محصولات',
      heading: 'کاتالوگ کالاهای قابل تأمین',
      description:
        'فهرست کالاهای قابل تأمین به همراه مشخصات فنی، ظرفیت‌ها و شماره مدل؛ مرجع استعلام و سفارش برای همکاران تجاری و نمایندگان فروش.',
      cta: 'دانلود کاتالوگ (PDF)',
      note: 'فرمت PDF — حجم تقریبی ۱۰ مگابایت',
    },
  },
  en: {
    title: 'Zarrin Namaye Caspian Industries (ZNCI) | Home Appliance Import & Supply',
    description:
      'Zarrin Namaye Caspian Industries (ZNCI) imports, supplies and distributes home appliances and consumer electronics across Iran — trade partnerships, a nationwide dealer network, and technical support.',
    eyebrow: 'Zarrin Namaye Caspian Industries',
    heading: 'Zarrin Namaye Caspian Industries — appliance import, supply and distribution in Iran',
    paragraphs: [
      'Zarrin Namaye Caspian Industries (ZNCI) is an Iranian trading company working across the home-appliance and consumer-electronics supply chain: sourcing and import, warehousing, nationwide distribution, and technical support.',
      "The company operates along two lines: supplying and supporting Hisense products in Iran, and introducing its own television brand, D'code.",
      'This page introduces the company to trade partners, dealers, and prospective representatives — dealership applications, product enquiries, and the official ways to reach ZNCI.',
    ],
    trustSignals: [
      { value: 'Supply chain', label: 'Import, warehousing and distribution across Iran' },
      { value: 'Partnerships', label: 'Dealer and trade-partner applications welcome' },
      { value: 'Support', label: 'After-sales service and spare-part supply' },
    ],
    quickLinks: [
      { href: '/request-representation', label: 'Apply for a dealership' },
      { href: '/about', label: 'About the company' },
      { href: '/contact-us', label: 'Ways to reach us' },
      { href: '/dcode', label: "D'code TV brand" },
      { href: '/find-service-center', label: 'Service centres' },
    ],
    catalog: {
      eyebrow: 'Product catalog',
      heading: 'Catalog of the products we supply',
      description:
        'The range ZNCI sources and supplies, with specifications, capacities and model numbers — a reference for trade partners and dealers placing enquiries and orders.',
      cta: 'Download the catalog (PDF)',
      note: 'PDF — approximately 10 MB',
    },
  },
};

// hisense is absent on purpose: this repo never deploys as hisense-ir.com, which has its
// own repo and its own home copy. An unrecognised NEXT_PUBLIC_SITE_ID therefore degrades
// to the zarrinac copy rather than crashing the build.
const HOME_BY_SITE: Partial<Record<SiteId, Record<HomepageLocale, HomeSeoContent>>> = {
  zarrinac: ZARRINAC_HOME,
  znci: ZNCI_HOME,
};

export const getHomeSeoContent = (locale: HomepageLocale): HomeSeoContent =>
  (HOME_BY_SITE[SITE_ID] ?? ZARRINAC_HOME)[locale];
