import { mediaUrl } from '@/lib/mediaUrl';
import { type WmProduct } from '@/types/wm';

// Bundled fallback washing machine catalog used when a database is not available.
const productAsset = (path: string) => mediaUrl(`/products/whashing-machine/${path}`);

const quickWashLogo = productAsset('logos/quick-wash.png');
const selfDiagnosticLogo = productAsset('logos/selt-diagnostics.png');

const wm8010HeroWhite = productAsset('8010/WFKV8010D-A.jpg');
const wm8010HeroSilver = productAsset('8010/WFKV8010DS-A.jpg');
const wm8010GalleryWhiteB = productAsset('8010/WFKV8010D-B.jpg');
const wm8010GallerySilverB = productAsset('8010/WFKV8010DS-B.jpg');
const wm8010GalleryWhiteC = productAsset('8010/WFKV8010D-C.jpg');
const wm8010GallerySilverC = productAsset('8010/WFKV8010DS-C.jpg');

const wm8012HeroWhite = productAsset('8012/WFH8012D-A.jpg');
const wm8012HeroSilver = productAsset('8012/WFH8012DS-A.jpg');
const wm8012GalleryWhiteB = productAsset('8012/WFH8012D-B.jpg');
const wm8012GallerySilverB = productAsset('8012/WFH8012DS-B.jpg');
const wm8012GalleryWhiteC = productAsset('8012/WFH8012D-C.jpg');
const wm8012GallerySilverC = productAsset('8012/WFH8012DS-C.jpg');
const wm8012QuickWash = productAsset('8012/8012-quick-wash.png');
const wm8012AllergySteam = productAsset('8012/8012-alergy-steam.png');
const wm8012Stains = productAsset('8012/8012-stains.png');
const wm8012SelfDiagnostic = productAsset('8012/8012-selt-diagnostic.png');
const wm8012QuickWashDry = productAsset('8012/8012-quick-wash-dry.png');

const wm8010CopyEn = {
  name: 'Hisense 8010 Washing Machine',
  tagline: 'Smart digital display with flexible programs and 1000 rpm spin.',
  description:
    'The 8010 series delivers efficient 8 kg washing with intelligent controls, fast cycles, and safety features for daily laundry.',
  highlights: [
    'Smart digital display with backup memory.',
    'Separate hot and cold water inlets.',
    'Max spin speed up to 1000 rpm.',
    '15 auto programs plus 5 selectable options.',
    'Anti-foam sensor and balance control.',
    'Time Delay scheduling for convenient washes.',
    '95 C antibacterial wash program.',
    'Child lock for added safety.',
    'Automatic self-diagnostic for quick checks.',
  ],
  blocks: {
    featureIntro: {
      title: 'Smart Control, Everyday Ease',
      text: '8010D - 8010DS',
    },
    masterMoment: {
      title: 'Built for Confident Laundry',
    },
    quickWash: {
      title: 'Quick Wash',
      text: 'Quick Wash shortens cycle time for smaller loads while maintaining a thorough clean.',
    },
    stains: {
      title: 'Never Worry About Stains',
      text: '15 automatic programs and 5 selectable options help match fabrics and remove everyday stains with ease.',
    },
    selfDiagnostic: {
      title: 'Self Diagnostic',
      text: 'In the rare event of a malfunction, the self-diagnostic tools will notify you with an error code that you can easily find in the user manual. This makes troubleshooting quick and convenient, saving you time and stress, and ensures both you and your appliance are safe and secure.',
    },
  },
};

const wm8010CopyFa = {
  name: 'ماشین لباسشویی هایسنس 8010',
  tagline: 'نمایشگر دیجیتال هوشمند با برنامه‌های متنوع و دور خشک‌کن 1000.',
  description:
    'سری 8010 با ظرفیت 8 کیلوگرم، کنترل‌های هوشمند، شستشوی سریع و امکانات ایمنی برای شستشوی روزمره طراحی شده است.',
  highlights: [
    'نمایشگر دیجیتال هوشمند با حافظه پشتیبان.',
    'ورودی مجزای آب سرد و گرم.',
    'حداکثر دور خشک‌کن 1000 دور در دقیقه.',
    '15 برنامه اتوماتیک و 5 حالت انتخابی.',
    'سنسور ضد کف و کنترل تعادل دستگاه.',
    'تاخیر در زمان شستشو (Time Delay).',
    'برنامه ضد باکتری 95 درجه سانتی‌گراد.',
    'قفل کودک برای امنیت بیشتر.',
    'تشخیص ایراد خودکار دستگاه.',
  ],
  blocks: {
    featureIntro: {
      title: 'کنترل هوشمند، شستشوی آسان',
      text: '8010D - 8010DS',
    },
    masterMoment: {
      title: 'برای شستشویی مطمئن و سریع',
    },
    quickWash: {
      title: 'شستشوی سریع',
      text: 'شستشوی سریع برای روزهای پرمشغله طراحی شده است و با کاهش زمان چرخه، تمیزی کامل را برای بارهای کوچک تا متوسط فراهم می‌کند.',
    },
    stains: {
      title: 'نگران لکه‌ها نباشید',
      text: 'با 15 برنامه اتوماتیک و 5 حالت انتخابی، چرخه مناسب برای انواع پارچه‌ها و لکه‌های روزمره را انتخاب کنید و نتیجه‌ای یکنواخت بگیرید.',
    },
    selfDiagnostic: {
      title: 'تشخیص ایراد خودکار',
      text: 'در صورت بروز نقص، سیستم خودعیب‌یاب با نمایش کد خطا شما را مطلع می‌کند؛ کدی که به‌راحتی در دفترچه راهنما پیدا می‌شود. این کار عیب‌یابی را سریع و آسان می‌کند، زمان و استرس را کاهش می‌دهد و امنیت شما و دستگاه را تضمین می‌کند.',
    },
  },
};

const wm8012CopyEn = {
  name: 'Hisense 8012 Washing Machine',
  tagline: 'Smart digital display with flexible programs and 1200 rpm spin.',
  description:
    'The 8012 series delivers efficient 8 kg washing with smart controls, quick cycles, and safety features for everyday laundry.',
  highlights: [
    'Smart digital display with backup memory.',
    'Separate hot and cold water inlets.',
    'Max spin speed up to 1200 rpm.',
    '15 auto programs plus 5 selectable options.',
    'Anti-foam sensor and balance control.',
    'Time Delay scheduling for convenient washes.',
    '95 C antibacterial wash program.',
    'Child lock and automatic self-diagnostic.',
  ],
  blocks: {
    featureIntro: {
      title: 'Smart Control, Everyday Ease',
      text: '8012D - 8012DS',
    },
    masterMoment: {
      title: 'Built for Confident Laundry',
    },
    quickWash: {
      title: 'Quick Wash',
      text: 'Designed for busy days, Quick Wash shortens cycle time while still delivering a thorough clean for small to medium loads.',
    },
    allergySteam: {
      title: 'ALLERGY STEAM',
      text: 'At the start of the washing cycle, the steam function releases penetrating steam that eliminates 99.9% of allergens and microbes, keeping your clothes clean and your skin protected.',
    },
    stains: {
      title: 'Never Worry About Stains',
      text: 'Choose from 15 automatic programs and 5 selectable options to match fabric types and remove everyday stains with consistent results.',
    },
    selfDiagnostic: {
      title: 'Self Diagnostic',
      text: 'In the rare event of a malfunction, the self-diagnostic tools will notify you with an error code that you can easily find in the user manual. This makes troubleshooting quick and convenient, saving you time and stress, and ensures both you and your appliance are safe and secure.',
    },
    quickWashDry: {
      title: 'Quick Wash & Dry',
      text: 'Pair fast wash options with high-speed spinning to reduce moisture and get laundry ready sooner, with timing that fits your schedule.',
    },
  },
};

const wm8012CopyFa = {
  name: 'ماشین لباسشویی هایسنس 8012',
  tagline: 'نمایشگر دیجیتال هوشمند با برنامه‌های متنوع و دور خشک‌کن 1200.',
  description:
    'سری 8012 با ظرفیت 8 کیلوگرم، کنترل‌های هوشمند، شستشوی سریع و امکانات ایمنی برای شستشوی روزمره طراحی شده است.',
  highlights: [
    'نمایشگر دیجیتال هوشمند با حافظه پشتیبان.',
    'ورودی مجزای آب سرد و گرم.',
    'حداکثر دور خشک‌کن 1200 دور در دقیقه.',
    '15 برنامه اتوماتیک و 5 حالت انتخابی.',
    'سنسور ضد کف و کنترل تعادل دستگاه.',
    'تاخیر در زمان شستشو (Time Delay).',
    'برنامه ضد باکتری 95 درجه سانتی‌گراد.',
    'قفل کودک و تشخیص ایراد خودکار دستگاه.',
  ],
  blocks: {
    featureIntro: {
      title: 'کنترل هوشمند، شستشوی آسان',
      text: '8012D - 8012DS',
    },
    masterMoment: {
      title: 'برای شستشویی مطمئن و سریع',
    },
    quickWash: {
      title: 'شستشوی سریع',
      text: 'شستشوی سریع برای روزهای پرمشغله طراحی شده است و با کاهش زمان چرخه، تمیزی کامل را برای بارهای کوچک تا متوسط فراهم می‌کند.',
    },
    allergySteam: {
      title: 'بخار ضد حساسیت',
      text: 'در ابتدای چرخه شستشو، بخار نفوذی آزاد می‌شود و 99.9٪ از آلرژن‌ها و میکروب‌ها را از بین می‌برد تا لباس‌ها تمیز و پوست شما محافظت شود.',
    },
    stains: {
      title: 'نگران لکه‌ها نباشید',
      text: 'با 15 برنامه اتوماتیک و 5 حالت انتخابی، چرخه مناسب برای انواع پارچه‌ها و لکه‌های روزمره را انتخاب کنید و نتیجه‌ای یکنواخت بگیرید.',
    },
    selfDiagnostic: {
      title: 'تشخیص ایراد خودکار',
      text: 'در صورت بروز نقص، سیستم خودعیب‌یاب با نمایش کد خطا شما را مطلع می‌کند؛ کدی که به‌راحتی در دفترچه راهنما پیدا می‌شود. این کار عیب‌یابی را سریع و آسان می‌کند، زمان و استرس را کاهش می‌دهد و امنیت شما و دستگاه را تضمین می‌کند.',
    },
    quickWashDry: {
      title: 'شستشوی سریع و آبگیری',
      text: 'با ترکیب گزینه‌های شستشوی سریع و دور خشک‌کن بالا، رطوبت لباس‌ها کمتر می‌شود و آماده‌سازی آن‌ها سریع‌تر انجام می‌گیرد.',
    },
  },
};

export const WM_PRODUCTS: WmProduct[] = [
  {
    id: '8010',
    sku: '8010',
    sizes: ['White', 'Silver'],
    series: '8010',
    seriesLabel: '8010 Series Washing Machine',
    extras: ['Quick Wash', 'Time Delay', 'Self Diagnostic'],
    image: wm8010HeroWhite,
    gallery: [
      wm8010HeroWhite,
      wm8010HeroSilver,
      wm8010GalleryWhiteB,
      wm8010GallerySilverB,
      wm8010GalleryWhiteC,
      wm8010GallerySilverC,
    ],
    banners: [
      {
        id: '8010-banner',
        desktop: wm8010HeroWhite,
        alt: 'Hisense 8010 washing machine',
      },
    ],
    featureCards: [
      {
        title: 'Quick Wash',
        description: 'Fast wash cycles for busy days.',
        image: quickWashLogo,
      },
      {
        title: 'Self Diagnostic',
        description: 'Automatic checks help identify issues quickly.',
        image: selfDiagnosticLogo,
      },
    ],
    contentSections: [
      {
        image: wm8012QuickWash,
        copyKey: 'quickWash',
      },
      {
        image: wm8012Stains,
        copyKey: 'stains',
      },
      {
        image: wm8012SelfDiagnostic,
        copyKey: 'selfDiagnostic',
      },
    ],
    specs: {
      en: [
        'Smart digital display.',
        'Separate hot and cold water inlet.',
        'Max spin speed: 1000 rpm.',
        'Backup memory.',
        'Anti-foam sensor.',
        'Balance control system.',
        'Time Delay scheduling.',
        '15 auto programs + 5 selectable options.',
        'Child lock for extra safety.',
        '95 C antibacterial wash program.',
        'Super quick wash.',
        'Automatic self-diagnostic.',
        'Color options: White / Silver.',
        'Capacity: 8 kg.',
        'Weight: 72 kg.',
        'Dimensions (cm): W 60 x D 60 x H 85.',
      ],
      fa: [
        'صفحه نمایش دیجیتالی هوشمند.',
        'ورودی شیر آب سرد و گرم مجزا.',
        'ماکزیمم دور انتخابی 1000 دور.',
        'دارای حافظه پشتیبان.',
        'سنسور ضد کف (ازدیاد کف شستشو).',
        'کنترل تعادل دستگاه.',
        'تاخیر در زمان شستشو (Time Delay) جهت صرفه جویی در وقت.',
        '15 برنامه اتوماتیک و 5 حالت انتخابی جهت شستشوی آسان شما.',
        'قفل کودک جهت امنیت بیشتر برای کودکان.',
        'برنامه شستشوی ضد باکتری 95 درجه سانتی گراد.',
        'شستشوی خیلی تند.',
        'تشخیص ایراد دستگاه بصورت خودکار.',
        'رنگ: سفید / سیلور.',
        'ظرفیت دستگاه (kg): 8.',
        'وزن (kg): 72.',
        'ابعاد (cm): عمق 60، پهنا 60، ارتفاع 85.',
      ],
    },
    copy: {
      en: wm8010CopyEn,
      fa: wm8010CopyFa,
    },
  },
  {
    id: '8012',
    sku: '8012',
    sizes: ['White', 'Silver'],
    series: '8012',
    seriesLabel: '8012 Series Washing Machine',
    extras: ['Quick Wash', '1200 rpm', 'Self Diagnostic', 'Time Delay'],
    image: wm8012HeroWhite,
    gallery: [
      wm8012HeroWhite,
      wm8012HeroSilver,
      wm8012GalleryWhiteB,
      wm8012GallerySilverB,
      wm8012GalleryWhiteC,
      wm8012GallerySilverC,
    ],
    banners: [
      {
        id: '8012-banner',
        desktop: wm8012HeroWhite,
        alt: 'Hisense 8012 washing machine',
      },
    ],
    featureCards: [
      {
        title: 'Quick Wash',
        description: 'Super quick wash for faster laundry days.',
        image: quickWashLogo,
      },
      {
        title: 'Self Diagnostic',
        description: 'Automatic checks help identify issues quickly.',
        image: selfDiagnosticLogo,
      },
    ],
    contentSections: [
      {
        image: wm8012QuickWash,
        copyKey: 'quickWash',
      },
      {
        image: wm8012AllergySteam,
        copyKey: 'allergySteam',
      },
      {
        image: wm8012Stains,
        copyKey: 'stains',
      },
      {
        image: wm8012SelfDiagnostic,
        copyKey: 'selfDiagnostic',
      },
    ],
    stackedSections: [
      {
        image: wm8012QuickWashDry,
        copyKey: 'quickWashDry',
      },
    ],
    specs: {
      en: [
        'Smart digital display.',
        'Separate hot and cold water inlet.',
        'Max spin speed: 1200 rpm.',
        'Backup memory.',
        'Anti-foam sensor.',
        'Balance control system.',
        'Time Delay scheduling.',
        '15 auto programs + 5 selectable options.',
        'Child lock for extra safety.',
        '95 C antibacterial wash program.',
        'Super quick wash.',
        'Automatic self-diagnostic.',
        'Color options: White / Silver.',
        'Capacity: 8 kg.',
        'Weight: 73 kg.',
        'Dimensions (cm): W 60 x D 60 x H 85.',
      ],
      fa: [
        'صفحه نمایش دیجیتالی هوشمند.',
        'ورودی شیر آب سرد و گرم مجزا.',
        'ماکزیمم دور انتخابی 1200 دور.',
        'دارای حافظه پشتیبان.',
        'سنسور ضد کف (ازدیاد کف شستشو).',
        'کنترل تعادل دستگاه.',
        'تاخیر در زمان شستشو (Time Delay) جهت صرفه جویی در وقت.',
        '15 برنامه اتوماتیک و 5 حالت انتخابی جهت شستشوی آسان شما.',
        'قفل کودک جهت امنیت بیشتر برای کودکان.',
        'برنامه شستشوی ضد باکتری 95 درجه سانتی گراد.',
        'شستشوی خیلی تند.',
        'تشخیص ایراد دستگاه بصورت خودکار.',
        'رنگ: سفید / سیلور.',
        'ظرفیت دستگاه (kg): 8.',
        'وزن (kg): 73.',
        'ابعاد (cm): عمق 60، پهنا 60، ارتفاع 85.',
      ],
    },
    copy: {
      en: wm8012CopyEn,
      fa: wm8012CopyFa,
    },
  },
];
