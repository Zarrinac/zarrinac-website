import type { Locale } from '@/i18n/routing';

// Navigation structure and localized submenu copy used by Header.

// `/rac` and `/cac` are internal keys used to look up submenu product links; the
// real routes live under `/products/*`. Always canonicalize before rendering a link
// so the nav points directly at the canonical URL (no redirect hop / phantom 404).
export const canonicalizeHref = (href: string) => {
  if (href === '/rac') return '/products/rac';
  if (href === '/cac') return '/products/cac';
  return href;
};

export const NAV_ITEMS = [
  { key: 'tvAudio', href: '/products/tvs' },
  { key: 'airConditioner', href: '/rac' },
  { key: 'homeAppliances', href: '/refrigerator' },
] as const;

export const NAV_SECONDARY_ITEMS = [
  { key: 'about', href: '/about' },
  { key: 'support', href: '/contact-us' },
] as const;

export type NavKey =
  | (typeof NAV_ITEMS)[number]['key']
  | (typeof NAV_SECONDARY_ITEMS)[number]['key'];

type LocalizedText = Record<Locale, string>;

export type SubMenuItem = {
  title: LocalizedText;
  description: LocalizedText;
  href: string;
};

export const SUB_MENU_CONTENT: Record<NavKey, SubMenuItem[]> = {
  tvAudio: [
    {
      title: { en: 'Hisense TV (LED)', fa: 'تلویزیون هایسنس (LED)' },
      description: {
        en: 'Mini-LED, ULED, and Laser TV lines for a world-class viewing experience.',
        fa: 'تلویزیون‌های Mini-LED، ULED و Laser برای تجربه تصویری جهانی.',
      },
      href: '/products/tvs',
    },
  ],
  airConditioner: [
    {
      title: { en: 'Hisense Residential Air Conditioner', fa: 'کولر گازی خانگی هایسنس' },
      description: {
        en: 'Smart split ACs with AI controls and energy efficiency label A.',
        fa: 'اسپلیت‌های خانگی با کنترل هوشمند و برچسب انرژی A.',
      },
      href: '/rac',
    },
    {
      title: { en: 'Hisense Commercial Air Conditioner', fa: 'تهویه مطبوع تجاری هایسنس' },
      description: {
        en: 'VRF and ducted HVAC systems engineered for large commercial projects.',
        fa: 'راهکارهای VRF و داکت‌اسپلیت صنعتی برای پروژه‌های بزرگ.',
      },
      href: '/cac',
    },
  ],
  homeAppliances: [
    {
      title: { en: 'Hisense Refrigerator & Freezer', fa: 'یخچال و فریزر هایسنس' },
      description: {
        en: 'Refrigerators, freezers, and side-by-sides powered by Total No-Frost technology.',
        fa: 'یخچال، فریزر و ساید بای ساید با تکنولوژی Total No-Frost.',
      },
      href: '/refrigerator',
    },
    {
      title: { en: 'Hisense Washing Machine', fa: 'ماشین لباسشویی هایسنس' },
      description: {
        en: 'Steam-care washing machines with silent inverter motors.',
        fa: 'ماشین‌های لباسشویی با بخار ضدآلرژی و موتور اینورتر سایلنت.',
      },
      href: '/products/wms',
    },
  ],
  about: [
    {
      title: { en: 'Our Story', fa: 'داستان ما' },
      description: {
        en: 'A legacy of innovation since 1969.',
        fa: 'میراثی از نوآوری از سال ۱۹۶۹.',
      },
      href: '/about',
    },
  ],
  support: [
    {
      title: { en: 'Service representative portal', fa: 'پرتال نمایندگان خدمات' },
      description: {
        en: 'Access the after-sales service representative portal.',
        fa: 'دسترسی نمایندگان خدمات پس از فروش به پرتال رسمی.',
      },
      href: '/portal',
    },
    {
      title: { en: 'Repair & Support', fa: 'خدمات تعمیر و پشتیبانی' },
      description: {
        en: 'Book official service, support, and repair with certified technicians.',
        fa: 'ثبت درخواست خدمات، پشتیبانی و تعمیر رسمی با تکنسین‌های آموزش‌دیده.',
      },
      href: '/hisense-repair',
    },
    {
      title: { en: 'Find service center', fa: 'لیست نمایندگان خدمات' },
      description: {
        en: 'Find authorized after-sales service representatives by city and service type.',
        fa: 'جستجوی نمایندگان خدمات پس از فروش بر اساس شهر و نوع فعالیت.',
      },
      href: '/find-service-center',
    },
    {
      title: { en: 'Complaint form', fa: 'فرم شکایت' },
      description: {
        en: 'Submit a service, warranty, or product complaint for official follow-up.',
        fa: 'برای خدمات، گارانتی یا کیفیت محصول، شکایت خود را برای پیگیری رسمی ثبت کنید.',
      },
      href: '/complaint',
    },
    {
      title: { en: 'Request representation', fa: 'درخواست نمایندگی' },
      description: {
        en: 'Apply for sales or after-sales service representation with Hisense Iran.',
        fa: 'درخواست نمایندگی فروش یا نمایندگی خدمات پس از فروش هایسنس ایران.',
      },
      href: '/request-representation',
    },
    {
      title: { en: 'Customer survey', fa: 'فرم نظرسنجی' },
      description: {
        en: 'Rate your service experience and help us improve support quality.',
        fa: 'تجربه خدمات خود را ارزیابی کنید و به ما برای بهبود کیفیت پشتیبانی کمک کنید.',
      },
      href: '/survey',
    },
    {
      title: { en: 'Contact us', fa: 'تماس با ما' },
      description: {
        en: 'Reach our team for service, warranty, or sales questions.',
        fa: 'برای خدمات، گارانتی یا سوالات فروش با ما در ارتباط باشید.',
      },
      href: '/contact-us',
    },
    {
      title: { en: 'FAQs', fa: 'سوالات متداول' },
      description: {
        en: 'Find quick answers for every device.',
        fa: 'پاسخ سریع برای هر دستگاه را پیدا کنید.',
      },
      href: '/faq',
    },
  ],
};
