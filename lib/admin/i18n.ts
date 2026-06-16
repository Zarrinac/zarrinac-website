export const ADMIN_LOCALE_COOKIE = 'hisense_admin_locale';
export const adminLocales = ['en', 'fa'] as const;

export type AdminLocale = (typeof adminLocales)[number];
export type AdminMetricKey = 'products' | 'complaints' | 'surveys' | 'serviceCenters';

export function resolveAdminLocale(value: string | undefined | null): AdminLocale {
  return value === 'en' ? 'en' : 'fa';
}

export function getAdminDirection(locale: AdminLocale) {
  return locale === 'fa' ? 'rtl' : 'ltr';
}

export function getAdminFontFamily(locale: AdminLocale) {
  return locale === 'fa'
    ? "'IRANSansXV', 'Hisense Sans Alfabet', 'Segoe UI', Tahoma, sans-serif"
    : "'Hisense Sans Alfabet', 'Segoe UI', Arial, sans-serif";
}

export function formatAdminNumber(value: number | null, locale: AdminLocale) {
  return value === null
    ? getAdminDictionary(locale).common.notAvailable
    : new Intl.NumberFormat(locale).format(value);
}

export function formatAdminDateTime(value: string | Date, locale: AdminLocale) {
  return new Date(value).toLocaleString(locale);
}

export function formatAdminDate(value: string | Date | null, locale: AdminLocale) {
  return value
    ? new Date(value).toLocaleDateString(locale)
    : getAdminDictionary(locale).common.notAvailable;
}

export const adminCategoryLabels: Record<AdminLocale, Record<string, string>> = {
  en: {
    TVS: 'TVs',
    WMS: 'Washing machines',
    RAC: 'Residential AC',
    CAC: 'Commercial AC',
    REFRIGERATOR: 'Refrigerators',
    TV_DCODE: 'TV Dcode',
  },
  fa: {
    TVS: 'تلویزیون ها',
    WMS: 'ماشین لباسشویی',
    RAC: 'کولر گازی خانگی',
    CAC: 'کولر گازی تجاری',
    REFRIGERATOR: 'یخچال و فریزر',
    TV_DCODE: 'تلویزیون دی کد',
  },
};

export const adminValueLabels: Record<AdminLocale, Record<string, Record<string, string>>> = {
  en: {
    complaintTopic: {
      'after-sales-service': 'After-sales service',
      installation: 'Installation',
      'repair-delay': 'Repair delay',
      warranty: 'Warranty',
      'product-quality': 'Product quality',
      other: 'Other',
    },
    preferredContactMethod: {
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
    },
    serviceChannel: {
      repair: 'Repair',
      installation: 'Installation',
      warranty: 'Warranty',
      'call-center': 'Call center',
      sales: 'Sales',
      dealer: 'Dealer',
      website: 'Website',
      other: 'Other',
    },
    yesNoPartial: {
      yes: 'Yes',
      partly: 'Partly',
      no: 'No',
    },
    staffBehavior: {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
    },
    satisfaction: {
      'very-satisfied': 'Very satisfied',
      satisfied: 'Satisfied',
      neutral: 'Neutral',
      dissatisfied: 'Dissatisfied',
    },
    status: {
      NEW: 'New',
      REVIEWING: 'Reviewing',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed',
    },
    site: {
      hisense: 'Hisense',
      zarrinac: 'Zarrinac',
    },
  },
  fa: {
    complaintTopic: {
      'after-sales-service': 'خدمات پس از فروش',
      installation: 'نصب',
      'repair-delay': 'تاخیر در تعمیر',
      warranty: 'گارانتی',
      'product-quality': 'کیفیت محصول',
      other: 'سایر',
    },
    preferredContactMethod: {
      phone: 'تماس تلفنی',
      email: 'ایمیل',
      whatsapp: 'واتساپ',
    },
    serviceChannel: {
      repair: 'تعمیر',
      installation: 'نصب',
      warranty: 'گارانتی',
      'call-center': 'مرکز تماس',
      sales: 'فروش',
      dealer: 'نمایندگی',
      website: 'وب سایت',
      other: 'سایر',
    },
    yesNoPartial: {
      yes: 'بله',
      partly: 'تا حدی',
      no: 'خیر',
    },
    staffBehavior: {
      excellent: 'عالی',
      good: 'خوب',
      fair: 'متوسط',
      poor: 'ضعیف',
    },
    satisfaction: {
      'very-satisfied': 'بسیار راضی',
      satisfied: 'راضی',
      neutral: 'معمولی',
      dissatisfied: 'ناراضی',
    },
    status: {
      NEW: 'جدید',
      REVIEWING: 'در حال بررسی',
      RESOLVED: 'رسیدگی شده',
      CLOSED: 'بسته شده',
    },
    site: {
      hisense: 'هایسنس',
      zarrinac: 'زرین',
    },
  },
};

export function getAdminValueLabel(locale: AdminLocale, group: string, value: string | null) {
  if (!value) {
    return getAdminDictionary(locale).common.notAvailable;
  }

  return adminValueLabels[locale][group]?.[value] ?? value;
}

export const adminDictionaries = {
  en: {
    common: {
      brand: 'HISENSE',
      admin: 'Admin',
      adminPanel: 'Admin panel',
      route: 'Route',
      indexing: 'Indexing',
      lastCheck: 'Last check',
      notAvailable: 'N/A',
      configured: 'Configured',
      missing: 'Missing',
      site: 'Site',
      logout: 'Logout',
      language: 'Language',
      signIn: 'Sign in',
      username: 'Username',
      password: 'Password',
    },
    shell: {
      pathLabel: 'zarrinac.com/admin',
      nav: {
        dashboard: 'Dashboard',
        products: 'Products',
        complaints: 'Complaints',
        surveys: 'Surveys',
        serviceCenters: 'Service centers',
        settings: 'Settings',
      },
    },
    metrics: {
      products: 'Products',
      complaints: 'Complaints',
      surveys: 'Surveys',
      serviceCenters: 'Service centers',
    } satisfies Record<AdminMetricKey, string>,
    dashboard: {
      eyebrow: 'Overview',
      title: 'Dashboard',
      description:
        'Core admin routes are ready for product, submission, and service-center management.',
      databaseUnavailable:
        'Database metrics are unavailable. Check `DATABASE_URL` and Prisma connectivity.',
      productCategories: 'Product categories',
      noCategoryData: 'No category data available.',
      foundation: 'Admin foundation',
    },
    products: {
      eyebrow: 'Catalog',
      title: 'Products',
      description:
        'Product management will build on the existing Prisma product schema and localized copy records.',
      currentCatalog: 'Current catalog',
      nextBuildTarget: 'Next build target',
      nextBuildCopy: 'CRUD screens can start here without changing the public product routes.',
    },
    submissions: {
      eyebrow: 'Support',
      title: 'Submissions',
      description: 'Complaint and survey submissions are grouped here for review workflows.',
      recentComplaints: 'Recent complaints',
      recentSurveys: 'Recent surveys',
      showingRecent: 'Showing latest {count} records.',
      databaseUnavailable:
        'Submission data is unavailable. Check `DATABASE_URL` and Prisma connectivity.',
      emptyComplaints: 'No complaint submissions found.',
      emptySurveys: 'No survey submissions found.',
      openDetails: 'Details',
      print: 'Print / Save',
      printTable: 'Print / Save table',
      newBadge: 'New',
      fields: {
        referenceCode: 'Reference',
        status: 'Status',
        source: 'Source',
        submittedAt: 'Submitted',
        updatedAt: 'Updated',
        language: 'Language',
        fullName: 'Full name',
        phone: 'Phone',
        mobile: 'Mobile',
        email: 'Email',
        productCategory: 'Product category',
        productModel: 'Product model',
        invoiceNumber: 'Invoice number',
        referenceNumber: 'Reference number',
        purchaseDate: 'Purchase date',
        complaintTopic: 'Complaint topic',
        preferredContactMethod: 'Preferred contact',
        city: 'City',
        address: 'Address',
        description: 'Description',
        serviceChannel: 'Service channel',
        serviceDate: 'Service date',
        communicationClarity: 'Process clarity',
        staffBehavior: 'Staff behavior',
        timeliness: 'Timeliness',
        overallSatisfaction: 'Satisfaction',
        followUpConsent: 'Follow-up consent',
        overallFeedback: 'Overall feedback',
        improvementSuggestions: 'Improvement suggestions',
      },
    },
    complaints: {
      eyebrow: 'Support',
      title: 'Complaints',
      description: 'Review complaint forms submitted through the public complaint page.',
    },
    surveys: {
      eyebrow: 'Feedback',
      title: 'Surveys',
      description: 'Review service survey forms submitted by customers.',
    },
    serviceCenters: {
      eyebrow: 'Network',
      title: 'Service centers',
      description:
        'Service representative records can be managed here while the public finder keeps using the same data source.',
      currentRecords: 'Current records',
    },
    settings: {
      eyebrow: 'System',
      title: 'Settings',
      description: 'Operational checks for the current admin foundation.',
      access: 'Access',
      data: 'Data',
      credentials: 'Admin credentials',
      databaseUrl: 'Database URL',
    },
    login: {
      title: 'Admin login',
      invalidCredentials: 'Username or password is incorrect.',
      configError: 'Admin authentication is not configured.',
      rateLimited: 'Too many failed attempts. Please wait 15 minutes and try again.',
    },
  },
  fa: {
    common: {
      brand: 'HISENSE',
      admin: 'مدیریت',
      adminPanel: 'پنل مدیریت',
      route: 'مسیر',
      indexing: 'ایندکس',
      lastCheck: 'آخرین بررسی',
      notAvailable: 'ناموجود',
      configured: 'تنظیم شده',
      missing: 'تنظیم نشده',
      site: 'سایت',
      logout: 'خروج',
      language: 'زبان',
      signIn: 'ورود',
      username: 'نام کاربری',
      password: 'رمز عبور',
    },
    shell: {
      pathLabel: 'zarrinac.com/admin',
      nav: {
        dashboard: 'داشبورد',
        products: 'محصولات',
        complaints: 'شکایات',
        surveys: 'نظرسنجی ها',
        serviceCenters: 'مراکز خدمات',
        settings: 'تنظیمات',
      },
    },
    metrics: {
      products: 'محصولات',
      complaints: 'شکایات',
      surveys: 'نظرسنجی ها',
      serviceCenters: 'مراکز خدمات',
    } satisfies Record<AdminMetricKey, string>,
    dashboard: {
      eyebrow: 'نمای کلی',
      title: 'داشبورد',
      description: 'مسیرهای اصلی مدیریت برای محصولات، درخواست ها و مراکز خدمات آماده هستند.',
      databaseUnavailable:
        'آمار پایگاه داده در دسترس نیست. `DATABASE_URL` و اتصال Prisma را بررسی کنید.',
      productCategories: 'دسته بندی محصولات',
      noCategoryData: 'داده ای برای دسته بندی ها موجود نیست.',
      foundation: 'زیرساخت مدیریت',
    },
    products: {
      eyebrow: 'کاتالوگ',
      title: 'محصولات',
      description:
        'مدیریت محصولات بر پایه ساختار فعلی Prisma و متن های چندزبانه محصولات ساخته می شود.',
      currentCatalog: 'کاتالوگ فعلی',
      nextBuildTarget: 'هدف مرحله بعد',
      nextBuildCopy:
        'صفحه های CRUD از همین بخش شروع می شوند و مسیرهای عمومی محصولات تغییر نمی کنند.',
    },
    submissions: {
      eyebrow: 'پشتیبانی',
      title: 'درخواست ها',
      description: 'شکایات و نظرسنجی ها برای فرآیند بررسی در این بخش کنار هم قرار می گیرند.',
      recentComplaints: 'آخرین شکایات',
      recentSurveys: 'آخرین نظرسنجی ها',
      showingRecent: 'نمایش آخرین {count} رکورد.',
      databaseUnavailable:
        'داده های درخواست ها در دسترس نیست. `DATABASE_URL` و اتصال Prisma را بررسی کنید.',
      emptyComplaints: 'هیچ شکایتی ثبت نشده است.',
      emptySurveys: 'هیچ نظرسنجی ثبت نشده است.',
      openDetails: 'جزئیات',
      print: 'چاپ / ذخیره',
      printTable: 'چاپ / ذخیره جدول',
      newBadge: 'جدید',
      fields: {
        referenceCode: 'کد پیگیری',
        status: 'وضعیت',
        source: 'منبع',
        submittedAt: 'زمان ثبت',
        updatedAt: 'آخرین تغییر',
        language: 'زبان',
        fullName: 'نام و نام خانوادگی',
        phone: 'تلفن',
        mobile: 'موبایل',
        email: 'ایمیل',
        productCategory: 'دسته محصول',
        productModel: 'مدل محصول',
        invoiceNumber: 'شماره فاکتور',
        referenceNumber: 'شماره ارجاع',
        purchaseDate: 'تاریخ خرید',
        complaintTopic: 'موضوع شکایت',
        preferredContactMethod: 'روش تماس ترجیحی',
        city: 'شهر',
        address: 'آدرس',
        description: 'توضیحات',
        serviceChannel: 'کانال خدمات',
        serviceDate: 'تاریخ خدمات',
        communicationClarity: 'شفافیت فرآیند',
        staffBehavior: 'رفتار کارکنان',
        timeliness: 'زمان بندی',
        overallSatisfaction: 'رضایت کلی',
        followUpConsent: 'اجازه پیگیری',
        overallFeedback: 'بازخورد کلی',
        improvementSuggestions: 'پیشنهادها',
      },
    },
    complaints: {
      eyebrow: 'پشتیبانی',
      title: 'شکایات',
      description: 'فرم های شکایت ثبت شده از صفحه عمومی شکایات را بررسی کنید.',
    },
    surveys: {
      eyebrow: 'بازخورد',
      title: 'نظرسنجی ها',
      description: 'فرم های نظرسنجی خدمات ثبت شده توسط مشتریان را بررسی کنید.',
    },
    serviceCenters: {
      eyebrow: 'شبکه خدمات',
      title: 'مراکز خدمات',
      description:
        'رکوردهای نمایندگان خدمات از این بخش مدیریت می شوند و جستجوگر عمومی از همان منبع داده استفاده می کند.',
      currentRecords: 'رکوردهای فعلی',
    },
    settings: {
      eyebrow: 'سیستم',
      title: 'تنظیمات',
      description: 'بررسی های عملیاتی زیرساخت فعلی پنل مدیریت.',
      access: 'دسترسی',
      data: 'داده',
      credentials: 'اطلاعات ورود مدیریت',
      databaseUrl: 'آدرس پایگاه داده',
    },
    login: {
      title: 'ورود به پنل مدیریت',
      invalidCredentials: 'نام کاربری یا رمز عبور اشتباه است.',
      configError: 'احراز هویت مدیریت تنظیم نشده است.',
      rateLimited: 'تعداد دفعات ناموفق زیاد است. لطفاً ۱۵ دقیقه صبر کنید و دوباره تلاش کنید.',
    },
  },
} as const;

export function getAdminDictionary(locale: AdminLocale) {
  return adminDictionaries[locale];
}
