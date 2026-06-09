import { mediaUrl } from '@/lib/mediaUrl';
import { type TvFeatureCard, type TvProduct } from '@/types/tv';

// Bundled refrigerator catalog used when a database is not available.
const productAsset = (path: string) => mediaUrl(`/products/refrigerator/${path}`);
const logoAsset = (path: string) => mediaUrl(`/products/refrigerator/logos/${path}`);

// SBS-650
const sbs650FeatureCards = [
  {
    title: 'ICE & WATER DISPENSER',
    description: 'Plenty of Ice and Water',
    image: logoAsset('sbs-650/1-ice-water-dispencer-icon-lg.png'),
  },
  {
    title: 'INDEPENDENT FRIDGE AND FREEZER ZONE',
    description: 'Staying fresh for longer',
    image: logoAsset('sbs-650/2-independent-zones-icon-lg.png'),
  },
  {
    title: 'SELF-CLOSING SYSTEM',
    description: 'Door close automatically',
    image: logoAsset('sbs-650/4-self-closing-icon-lg.png'),
  },
  {
    title: 'MULTI-AIR FLOW',
    description: 'Constant temp keeps things fresh',
    image: logoAsset('sbs-650/5-multi-air-flow-icon-lg.png'),
  },
  {
    title: 'DIGITAL SENSORS',
    description: 'Always right, always optimal',
    image: logoAsset('sbs-650/6-digital-sensors-icon-lg.png'),
  },
];

// RFT-560
const rft560FeatureCards = [
  {
    title: 'SLEEK WATER DISPENSER',
    description: 'Sleek water dispenser',
    image: logoAsset('rft-560/1-sleek-water-dispenser-icon.png'),
  },
  {
    title: 'DURABLE INVERTER',
    description: 'Durable inverter',
    image: logoAsset('rft-560/2-durable-inverter-icon.png'),
  },
  {
    title: 'TOTAL NO FROST',
    description: 'Total no frost',
    image: logoAsset('rft-560/3-total-no-frost-icon.png'),
  },
  {
    title: 'MULTI AIR FLOW',
    description: 'Multi air flow',
    image: logoAsset('rft-560/5-multiair-flow.png'),
  },
  {
    title: 'ELECTRONIC TOUCH CONTROL',
    description: 'Electronic touch control',
    image: logoAsset('rft-560/6-electronic-touch-control.png'),
  },
  {
    title: 'SOFT LED LIGHTING',
    description: 'Soft LED lighting',
    image: logoAsset('rft-560/7-soft-led-lighting.png'),
  },
  {
    title: 'SUPER FREEZE',
    description: 'Super freeze',
    image: logoAsset('rft-560/8-super-freeze.png'),
  },
];

// RFC-500
const rfc500FeatureCards: TvFeatureCard[] = [
  {
    title: 'PREMIUM FLAT DOOR DESIGN',
    description: 'Designed with attention to details',
    image: logoAsset('rfc-500/1-premium-flat-door-icon.png'),
  },
  {
    title: 'BIG CAPACITY',
    description: 'Big capacity for more storage space',
    image: logoAsset('rfc-500/2-big-capacity-icon.png'),
    layout: 'inline',
  },
  {
    title: 'METAL COOLING',
    description: 'Cool air in every corner',
    image: logoAsset('rfc-500/3-metal-cooling-icon.png'),
  },
  {
    title: 'MICRO VENTS TECHNOLOGY',
    description: 'Same temperature on every shelf',
    image: logoAsset('rfc-500/4-micro-vents-technology-icon.png'),
  },
  {
    title: 'DURABLE INVERTER',
    description: 'For energy savings and longer lifespan',
    image: logoAsset('rfc-500/5-durable-inverter-icon.png'),
  },
  {
    title: 'MOISTURE FRESH CRISPER',
    description: 'Keep your produce fresh',
    image: logoAsset('rfc-500/6-moisture-fresh-crisper-icon.png'),
  },
  {
    title: 'SLEEK WATER DISPENSER',
    description: 'Always refreshed',
    image: logoAsset('rfc-500/7-sleek-water-dispenser-icon.png'),
  },
];

// RFC-300
const rfc300FeatureCards: TvFeatureCard[] = [
  {
    title: 'TOTAL NO FROST',
    description: 'No frost, anywhere - ever!',
    image: logoAsset('rfc-300/1-total-no-frost-icon.png'),
  },
  {
    title: 'SOFT LED LIGHTING',
    description: 'Wherever you look, it looks good',
    image: logoAsset('rfc-300/2-soft-led-lighting-icon.png'),
  },
  {
    title: 'SLIM WATER DISPENSER',
    description: 'A fresh cup of water, always on hand',
    image: logoAsset('rfc-300/3-slim-water-dispenser-icon.png'),
  },
  {
    title: 'TEMPERED GLASS SHELVES',
    description: 'Large loads require tougher materials',
    image: logoAsset('rfc-300/4-tempered-glass-shelves-icon.png'),
  },
  {
    title: 'MICRO VENTS COOLING',
    description: 'Multiple shelves, one temperature',
    image: logoAsset('rfc-300/5-micro-vents-cooling-icon.png'),
  },
  {
    title: 'FRESH BOX',
    description: 'The ideal home for meat and fish',
    image: logoAsset('rfc-300/6-fresh-box-icon.png'),
  },
  {
    title: 'MOISTURE FRESH CRISPER',
    description: 'Perfect humidity, longer freshness',
    image: logoAsset('rfc-300/7-moisture-fresh-crisper-icon.png'),
  },
  {
    title: 'SUPER FREEZE',
    description: 'Get the most out of your food',
    image: logoAsset('rfc-300/8-super-freeze-icon.png'),
  },
  {
    title: 'PRECISE ELECTRONIC CONTROL',
    description: 'Take complete control',
    image: logoAsset('rfc-300/9-precise-electronic-control-icon.png'),
  },
  {
    title: 'REVERSIBLE DOOR',
    description: 'Have it your way',
    image: logoAsset('rfc-300/10-reversible-door-icon.png'),
  },
  {
    title: 'LOW NOISE',
    description: 'Enjoy a quieter home',
    image: logoAsset('rfc-300/11-low-noise-icon.png'),
  },
  {
    title: 'EASY-TO-USE DRAWER',
    description: 'Never a struggle',
    image: logoAsset('rfc-300/12-easy-to-use-drawer-icon.png'),
  },
  {
    title: 'EASY OPEN DRAWER',
    description: 'Easy access to your frozen goods',
    image: logoAsset('rfc-300/13-easy-open-drawer-icon.png'),
  },
];

// RS-370
const rs370FeatureCards: TvFeatureCard[] = [
  {
    title: 'EASY-OPEN DOOR HANDLE',
    description: 'Opens effortlessly',
    image: logoAsset('rs-370/1-easy-open-door-handle-icon.png'),
  },
  {
    title: 'FRESH CRISPER',
    description: 'The fresh zone storage area',
    image: logoAsset('rs-370/2-fresh-crisper-icon.png'),
  },
  {
    title: 'FULL WIDTH AIRFLOW',
    description: 'Constant temperature keeps things fresh',
    image: logoAsset('rs-370/3-full-width-airflow-icon.png'),
  },
  {
    title: 'LED LIGHTING',
    description: 'Clear overview',
    image: logoAsset('rs-370/4-LED-lighting-icon.png'),
  },
  {
    title: 'PURE APPEARANCE',
    description: 'Modern design with attention to details',
    image: logoAsset('rs-370/5-pure-appearance-icon.png'),
  },
  {
    title: 'SLEEK WATER DISPENSER',
    description: 'Always refreshed',
    image: logoAsset('rs-370/6-sleek-water-dispenser-icon.png'),
  },
  {
    title: 'REVERSIBLE DOOR',
    description: 'Open and closed, your way',
    image: logoAsset('rs-370/7-reversible-door-icon.png'),
  },
  {
    title: 'SUPER COOL',
    description: 'Powerful cooling',
    image: logoAsset('rs-370/8-super-cool-icon.png'),
  },
];

// FS-270
const fs270FeatureCards: TvFeatureCard[] = [
  {
    title: 'TOTAL NO FROST',
    description: 'No frost, anywhere - ever!',
    image: logoAsset('fs-270/1-total-no-frost-icon.png'),
  },
  {
    title: 'SUPER FREEZE',
    description: 'Quick freeze to lock original flavour',
    image: logoAsset('fs-270/2-super-freeze-icon.png'),
  },
  {
    title: 'ADJUSTABLE LEGS',
    description: 'Stable placement on uneven ground',
    image: logoAsset('fs-270/3-adjustable-legs-icon.jpg'),
  },
  {
    title: 'LED DISPLAY',
    description: 'Easy to read, easy to use',
    image: logoAsset('fs-270/4-LED-display-icon.png'),
  },
  {
    title: 'PREMIUM APPEARANCE',
    description: 'Designed with attention to details',
    image: logoAsset('fs-270/5-premium-appearance-icon.png'),
  },
  {
    title: 'REVERSIBLE DOOR',
    description: 'Open and closed, your way',
    image: logoAsset('fs-270/6-reversible-door-icon.png'),
  },
  {
    title: 'LOW NOISE',
    description: 'Enjoy A Quieter Life',
    image: logoAsset('fs-270/7-low-noise-icon.png'),
  },
];

// FC-210
const fc210FeatureCards: TvFeatureCard[] = [
  {
    title: 'SUPER FREEZE',
    description: 'Quick freezing performance',
    image: logoAsset('fc-210/1-super-freeze-icon.png'),
  },
  {
    title: 'MY FRESH CHOICE',
    description: 'Flexible temperature setting',
    image: logoAsset('fc-210/2-my-fresh-choice-icon.png'),
  },
  {
    title: 'KEEP FOR 135H',
    description: 'Temperature retention after power-off',
    image: logoAsset('fc-210/3-keep-for-135H-icon.png'),
  },
  {
    title: '360° COOLING',
    description: 'Efficient heat exchange',
    image: logoAsset('fc-210/4-360-cooling-icon.png'),
  },
  {
    title: 'ULTRATHIN HINGES',
    description: 'Place closer to the wall',
    image: logoAsset('fc-210/5-ultrathin-hinges-icon.png'),
  },
  {
    title: 'BIG CAPACITY',
    description: 'Large internal storage volume',
    image: logoAsset('fc-210/6-big-capacity-icon.png'),
  },
  {
    title: 'SLIDING BASKET',
    description: 'Easy lifting and storage',
    image: logoAsset('fc-210/7-sliding-basket-icon.png'),
  },
];

// FC-310
const fc310FeatureCards: TvFeatureCard[] = [
  {
    title: 'PREMIUM BOUNDLESS DOOR',
    description: 'Minimalist modern design',
    image: logoAsset('fc-310/2-premium-boundless-door-icon.png'),
  },
  {
    title: 'SLIDING BASKET',
    description: 'Easy lifting and storage',
    image: logoAsset('fc-310/3-sliding-basket-icon.png'),
  },
  {
    title: 'ULTRATHIN HINGES',
    description: 'Place closer to the wall',
    image: logoAsset('fc-310/4-ultrathin-hinges-icon.png'),
  },
  {
    title: 'MY FRESH CHOICE',
    description: 'Flexible temperature setting',
    image: logoAsset('fc-310/5-my-fresh-choice-icon.svg'),
  },
  {
    title: 'HOVERING DOOR',
    description: 'Hands-free loading',
    image: logoAsset('fc-310/6-hovering-door-icon.svg'),
  },
  {
    title: 'MECHANICAL TEMPERATURE CONTROL',
    description: 'Durable and easy operation',
    image: logoAsset('fc-310/7-mechanical-temperature-control-icon.png'),
  },
  {
    title: 'SUPER FREEZE',
    description: 'Powerful rapid freezing',
    image: logoAsset('fc-310/8-super-freeze-icon.svg'),
  },
];

// SBS-650
const sbs650Hero = productAsset('sbs-650/Sbs-650-1.jpg');
const sbs650Poster = productAsset('sbs-650/Sbs-650-2.jpg');
const sbs650Gallery = [
  productAsset('sbs-650/Sbs-650-1.jpg'),
  productAsset('sbs-650/Sbs-650-2.jpg'),
  productAsset('sbs-650/Sbs-650-3.jpg'),
  productAsset('sbs-650/Sbs-650-4.jpg'),
];

// RFT-560
const rft560Hero = productAsset('rft-560/rft-560-2.png');
const rft560Poster = productAsset('rft-560/rft-560-3.png');
const rft560Gallery = [
  productAsset('rft-560/rft-560-2.png'),
  productAsset('rft-560/rft-560-3.png'),
  productAsset('rft-560/rft-560-4.png'),
  productAsset('rft-560/rft-560-5.png'),
];
const rft560Banner = productAsset('rft-560/top-page-banner.png');

// RFC-500
const rfc500Hero = productAsset('rfc-500/rfc-500-1.png');
const rfc500Poster = productAsset('rfc-500/rfc-500-2.png');
const rfc500Gallery = [
  productAsset('rfc-500/rfc-500-1.png'),
  productAsset('rfc-500/rfc-500-2.png'),
  productAsset('rfc-500/rfc-500-3.png'),
  productAsset('rfc-500/rfc-500-4.png'),
  productAsset('rfc-500/rfc-500-5.png'),
];

// RFC-300
const rfc300Hero = productAsset('rfc-300/rfc-300-1.png');
const rfc300Poster = productAsset('rfc-300/rfc-300-2.png');
const rfc300Gallery = [
  productAsset('rfc-300/rfc-300-1.png'),
  productAsset('rfc-300/rfc-300-2.png'),
  productAsset('rfc-300/rfc-300-3.png'),
  productAsset('rfc-300/rfc-300-4.png'),
  productAsset('rfc-300/rfc-300-5.png'),
];

// RS-370
const rs370Hero = productAsset('rs-370/rs-370-1-lg.png');
const rs370Poster = productAsset('rs-370/rs-370-2-lg.png');
const rs370Gallery = [
  productAsset('rs-370/rs-370-1-lg.png'),
  productAsset('rs-370/rs-370-2-lg.jpg'),
  productAsset('rs-370/rs-370-3-lg.jpg'),
  productAsset('rs-370/rs-370-4-lg.jpg'),
  productAsset('rs-370/rs-370-5-lg.jpg'),
  productAsset('rs-370/rs-370-6-lg.jpg'),
  productAsset('rs-370/rs-370-7-lg.jpg'),
  productAsset('rs-370/rs-370-8-lg.jpg'),
];

// FS-270
const fs270Hero = productAsset('fs-270/fs-270-1-lg.jpg');
const fs270Poster = productAsset('fs-270/fs-270-2-lg.jpg');
const fs270Gallery = [
  productAsset('fs-270/fs-270-1-lg.jpg'),
  productAsset('fs-270/fs-270-2-lg.jpg'),
  productAsset('fs-270/fs-270-3-lg.jpg'),
  productAsset('fs-270/fs-270-4-lg.jpg'),
  productAsset('fs-270/fs-270-5-lg.jpg'),
  productAsset('fs-270/fs-270-6-lg.jpg'),
  productAsset('fs-270/fs-270-7-lg.jpg'),
  productAsset('fs-270/fs-270-8-lg.jpg'),
  productAsset('fs-270/fs-270-9-lg.jpg'),
];

// FC-210
const fc210Hero = productAsset('fc-210/fc-210-1.jpg');
const fc210Poster = productAsset('fc-210/fc-210-2.jpg');
const fc210Gallery = [productAsset('fc-210/fc-210-1.jpg'), productAsset('fc-210/fc-210-2.jpg')];

// FC-310
const fc310Hero = productAsset('fc-310/fc-310-1.png');
const fc310Poster = productAsset('fc-310/fc-310-2.png');
const fc310Gallery = [
  productAsset('fc-310/fc-310-1.png'),
  productAsset('fc-310/fc-310-2.png'),
  productAsset('fc-310/fc-310-3.png'),
  productAsset('fc-310/fc-310-4.png'),
];

// SBS-650
const sbs650CopyEn = {
  name: 'Hisense SBS-650 Side-by-Side Refrigerator',
  tagline: 'Ice & water dispenser, independent cooling, and multi-air flow freshness.',
  description:
    'SBS-650 pairs an ice and water dispenser with independent fridge/freezer cooling, multi-air flow circulation, self-closing doors, and digital sensors for consistently fresh storage.',
  highlights: [
    'Ice and water dispenser with multiple serving options.',
    'Independent fridge/freezer cooling for longer freshness.',
    'Self-closing doors up to 15° open angle.',
    'Multi-air flow keeps temperature consistent.',
    'Five digital sensors optimize cooling performance.',
  ],
  blocks: {
    featureIntro: {
      title: 'Premium Side-by-Side Experience',
      text: 'SBS-650',
    },
    masterMoment: {
      title: 'Designed for modern kitchens and real-life storage needs.',
    },
    iceWaterDispenser: {
      title: 'ICE & WATER DISPENSER',
      text: 'Plenty of Ice and Water. Equipped with an ice and water dispenser, which can produce ice and water per day. The ice is enough to satisfy the entire family. You can choose from ice cubes, crushed ice and cooled water all at the push of a button.',
    },
    independentZones: {
      title: 'INDEPENDENT FRIDGE AND FREEZER ZONE',
      text: 'Staying fresh for longer. The independent temp system control cools the fridge and freezer separately, so it maintains a high humidity level in the fridge and ingredients stay fresher for longer.',
    },
    selfClosingSystem: {
      title: 'SELF-CLOSING SYSTEM',
      text: 'Door close automatically. The door is supposed to close automatically even when the door opens up to 15°.',
    },
    multiAirFlow: {
      title: 'MULTI-AIR FLOW',
      text: 'Constant temp keeps things fresh. Thanks to the even distribution of cold air achieved by the Hisense Multi Air Flow System, an optimum temperature is consistently maintained throughout your fridge freezer - keeping food chilled to perfection no matter where it is placed.',
    },
    digitalSensors: {
      title: 'DIGITAL SENSORS',
      text: 'Always right, always optimal. Five high-effective Digital Temp Sensors are built in the refrigerator, as shown in the picture, which are engineered to adjust cooling.',
    },
  },
};

const sbs650CopyFa = {
  name: 'یخچال ساید‌بای‌ساید هایسنس SBS-650',
  tagline: 'آبریز و یخ‌ساز، سرمایش مستقل و تازگی با جریان هوای چندگانه.',
  description:
    'یخچال ساید‌بای‌ساید هایسنس SBS-650 با آبریز و یخ‌ساز، سرمایش مستقل یخچال و فریزر، سیستم Multi Air Flow و سنسورهای دیجیتال هوشمند، دمایی پایدار و تازگی طولانی‌ مدت مواد غذایی را تضمین می‌کند.',
  highlights: [
    'آبریز و یخ‌ساز با امکان انتخاب چند حالت سرو.',
    'سرمایش مستقل یخچال و فریزر برای حفظ تازگی طولانی‌تر.',
    'درهای خودبسته‌شونده تا زاویه بازشدگی ۱۵ درجه.',
    'سیستم Multi Air Flow برای یکنواختی دما در تمام فضا.',
    'پنج سنسور دیجیتال برای کنترل دقیق و هوشمند سرمایش.',
  ],
  blocks: {
    featureIntro: {
      title: 'تجربه‌ای پریمیوم از یخچال ساید‌بای‌ساید',
      text: 'SBS-650',
    },
    masterMoment: {
      title: 'طراحی‌شده برای آشپزخانه‌های مدرن و نیازهای واقعی نگهداری مواد غذایی.',
    },
    iceWaterDispenser: {
      title: 'آبریز و یخ‌ساز',
      text: 'آب و یخ همیشه در دسترس. این یخچال به آبریز و یخ‌ساز مجهز است که روزانه حجم کافی آب و یخ برای کل خانواده فراهم می‌کند. تنها با فشردن یک دکمه می‌توانید بین یخ قالبی، یخ خردشده و آب خنک انتخاب کنید.',
    },
    independentZones: {
      title: 'سرمایش مستقل یخچال و فریزر',
      text: 'تازگی ماندگارتر. سیستم کنترل دمای مستقل، یخچال و فریزر را به‌صورت جداگانه خنک می‌کند؛ در نتیجه رطوبت مناسب در یخچال حفظ شده و مواد غذایی برای مدت طولانی‌تری تازه می‌مانند.',
    },
    selfClosingSystem: {
      title: 'سیستم بسته‌شدن خودکار در',
      text: 'بسته‌شدن مطمئن و هوشمند. حتی اگر درها تا زاویه ۱۵ درجه باز بمانند، به‌صورت خودکار و آرام بسته می‌شوند.',
    },
    multiAirFlow: {
      title: 'سیستم Multi Air Flow',
      text: 'دمای یکنواخت برای تازگی بیشتر. سیستم Multi Air Flow هایسنس با توزیع یکنواخت هوای سرد، دمایی پایدار در سراسر یخچال فریزر ایجاد می‌کند تا مواد غذایی در هر طبقه‌ای به‌خوبی خنک بمانند.',
    },
    digitalSensors: {
      title: 'سنسورهای دیجیتال',
      text: 'همیشه دقیق، همیشه بهینه. پنج سنسور دیجیتال پیشرفته به‌طور مداوم دمای داخلی را پایش کرده و عملکرد سرمایش را برای حفظ شرایط ایده‌آل تنظیم می‌کنند.',
    },
  },
};

// RFT-560
const rft560CopyEn = {
  name: 'Hisense RFT-560 Top-Mount Refrigerator',
  tagline: 'Space beyond imagination.',
  description:
    'RFT-560 combines generous capacity with precise cooling, advanced no-frost performance, and flexible storage to keep everything fresh and organized.',
  highlights: [
    'Sleek water dispenser integrated into the flat door.',
    'Durable inverter cooling for stable temperatures and lower energy use.',
    'Total No Frost circulation prevents ice build-up.',
    'Fresh Zone keeps meat and fish at an ideal temperature.',
    'Multi Air Flow distributes cold air evenly.',
  ],
  blocks: {
    featureIntro: {
      title: 'Space beyond imagination',
      text: 'Top-Mount RT Series',
    },
    sleekWaterDispenser: {
      title: 'SLEEK WATER DISPENSER',
      text: 'Our sleek water dispenser seamlessly integrates into the flat door of the refrigerator. Simply fill the water tank with fresh water and enjoy perfectly chilled water anytime.',
    },
    durableInverter: {
      title: 'DURABLE INVERTER',
      text: "Durable Inverter technology adjusts power as needed, keeping your food perfectly chilled while reducing energy consumption. This innovative system saves you money on energy bills and ensures quieter, more stable performance. Enjoy a whisper-quiet kitchen, reduced spending, and a refrigerator that's built to last.",
    },
    totalNoFrost: {
      title: 'TOTAL NO FROST',
      text: "More advanced than traditional frost-free systems, Hisense's innovative Total No Frost Technology circulates cold air throughout the fridge and freezer, preventing ice crystals from forming and eliminating the need for manual defrosting.",
    },
    bigCapacity: {
      title: 'BIG CAPACITY',
      text: 'Enjoy ample storage space in both the fridge and freezer, accommodating any shape or type of food. The doors open wide, providing a clear view of everything at a glance.',
    },
    largeCrisperPlus: {
      title: 'LARGE CRISPER PLUS',
      text: 'The deeper and wider crisper provides ample space to store large quantities of groceries, allowing you to take the supermarket home.',
    },
    premiumDesign: {
      title: 'PREMIUM DESIGN',
      text: 'The premium door and handle, along with the inox panel, perfectly complement this series of refrigerators. They offer a high-quality texture, are easy to clean, and fit seamlessly into any kitchen.',
    },
    counterDepth: {
      title: 'COUNTER DEPTH',
      text: 'The new design of this series, at 600 mm, ensures a perfect fit in your kitchen while offering plenty of flexible storage.',
    },
    freshZone: {
      title: 'FRESH ZONE',
      text: "A separate zone in the upper fridge maintains a constant critical temperature and ideal humidity. This lower temperature zone keeps fish and meat fresh and hygienic for longer, ensuring they are perfectly preserved until it's time to cook.",
    },
    removableTwistIceMaker: {
      title: 'REMOVABLE TWIST ICE MAKER',
      text: 'The detachable Hisense twist ice maker is the perfect accessory for all your small-scale needs. The simple twist feature makes removing the ice from the mold incredibly simple and the dedicated container makes it easy to store.',
    },
    multiAirFlow: {
      title: 'MULTI AIR FLOW',
      text: 'The Multi Air Flow System ensures even distribution of cold air, maintaining an optimal temperature throughout the fridge freezer. This keeps food perfectly chilled, no matter where it is placed.',
    },
    electronicTouchControl: {
      title: 'ELECTRONIC TOUCH CONTROL',
      text: "This user-friendly control lets you easily set the fridge or freezer temperature to suit your food needs. It's clear, easy to reach, and simple to use.",
    },
    softLedLighting: {
      title: 'SOFT LED LIGHTING',
      text: "Illuminate every corner with soft, cool light to help you quickly find food items. The cold light doesn't raise the internal temperature and is environmentally friendly.",
    },
    superFreeze: {
      title: 'SUPER FREEZE',
      text: 'Super Freeze rapidly lowers the freezer temperature, freezing your food faster than usual. This helps lock in the vitamins and nutritional content of food, preserving freshness like when you first bought it and extending the shelf life of your food.',
    },
  },
};

const rft560CopyFa = {
  name: 'یخچال فریزر هایسنس RFT-560',
  tagline: 'فضایی فراتر از تصور.',
  description:
    'یخچال فریزر هایسنس RFT-560 با ظرفیت بالا، سیستم سرمایش دقیق، فناوری بدون برفک کامل و طراحی کاربردی فضای داخلی، تازگی ماندگار و نظم بهتری برای نگهداری روزانه مواد غذایی فراهم می‌کند.',
  highlights: [
    'آبریز شیک و یکپارچه با درِ تخت.',
    'کمپرسور اینورتر بادوام برای دمای پایدار و مصرف انرژی کمتر.',
    'فناوری Total No Frost برای جلوگیری کامل از تشکیل برفک.',
    'Fresh Zone برای نگهداری گوشت و ماهی در دمای ایده‌آل.',
    'سیستم Multi Air Flow برای توزیع یکنواخت هوای سرد.',
  ],
  blocks: {
    featureIntro: {
      title: 'فضایی فراتر از تصور',
      text: 'سری RT با فریزر بالا',
    },
    sleekWaterDispenser: {
      title: 'آبریز شیک',
      text: 'آبریز شیک به‌صورت یکپارچه در درِ تخت یخچال طراحی شده است. تنها با پر کردن مخزن از آب تازه، در هر زمان به آب کاملاً خنک دسترسی خواهید داشت.',
    },
    durableInverter: {
      title: 'کمپرسور اینورتر بادوام',
      text: 'فناوری اینورتر بادوام توان سرمایش را متناسب با نیاز تنظیم می‌کند تا مواد غذایی در دمای ایده‌آل نگهداری شوند و مصرف انرژی کاهش یابد. نتیجه، عملکردی پایدار، صدای بسیار کم و یخچالی با طول عمر بالا است؛ آرامش بیشتر و هزینه کمتر.',
    },
    totalNoFrost: {
      title: 'بدون برفک کامل',
      text: 'فناوری پیشرفته Total No Frost هایسنس با گردش مداوم هوای سرد در یخچال و فریزر، از تشکیل یخ و برفک جلوگیری می‌کند و نیاز به برفک‌زدایی دستی را به‌طور کامل از بین می‌برد.',
    },
    bigCapacity: {
      title: 'ظرفیت بالا',
      text: 'فضای ذخیره‌سازی جادار در یخچال و فریزر، مناسب برای انواع مواد غذایی با هر اندازه و شکلی. بازشوی عریض درها امکان مشاهده کامل محتویات را در یک نگاه فراهم می‌کند.',
    },
    largeCrisperPlus: {
      title: 'کشوی بزرگ Crisper Plus',
      text: 'کشوی عمیق‌تر و عریض‌تر فضای کافی برای نگهداری حجم بالایی از میوه و سبزیجات فراهم می‌کند؛ انگار خرید سوپرمارکت را یکجا به خانه آورده‌اید.',
    },
    premiumDesign: {
      title: 'طراحی پریمیوم',
      text: 'در و دستگیره پریمیوم به‌همراه پنل اینوکس، جلوه‌ای باکیفیت و مدرن به این سری می‌بخشند. سطحی خوش‌ساخت، تمیزکاری آسان و هماهنگی کامل با هر آشپزخانه.',
    },
    counterDepth: {
      title: 'طراحی Counter Depth',
      text: 'طراحی جدید با عمق ۶۰۰ میلی‌متر، نصب کاملاً هم‌سطح با کابینت‌ها را ممکن می‌سازد و در عین حال فضای ذخیره‌سازی کافی و منعطف ارائه می‌دهد.',
    },
    freshZone: {
      title: 'Fresh Zone',
      text: 'ناحیه‌ای مجزا در بخش بالایی یخچال با دمای ثابت و رطوبت ایده‌آل. این بخش با دمای پایین‌تر، گوشت و ماهی را برای مدت طولانی‌تری تازه، بهداشتی و آماده مصرف نگه می‌دارد.',
    },
    removableTwistIceMaker: {
      title: 'یخ‌ساز پیچشی قابل جداسازی',
      text: 'یخ‌ساز پیچشی قابل جداسازی هایسنس، راهکاری ساده و کاربردی برای استفاده روزمره است. با یک پیچش ساده، یخ‌ها به‌راحتی جدا می‌شوند و محفظه اختصاصی، نگهداری آن‌ها را آسان می‌کند.',
    },
    multiAirFlow: {
      title: 'سیستم Multi Air Flow',
      text: 'سیستم Multi Air Flow با توزیع یکنواخت هوای سرد، دمایی ثابت و ایده‌آل را در سراسر یخچال فریزر حفظ می‌کند تا مواد غذایی در هر طبقه به‌خوبی خنک بمانند.',
    },
    electronicTouchControl: {
      title: 'کنترل لمسی الکترونیکی',
      text: 'کنترل لمسی کاربرپسند به شما امکان می‌دهد دمای یخچال و فریزر را به‌سادگی و متناسب با نیاز مواد غذایی تنظیم کنید؛ واضح، در دسترس و آسان.',
    },
    softLedLighting: {
      title: 'نورپردازی LED ملایم',
      text: 'نور LED ملایم و خنک تمام فضای داخلی را روشن می‌کند تا سریع‌تر مواد غذایی را پیدا کنید. این نور بدون افزایش دمای داخلی، کم‌مصرف و دوستدار محیط زیست است.',
    },
    superFreeze: {
      title: 'انجماد سریع',
      text: 'قابلیت Super Freeze با کاهش سریع دمای فریزر، مواد غذایی را سریع‌تر منجمد می‌کند و به حفظ ویتامین‌ها و ارزش غذایی کمک می‌کند؛ تازگی مانند روز اول و ماندگاری بیشتر.',
    },
  },
};

// RFC-500
const rfc500CopyEn = {
  name: 'Hisense RFC-500 French Door Refrigerator',
  tagline: 'Premium flat-door design with advanced cooling and flexible storage.',
  description:
    'RFC-500 combines a premium flat-door design with advanced cooling technologies, big capacity storage, and practical daily convenience.',
  highlights: [
    'Premium flat door design that fits any kitchen.',
    'Big capacity with four wide-opening doors.',
    'Metal Cooling keeps temperature and humidity consistent.',
    'Micro Vents Technology maintains even cooling on every shelf.',
    'Durable inverter for quieter, efficient performance.',
  ],
  blocks: {
    premiumFlatDoor: {
      title: 'PREMIUM FLAT DOOR DESIGN',
      text: 'Designed with attention to details. With its perfect width and flat doors design, this premium flat door refrigerator fits every kitchen. Seamlessly fits into any kitchen. No chance accidental collisions with protruding surfaces. Premium design and feel.',
    },
    bigCapacity: {
      title: 'BIG CAPACITY',
      text: "Big capacity for more storage space. There's plenty of space in the fridge and freezer to store any shape or type of food. It also has four doors that open out wide, so you can see everything at a glance. Better organization and easier to access. Less trips to the store. Everything is more visible.",
    },
    metalCooling: {
      title: 'METAL COOLING',
      text: 'Cool air in every corner. The innovative fridge has multiple air vents that evenly distribute the cool air in every corner of the fridge. In addition, the rear wall of the fridge is covered in metal, ensuring the cool air is distributed evenly from the inside out. The combination of advanced technology guarantees ideal temperature and humidity levels throughout. Even cooling throughout the refrigerator. Good level of humidity control. More consistent temperature control.',
    },
    microVentsTechnology: {
      title: 'MICRO VENTS TECHNOLOGY',
      text: "Same temperature on every shelf. This smart cooling technology maintains even temperature throughout entire fridge. Small vents on the back column and its sides keep a stable environment inside the compartment, so you can simply place your groceries on whatever shelf you'd like. However, drawers for meat and fresh produce have specially dedicated temperature to keep them fresh for longer. Even cooling throughout the fridge. Locks in nutrients in food faster. Keeps food fresh longer.",
    },
    durableInverter: {
      title: 'DURABLE INVERTER',
      text: "For energy savings and a longer lasting appliance. Modern inverter compressors measure the conditions inside your fridge and adjust the cooling output accordingly, to ensure a stable temperature, save energy and run quieter, while also extending your appliance's lifespan. More consistent refrigerator temperature. Longer appliance lifespan. Quieter operation.",
    },
    moistureFreshCrisper: {
      title: 'MOISTURE - FRESH CRISPER',
      text: "Keep your produce fresh with just the right humidity. Fruit and vegetable box has a moisture adjustable system, which you regulate manually to meet different food's storage requirements in order to keep it fresh for longer time. Prolonged freshness. Preservation of nutritional properties. Freshly hydrated food.",
    },
    sleekWaterDispenser: {
      title: 'SLEEK WATER DISPENSER',
      text: 'Always refreshed. A sleek water dispenser that seamlessly integrated to the flat door of the refrigerator. Just pour fresh water in the water tank and enjoy it perfectly chilled, anytime. Constantly freshly chilled water. Cool - sleek design. Easy and quick function.',
    },
  },
};

const rfc500CopyFa = {
  name: 'یخچال فریزر هایسنس RFC-500',
  tagline: 'طراحی تخت پریمیوم با سرمایش پیشرفته و فضای ذخیره‌سازی گسترده.',
  description:
    'یخچال فریزر هایسنس RFC-500 با طراحی تخت پریمیوم، فناوری‌های پیشرفته سرمایش، ظرفیت بزرگ و فضای ذخیره‌سازی منعطف، انتخابی ایده‌آل برای نگهداری مدرن، منظم و طولانی‌مدت مواد غذایی است.',
  highlights: [
    'طراحی تخت پریمیوم، هماهنگ با هر سبک آشپزخانه.',
    'ظرفیت بزرگ با چهار درب عریض و بازشوی کامل.',
    'فناوری Metal Cooling برای پایداری دما و رطوبت.',
    'فناوری Micro Vents برای سرمایش یکنواخت در تمام طبقات.',
    'کمپرسور اینورتر بادوام با عملکرد کم‌صدا و کم‌مصرف.',
  ],
  blocks: {
    premiumFlatDoor: {
      title: 'طراحی درِ تخت پریمیوم',
      text: 'طراحی‌شده با دقت به جزئیات. عرض استاندارد و درهای تخت باعث می‌شود این یخچال فریزر به‌راحتی با هر آشپزخانه‌ای هماهنگ شود. بدون بیرون‌زدگی اضافی و بدون احتمال برخورد ناخواسته. ظاهری یکپارچه با حس واقعی پریمیوم.',
    },
    bigCapacity: {
      title: 'ظرفیت بزرگ',
      text: 'فضای ذخیره‌سازی بیشتر برای نیازهای روزمره. یخچال و فریزر فضای کافی برای نگهداری انواع مواد غذایی با هر اندازه و شکلی فراهم می‌کنند. چهار درب با بازشوی عریض امکان مشاهده کامل محتویات را در یک نگاه می‌دهند؛ نظم بهتر، دسترسی آسان‌تر و مراجعه کمتر برای خرید.',
    },
    metalCooling: {
      title: 'فناوری Metal Cooling',
      text: 'سرمایش یکنواخت در تمام فضا. دریچه‌های متعدد، هوای خنک را به‌صورت یکنواخت در همه بخش‌ها پخش می‌کنند و دیواره پشتی فلزی با حفظ سرما، به پایداری دما و رطوبت کمک می‌کند. نتیجه، دمای ثابت‌تر و شرایط ایده‌آل برای نگهداری مواد غذایی است.',
    },
    microVentsTechnology: {
      title: 'فناوری Micro Vents',
      text: 'دمای یکسان در هر طبقه. این فناوری هوشمند با استفاده از دریچه‌های کوچک در ستون پشتی و کناره‌ها، محیطی پایدار در کل یخچال ایجاد می‌کند تا مواد غذایی روی هر طبقه‌ای به‌خوبی نگهداری شوند. کشوهای مخصوص گوشت و میوه و سبزی نیز دارای دمای اختصاصی هستند تا تازگی آن‌ها برای مدت طولانی‌تری حفظ شود.',
    },
    durableInverter: {
      title: 'کمپرسور اینورتر بادوام',
      text: 'صرفه‌جویی در انرژی و طول عمر بیشتر دستگاه. کمپرسور اینورتر هوشمند شرایط داخلی یخچال را تشخیص داده و میزان سرمایش را متناسب با آن تنظیم می‌کند؛ در نتیجه دمایی پایدار، مصرف انرژی کمتر، صدای پایین‌تر و عمر مفید طولانی‌تر فراهم می‌شود.',
    },
    moistureFreshCrisper: {
      title: 'کشوی Moisture Fresh Crisper',
      text: 'رطوبت مناسب برای تازگی بیشتر. کشوی مخصوص میوه و سبزیجات با قابلیت تنظیم دستی رطوبت، شرایط نگهداری متناسب با هر نوع محصول را فراهم می‌کند تا تازگی، طراوت و ارزش غذایی آن‌ها حفظ شود.',
    },
    sleekWaterDispenser: {
      title: 'آبریز شیک',
      text: 'طراوت همیشگی در دسترس. آبریز باریک و شیک به‌صورت یکپارچه در درِ تخت یخچال طراحی شده است. تنها با پر کردن مخزن، در هر زمان به آب خنک و تازه دسترسی دارید؛ ترکیبی از کاربری آسان و طراحی مدرن.',
    },
  },
};

// RFC-300
const rfc300CopyEn = {
  name: 'Hisense RFC-300 Refrigerator',
  tagline: 'Total No Frost freshness with practical daily convenience.',
  description:
    'RFC-300 combines No Frost performance, smart cooling control, and flexible storage features for cleaner organization and longer-lasting freshness.',
  highlights: [
    'Total No Frost eliminates manual defrosting.',
    'Soft LED lighting improves visibility and saves energy.',
    'Slim water dispenser integrated into the flat door.',
    'Micro Vents cooling keeps stable temperature across shelves.',
    'Precise electronic control with ECO, Holiday, and Super Freeze modes.',
  ],
  blocks: {
    totalNoFrost: {
      title: 'TOTAL NO FROST',
      text: 'No frost, anywhere - ever! It keeps food fresh and nutritious for longer while preventing frost build-up in the refrigerator and freezer. No need for manual defrosting, better freshness preservation, and cleaner shelves.',
    },
    softLedLighting: {
      title: 'SOFT LED LIGHTING',
      text: 'Wherever you look, it looks good. The soft LED light gives a clearer view inside the fridge, uses less energy, and creates a warm premium feel. Brighter LED, soft diffusion, and energy-efficient operation.',
    },
    sleekWaterDispenser: {
      title: 'SLIM WATER DISPENSER',
      text: 'A fresh cup of water, always on hand. A sleek 3.5L water dispenser is seamlessly integrated into the flat door. Fill the tank with fresh water and enjoy perfectly chilled water anytime. Portable fresh water storage, seamless integration, and slim design.',
    },
    temperedGlassShelves: {
      title: 'TEMPERED GLASS SHELVES',
      text: 'Large loads require tougher materials. High-quality tempered glass shelves hold heavier loads than standard shelves and are safer in case of breakage. High-quality materials, support for heavier storage, and safer cleaning and maintenance.',
    },
    microVentsTechnology: {
      title: 'MICRO VENTS COOLING',
      text: 'Multiple shelves, one temperature. Small vents on the rear column and sides maintain stable temperature throughout the fridge so groceries can be placed on any shelf. Even cooling, faster nutrient lock-in, and longer freshness.',
    },
    freshBox: {
      title: 'FRESH BOX',
      text: 'The ideal home for meat and fish. The dedicated chilled room drawer keeps a near-freezing temperature and ideal humidity to preserve fish and meat nutrition and freshness for longer.',
    },
    moistureFreshCrisper: {
      title: 'MOISTURE FRESH CRISPER',
      text: 'Perfect humidity, longer freshness. A dedicated fruit and vegetable drawer with adjustable moisture lets you match storage conditions to different foods. Longer freshness and better nutrition preservation.',
    },
    superFreeze: {
      title: 'SUPER FREEZE',
      text: 'Get the most out of your food. Super Freeze quickly lowers freezer temperature to freeze food faster, helping preserve cellular structure, texture, and nutrients while reducing thawing risk.',
    },
    preciseElectronicControl: {
      title: 'PRECISE ELECTRONIC CONTROL',
      text: 'Take complete control. The user-friendly digital panel makes it easy to set fridge and freezer temperatures and activate special modes like ECO, Holiday, and Super Freeze with precise control.',
    },
    reversibleDoor: {
      title: 'REVERSIBLE DOOR',
      text: 'Have it your way. The door hinge can be switched to open from either side so the refrigerator adapts to your kitchen layout.',
    },
    lowNoise: {
      title: 'LOW NOISE',
      text: 'Enjoy a quieter home. A state-of-the-art fan and compressor system supports stable performance with low operating noise around 38 dB for a calmer kitchen environment.',
    },
    easyToUseDrawer: {
      title: 'EASY-TO-USE DRAWER',
      text: 'Never a struggle. The unique drawer clasp design makes freezer drawers easier to remove and handle for day-to-day use.',
    },
    easyOpenDrawer: {
      title: 'EASY OPEN DRAWER',
      text: 'Easy access to your frozen goods. The easy-open mechanism gives wider, faster access to stored frozen items and helps organize food more efficiently.',
    },
  },
};

const rfc300CopyFa = {
  name: 'یخچال فریزر هایسنس RFC-300',
  tagline: 'تازگی ماندگار با فناوری بدون برفک و راحتی در استفاده روزمره.',
  description:
    'یخچال فریزر هایسنس RFC-300 با فناوری بدون برفک کامل، کنترل دیجیتال دقیق و طراحی هوشمند فضای داخلی، تازگی مواد غذایی را برای مدت طولانی‌تری حفظ کرده و دسترسی و نظم بهتری در استفاده روزمره فراهم می‌کند.',
  highlights: [
    'فناوری Total No Frost بدون نیاز به برفک‌زدایی دستی.',
    'نورپردازی LED ملایم با دید بهتر و مصرف انرژی کمتر.',
    'آبریز باریک یکپارچه با طراحی درِ صاف و مدرن.',
    'سرمایش Micro Vents برای توزیع یکنواخت دما در تمام طبقات.',
    'کنترل الکترونیکی دقیق با حالت‌های ECO، Holiday و Super Freeze.',
  ],
  blocks: {
    totalNoFrost: {
      title: 'بدون برفک کامل',
      text: 'بدون برفک، در هیچ نقطه‌ای. این سیستم با جلوگیری از تشکیل برفک در یخچال و فریزر، تازگی و ارزش غذایی مواد را برای مدت طولانی‌تری حفظ می‌کند. بدون نیاز به برفک‌زدایی دستی، با نگهداری آسان‌تر و قفسه‌هایی همیشه تمیز.',
    },
    softLedLighting: {
      title: 'نورپردازی LED ملایم',
      text: 'زیبا از هر زاویه. نور LED ملایم دیدی شفاف و یکنواخت از فضای داخلی ایجاد می‌کند، مصرف انرژی کمتری دارد و با پخش نور نرم، حس لوکس‌تری به داخل یخچال می‌بخشد.',
    },
    sleekWaterDispenser: {
      title: 'آبریز باریک',
      text: 'همیشه آب خنک در دسترس. آبریز باریک ۳.۵ لیتری به‌صورت یکپارچه در درِ صاف یخچال طراحی شده است. کافی است مخزن را پر کنید تا در هر زمان از آب خنک و تازه لذت ببرید؛ بدون اشغال فضای اضافی.',
    },
    temperedGlassShelves: {
      title: 'طبقات شیشه‌ای سکوریت',
      text: 'تحمل بالا برای استفاده روزمره. طبقات شیشه‌ای سکوریت با کیفیت بالا، وزن بیشتری نسبت به قفسه‌های معمولی تحمل می‌کنند و در صورت شکستگی نیز ایمنی بالاتری دارند. مقاوم، بادوام و آسان برای نظافت.',
    },
    microVentsTechnology: {
      title: 'سرمایش Micro Vents',
      text: 'چندین طبقه، یک دمای یکنواخت. دریچه‌های ریز تعبیه‌شده در ستون پشتی و کناره‌ها، سرمایش یکنواختی در سراسر یخچال ایجاد می‌کنند تا مواد غذایی در هر طبقه، شرایط نگهداری یکسانی داشته باشند.',
    },
    freshBox: {
      title: 'Fresh Box',
      text: 'محفظه ایده‌آل برای گوشت و ماهی. این کشوی مخصوص با دمای نزدیک به انجماد و رطوبت کنترل‌شده، به حفظ بافت، تازگی و ارزش غذایی گوشت و ماهی کمک می‌کند.',
    },
    moistureFreshCrisper: {
      title: 'کشوی Moisture Fresh Crisper',
      text: 'کنترل رطوبت برای تازگی بیشتر. کشوی مخصوص میوه و سبزیجات با قابلیت تنظیم رطوبت، شرایط مناسب برای انواع مواد غذایی را فراهم کرده و به ماندگاری طولانی‌تر آن‌ها کمک می‌کند.',
    },
    superFreeze: {
      title: 'انجماد سریع',
      text: 'بیشترین بهره از مواد غذایی. قابلیت Super Freeze با کاهش سریع دمای فریزر، مواد را سریع‌تر منجمد می‌کند و به حفظ بافت، طعم و مواد مغذی کمک می‌کند.',
    },
    preciseElectronicControl: {
      title: 'کنترل الکترونیکی دقیق',
      text: 'کنترل کامل و آسان. پنل دیجیتال کاربرپسند امکان تنظیم دقیق دمای یخچال و فریزر و فعال‌سازی حالت‌های ویژه مانند ECO، Holiday و Super Freeze را به‌سادگی فراهم می‌کند.',
    },
    reversibleDoor: {
      title: 'درب قابل‌تغییر جهت',
      text: 'هماهنگ با فضای آشپزخانه شما. امکان تغییر جهت باز شدن درب به شما اجازه می‌دهد یخچال را متناسب با چیدمان آشپزخانه نصب کنید.',
    },
    lowNoise: {
      title: 'صدای کم',
      text: 'آرامش بیشتر در خانه. سیستم پیشرفته فن و کمپرسور با حفظ عملکرد پایدار، سطح صدای پایینی در حدود ۳۸ دسی‌بل ایجاد می‌کند.',
    },
    easyToUseDrawer: {
      title: 'کشوی با کاربری آسان',
      text: 'استفاده راحت‌تر در هر بار دسترسی. طراحی خاص گیره کشو، بیرون آوردن و جابه‌جایی کشوهای فریزر را ساده‌تر و روان‌تر می‌کند.',
    },
    easyOpenDrawer: {
      title: 'کشوی Easy Open',
      text: 'دسترسی سریع‌تر به مواد منجمد. مکانیزم Easy Open امکان باز شدن راحت‌تر، دهانه بزرگ‌تر و نظم بهتر برای نگهداری مواد غذایی منجمد را فراهم می‌کند.',
    },
  },
};

// RS-370
const rs370CopyEn = {
  name: 'Hisense RS-370 Refrigerator',
  tagline: 'Smart storage and stable cooling for everyday freshness.',
  description:
    'RS-370 combines practical storage, efficient airflow, and modern design details to keep food fresh, visible, and easy to access.',
  highlights: [
    'Easy-open metal handle with stable grip and clean look.',
    'Fresh Crisper drawer for fruit and vegetable freshness.',
    'Full Width Airflow for even cooling in all shelves.',
    'Efficient LED lighting for clearer fridge overview.',
    'Super Cool function keeps compartment at +2C for rapid chilling.',
  ],
  blocks: {
    easyOpenDoorHandle: {
      title: 'EASY-OPEN DOOR HANDLE',
      text: 'Opens effortlessly. The light and discreet metal handle blends into the clean, tasteful design. Its firm build and robust materials provide a safe and stable daily feel in your kitchen.',
    },
    freshCrisper: {
      title: 'FRESH CRISPER',
      text: 'The fresh zone storage area. The Fresh Crisper gives enough room for fruits and vegetables, and its ideal temperature helps preserve freshness and aroma. The transparent design also provides an easy content overview.',
    },
    fullWidthAirflow: {
      title: 'FULL WIDTH AIRFLOW',
      text: 'Constant temperature keeps things fresh. Smart Multi Air Flow evenly distributes cold air so a stable temperature is maintained across the refrigerator, keeping food properly chilled wherever it is placed.',
    },
    ledLighting: {
      title: 'LED LIGHTING',
      text: 'Clear overview. Highly efficient LED illumination provides a clearer and deeper view of refrigerator contents.',
    },
    pureAppearance: {
      title: 'PURE APPEARANCE',
      text: 'Modern design with attention to details. The flat-door appearance creates a neat kitchen look. Its balanced height and width integrate well into cabinetry to save space and support practical daily use.',
    },
    sleekWaterDispenser: {
      title: 'SLEEK WATER DISPENSER',
      text: 'Always refreshed. A sleek water dispenser that seamlessly integrated to the flat door of the refrigerator. Just pour fresh water in the water tank and enjoy it perfectly chilled, anytime. Constantly freshly chilled water. Cool - sleek design. Easy and quick function.',
    },
    reversibleDoor: {
      title: 'REVERSIBLE DOOR',
      text: 'Open and closed, your way. The reversible door design fits different kitchen layouts and can be installed to open from either side, whether left- or right-handed access works better for you.',
    },
    superCool: {
      title: 'SUPER COOL',
      text: 'Powerful cooling. Super Cool quickly reduces internal temperature and keeps the fridge compartment at a regular +2C for 6 hours, helping preserve flavor, color, and nutritional value of fresh food.',
    },
  },
};

const rs370CopyFa = {
  name: 'یخچال هایسنس RS-370',
  tagline: 'نگهداری هوشمند با سرمایش پایدار برای تازگی روزانه.',
  description:
    'یخچال هایسنس RS-370 با فضای ذخیره‌سازی کاربردی، گردش هوای یکنواخت و طراحی مدرن، تازگی مواد غذایی را برای مدت طولانی‌تری حفظ کرده و دسترسی سریع و آسان به محتویات را در استفاده روزمره فراهم می‌کند.',
  highlights: [
    'دستگیره فلزی آسان‌بازشو با طراحی یکپارچه و خوش‌دست.',
    'کشوی Fresh Crisper برای حفظ تازگی میوه و سبزیجات.',
    'سیستم Full Width Airflow برای توزیع یکنواخت هوای سرد.',
    'نورپردازی LED کم‌مصرف با دید واضح‌تر از فضای داخلی.',
    'قابلیت Super Cool برای خنک‌سازی سریع تا دمای +۲ درجه.',
  ],
  blocks: {
    easyOpenDoorHandle: {
      title: 'دستگیره آسان‌بازشو',
      text: 'باز شدن روان و بدون زحمت. دستگیره فلزی مینیمال به‌صورت یکپارچه با طراحی تمیز دستگاه هماهنگ شده و با ساختار مستحکم خود، حس پایداری و اطمینان را در استفاده روزانه منتقل می‌کند.',
    },
    freshCrisper: {
      title: 'کشوی Fresh Crisper',
      text: 'محفظه اختصاصی برای تازگی بیشتر. کشوی Fresh Crisper فضای کافی برای نگهداری میوه و سبزیجات فراهم می‌کند و با دمای ایده‌آل، به حفظ طراوت، عطر و کیفیت آن‌ها کمک می‌کند. طراحی شفاف، دسترسی و مشاهده محتویات را آسان‌تر می‌سازد.',
    },
    fullWidthAirflow: {
      title: 'سیستم Full Width Airflow',
      text: 'دمای یکنواخت در تمام طبقات. سیستم هوشمند گردش هوا، هوای سرد را به‌طور یکنواخت در سراسر یخچال پخش می‌کند تا مواد غذایی در هر قفسه‌ای به‌خوبی خنک و تازه بمانند.',
    },
    ledLighting: {
      title: 'نورپردازی LED',
      text: 'دید شفاف و کامل. نورپردازی LED با بازده بالا، روشنایی یکنواخت و عمیق‌تری ایجاد می‌کند تا تمام فضای داخلی یخچال به‌وضوح قابل مشاهده باشد.',
    },
    pureAppearance: {
      title: 'طراحی یکپارچه',
      text: 'طراحی مدرن با توجه به جزئیات. ظاهر درِ تخت، جلوه‌ای مرتب و مینیمال به آشپزخانه می‌بخشد. ابعاد متعادل دستگاه باعث می‌شود به‌خوبی با کابینت‌ها هماهنگ شده و استفاده بهینه از فضا را ممکن کند.',
    },
    sleekWaterDispenser: {
      title: 'آبریز شیک',
      text: 'طراوت همیشگی در دسترس. آبریز باریک و شیک به‌صورت یکپارچه در درِ تخت یخچال طراحی شده است. تنها با پر کردن مخزن، در هر زمان به آب خنک و تازه دسترسی دارید؛ ترکیبی از کاربری آسان و طراحی مدرن.',
    },
    reversibleDoor: {
      title: 'درب قابل‌تغییر جهت',
      text: 'انعطاف‌پذیر در نصب و استفاده. درب قابل‌تغییر جهت این یخچال امکان باز شدن از سمت راست یا چپ را فراهم می‌کند تا با هر نوع چیدمان آشپزخانه سازگار باشد.',
    },
    superCool: {
      title: 'Super Cool',
      text: 'خنک‌سازی سریع و مؤثر. قابلیت Super Cool دمای داخلی را به‌سرعت کاهش داده و بخش یخچال را به‌مدت ۶ ساعت روی +۲ درجه نگه می‌دارد تا طعم، رنگ و ارزش غذایی مواد تازه بهتر حفظ شود.',
    },
  },
};

// FS-270
const fs270CopyEn = {
  name: 'Hisense FS-270 Freezer',
  tagline: 'No-frost freezing with stable performance and practical control.',
  description:
    'FS-270 delivers no-frost convenience, fast freezing performance, and user-friendly controls in a modern space-saving design.',
  highlights: [
    'Total No Frost prevents ice build-up and manual defrosting.',
    'Super Freeze quickly locks flavor and nutrients.',
    'Adjustable legs keep the appliance stable on uneven floors.',
    'LED display panel for clear freezer control.',
    'Low-noise operation for a quieter living space.',
  ],
  blocks: {
    totalNoFrost: {
      title: 'TOTAL NO FROST',
      text: "No frost, anywhere - ever! It creates conditions that keep food fresh and nutritious for longer while preventing ice and frost build-up inside the freezer, so there's no need to spend time defrosting.",
    },
    superFreeze: {
      title: 'SUPER FREEZE',
      text: 'Quick freeze to lock original flavour. Super Freeze rapidly lowers temperature and freezes food much faster than usual, helping preserve natural taste, original texture, and valuable vitamins and minerals.',
    },
    adjustableLegs: {
      title: 'ADJUSTABLE LEGS',
      text: 'Legs can be adjusted accordingly to ensure that your appliance sits steadily, even on uneven ground.',
    },
    ledDisplay: {
      title: 'LED DISPLAY',
      text: 'Easy to read, easy to use. The clear control panel gives complete control of freezer functions and allows quick temperature selection for the freezer compartment.',
    },
    premiumAppearance: {
      title: 'PREMIUM APPEARANCE',
      text: 'Designed with attention to details. This refined freezer requires minimum space while offering large storage capacity. Its modern flat-door design fits perfectly into any kitchen.',
    },
    reversibleDoor: {
      title: 'REVERSIBLE DOOR',
      text: 'Open and closed, your way. The reversible door fits any kitchen layout and can open from either right or left side based on your preferred use.',
    },
    lowNoise: {
      title: 'LOW NOISE',
      text: 'Enjoy A Quieter Life. With an excellent built-in fan and compressor system, this model provides stable performance with low noise levels for a quieter and more peaceful environment.',
    },
  },
};

const fs270CopyFa = {
  name: 'فریزر هایسنس FS-270',
  tagline: 'انجماد بدون برفک با عملکرد پایدار و کنترل کاربردی.',
  description:
    'فریزر هایسنس FS-270 با فناوری بدون برفک کامل، قابلیت انجماد سریع و پنل کنترلی ساده و دقیق، راهکاری مدرن و کم‌صدا برای نگهداری طولانی‌مدت مواد غذایی در فضای کم‌جا ارائه می‌دهد.',
  highlights: [
    'فناوری Total No Frost برای جلوگیری کامل از تشکیل یخ و برفک.',
    'قابلیت Super Freeze برای انجماد سریع و حفظ طعم و ارزش غذایی.',
    'پایه‌های قابل تنظیم برای استقرار پایدار روی سطوح ناهموار.',
    'نمایشگر LED خوانا برای کنترل آسان دمای فریزر.',
    'عملکرد کم‌صدا برای محیطی آرام‌تر در خانه.',
  ],
  blocks: {
    totalNoFrost: {
      title: 'بدون برفک کامل',
      text: 'بدون برفک، همیشه. فناوری Total No Frost با گردش یکنواخت هوای سرد، از تشکیل یخ و برفک داخل فریزر جلوگیری می‌کند و شرایطی ایده‌آل برای حفظ تازگی و ارزش غذایی مواد فراهم می‌سازد؛ بدون نیاز به برفک‌زدایی دستی.',
    },
    superFreeze: {
      title: 'انجماد سریع',
      text: 'انجماد سریع برای حفظ طعم اصلی. قابلیت Super Freeze با کاهش سریع دما، مواد غذایی را بسیار سریع‌تر منجمد می‌کند تا طعم طبیعی، بافت اصلی و ویتامین‌ها و مواد معدنی آن‌ها بهتر حفظ شود.',
    },
    adjustableLegs: {
      title: 'پایه‌های قابل تنظیم',
      text: 'پایه‌های قابل تنظیم امکان تراز و استقرار پایدار دستگاه را حتی روی سطوح ناهموار فراهم می‌کنند تا عملکرد فریزر همیشه ایمن و مطمئن باشد.',
    },
    ledDisplay: {
      title: 'نمایشگر LED',
      text: 'خوانا و ساده در استفاده. پنل کنترل LED با طراحی واضح، امکان کنترل کامل عملکرد فریزر و انتخاب سریع دمای موردنظر را به‌راحتی فراهم می‌کند.',
    },
    premiumAppearance: {
      title: 'طراحی پریمیوم',
      text: 'طراحی‌شده با دقت به جزئیات. این فریزر با اشغال حداقل فضا، ظرفیت ذخیره‌سازی بالایی ارائه می‌دهد و به‌واسطه طراحی مدرن با درِ تخت، به‌خوبی با هر آشپزخانه‌ای هماهنگ می‌شود.',
    },
    reversibleDoor: {
      title: 'درب قابل‌تغییر جهت',
      text: 'انعطاف‌پذیر در نصب. درب قابل‌تغییر جهت این فریزر امکان باز شدن از سمت راست یا چپ را فراهم می‌کند تا با چیدمان‌های مختلف آشپزخانه سازگار باشد.',
    },
    lowNoise: {
      title: 'صدای کم',
      text: 'آرامش بیشتر در خانه. فن و کمپرسور باکیفیت داخلی، عملکردی پایدار با سطح صدای پایین ارائه می‌دهند تا محیطی آرام و دلپذیر داشته باشید.',
    },
  },
};

// FC-210
const fc210CopyEn = {
  name: 'Hisense FC-210 Chest Freezer',
  tagline: 'Fast freezing, flexible temperature control, and practical storage.',
  description:
    'FC-210 combines rapid freezing, efficient cabinet cooling, and space-smart chest-freezer design to preserve food quality longer.',
  highlights: [
    'Super Freeze can lower freezer temperature to -30C.',
    'My Fresh Choice allows flexible cabinet temperature control.',
    'Keeps internal temperature at 0C for up to 135 hours after power-off.',
    '360 degrees cooling improves heat exchange efficiency.',
    'Sliding basket improves daily organization and access.',
  ],
  blocks: {
    superFreeze: {
      title: 'SUPER FREEZE',
      text: 'Once freezing mode is activated, the freezer temperature can drop to -30C, helping keep food fresh, tasty, and nutritious as if it was just purchased.',
    },
    myFreshChoice: {
      title: 'MY FRESH CHOICE',
      text: 'By simply turning the temperature knob, you can set the cabinet temperature based on your needs and keep different foods in the right storage condition.',
    },
    keepFor135H: {
      title: 'KEEP FOR 135H',
      text: 'This chest freezer can keep the internal temperature at around 0C for up to 135 hours after a power outage.',
    },
    cooling360: {
      title: '360° COOLING',
      text: 'A D-type cooling pipe with greater contact surface to the cabinet enables more efficient heat exchange between the inner wall and the evaporator pipe.',
    },
    ultrathinHinges: {
      title: 'ULTRATHIN HINGES',
      text: 'The ultrathin hinge design allows the freezer to be placed closer to the wall, giving you more usable kitchen space.',
    },
    bigCapacity: {
      title: 'BIG CAPACITY',
      text: 'Built with advanced LBA foaming material for superior thermal insulation, this chest freezer offers larger storage capacity compared to conventional models.',
    },
    slidingBasket: {
      title: 'SLIDING BASKET',
      text: "A high-quality plastic basket with soft rounded corners and recessed handles is easy to lift, even when full. It's ideal for small items and offers a cleaner visual appearance.",
    },
  },
};

const fc210CopyFa = {
  name: 'فریزر صندوقی هایسنس FC-210',
  tagline: 'انجماد سریع، کنترل دمای منعطف و ذخیره‌سازی کاربردی.',
  description:
    'فریزر صندوقی هایسنس FC-210 با قابلیت انجماد سریع، سرمایش یکنواخت کابین و طراحی هوشمند کم‌جا، کیفیت، طعم و ارزش غذایی مواد را برای مدت طولانی‌تری حفظ می‌کند و انتخابی مطمئن برای نگهداری حجم بالای مواد غذایی است.',
  highlights: [
    'قابلیت Super Freeze با کاهش دما تا ۳۰- درجه سانتی‌گراد.',
    'My Fresh Choice برای تنظیم منعطف و دقیق دمای کابین.',
    'حفظ دمای داخلی در حدود ۰ درجه تا ۱۳۵ ساعت پس از قطع برق.',
    'سرمایش ۳۶۰ درجه برای توزیع یکنواخت و تبادل حرارتی بهتر.',
    'سبد کشویی برای دسترسی سریع‌تر و نظم روزمره.',
  ],
  blocks: {
    superFreeze: {
      title: 'انجماد سریع',
      text: 'با فعال‌سازی حالت Super Freeze، دمای فریزر تا ۳۰- درجه سانتی‌گراد کاهش می‌یابد تا مواد غذایی با حفظ طعم، بافت و ارزش غذایی، مانند روز اول تازه باقی بمانند.',
    },
    myFreshChoice: {
      title: 'My Fresh Choice',
      text: 'تنها با چرخاندن ولوم تنظیم دما، می‌توانید دمای کابین را متناسب با نوع مواد غذایی انتخاب کنید تا هر محصول در شرایط ایده‌آل نگهداری شود.',
    },
    keepFor135H: {
      title: 'حفظ دما تا ۱۳۵ ساعت',
      text: 'این فریزر صندوقی در صورت قطع برق، قادر است دمای داخلی را تا ۱۳۵ ساعت در محدوده حدود ۰ درجه سانتی‌گراد حفظ کند و از مواد غذایی محافظت نماید.',
    },
    cooling360: {
      title: 'سرمایش ۳۶۰ درجه',
      text: 'استفاده از لوله سرمایشی D-Type با سطح تماس گسترده‌تر، تبادل حرارتی مؤثرتری بین دیواره داخلی کابین و اواپراتور ایجاد می‌کند و به سرمایش یکنواخت‌تر کمک می‌کند.',
    },
    ultrathinHinges: {
      title: 'لولاهای فوق‌باریک',
      text: 'طراحی لولاهای فوق‌باریک امکان قرارگیری فریزر در فاصله نزدیک‌تر به دیوار را فراهم می‌کند تا فضای مفید آشپزخانه بهتر مورد استفاده قرار گیرد.',
    },
    bigCapacity: {
      title: 'ظرفیت بالا',
      text: 'به‌کارگیری متریال پیشرفته LBA در عایق‌کاری حرارتی، این فریزر صندوقی را قادر می‌سازد در مقایسه با مدل‌های معمولی، ظرفیت ذخیره‌سازی بیشتری ارائه دهد.',
    },
    slidingBasket: {
      title: 'سبد کشویی',
      text: 'سبد پلاستیکی باکیفیت با گوشه‌های نرم و دستگیره‌های فرورفته، حتی در حالت پر به‌راحتی جابه‌جا می‌شود و برای نگهداری اقلام کوچک، نظم بهتر و ظاهری مرتب‌تر ایده‌آل است.',
    },
  },
};

// FC-310
const fc310CopyEn = {
  name: 'Hisense FC-310 Chest Freezer',
  tagline: 'Boundless design with practical freezer innovations.',
  description:
    'FC-310 combines a minimalist boundless-door design with reliable freezing performance and practical daily usability features.',
  highlights: [
    'Less is More design philosophy for modern spaces.',
    'Premium Boundless Door with easy-clean surfaces.',
    'Hovering Door that stays open between 30 and 60 degrees.',
    'Mechanical Temperature Control for durable easy operation.',
    'Super Freeze mode for rapid low-temperature freezing.',
  ],
  blocks: {
    lessIsMore: {
      title: 'LESS IS MORE',
      text: 'Traditional products deserve breakthrough innovation. This series removes unnecessary decoration and follows a less-is-more lifestyle, balancing function and aesthetics for modern homes while maximizing practical use of space.',
    },
    premiumBoundlessDoor: {
      title: 'PREMIUM BOUNDLESS DOOR',
      text: 'Designed around the unity of art and technology. The clean geometric shape removes unnecessary complexity and fits minimalist interiors. The user-friendly form also reduces hard-to-clean corners for easier maintenance.',
    },
    slidingBasket: {
      title: 'SLIDING BASKET',
      text: 'A high-quality plastic basket with soft rounded corners and recessed handles is easy to lift even when full. It also helps organize smaller items and improves overall appearance.',
    },
    ultrathinHinges: {
      title: 'ULTRATHIN HINGES',
      text: 'The ultrathin hinge design allows the freezer to be placed against the wall, helping you gain more usable space in the kitchen.',
    },
    myFreshChoice: {
      title: 'MY FRESH CHOICE',
      text: 'By turning the temperature knob, you can set cabinet temperature based on your needs to keep different foods in suitable conditions.',
    },
    hoveringDoor: {
      title: 'HOVERING DOOR',
      text: 'The door can stay open at any angle between 30 and 60 degrees, so you can load or remove food hands-free without holding the lid.',
    },
    mechanicalTemperatureControl: {
      title: 'MECHANICAL TEMPERATURE CONTROL',
      text: 'Compared to electronic control panels, mechanical temperature control is more durable, and its simple operation is especially convenient for elderly users.',
    },
    superFreeze: {
      title: 'SUPER FREEZE',
      text: 'Once freezing mode is activated, temperature can drop to -30C, helping preserve freshness, flavor, texture, and nutritional value as if food was just bought.',
    },
  },
};

const fc310CopyFa = {
  name: 'فریزر صندوقی هایسنس FC-310',
  tagline: 'طراحی مینیمال مدرن با نوآوری‌های کاربردی در نگهداری مواد غذایی.',
  description:
    'فریزر صندوقی هایسنس FC-310 با طراحی مینیمال بدون حاشیه، عملکرد قابل‌اعتماد انجماد و امکانات کاربردی روزمره، نگهداری طولانی‌مدت مواد غذایی را با دسترسی آسان و استفاده بهینه از فضا ممکن می‌سازد.',
  highlights: [
    'فلسفه طراحی Less is More مناسب فضاهای مدرن.',
    'درب Premium Boundless با سطح یکپارچه و نظافت آسان.',
    'درب Hovering با قابلیت توقف در زاویه ۳۰ تا ۶۰ درجه.',
    'کنترل مکانیکی دما با دوام بالا و کاربری ساده.',
    'قابلیت Super Freeze برای انجماد سریع در دمای بسیار پایین.',
  ],
  blocks: {
    lessIsMore: {
      title: 'Less is More',
      text: 'نوآوری فراتر از ظاهر. این سری با حذف تزئینات غیرضروری و تمرکز بر اصل «کمتر، بیشتر است»، تعادلی هوشمندانه میان زیبایی، کارایی و استفاده بهینه از فضا برای خانه‌های مدرن ایجاد می‌کند.',
    },
    premiumBoundlessDoor: {
      title: 'درب Premium Boundless',
      text: 'طراحی‌شده با الهام از تلفیق هنر و فناوری. فرم هندسی ساده و بدون حاشیه، ظاهری مینیمال و هماهنگ با دکوراسیون مدرن ایجاد می‌کند و به‌دلیل کاهش گوشه‌های غیرقابل دسترس، نظافت درب بسیار آسان‌تر می‌شود.',
    },
    slidingBasket: {
      title: 'سبد کشویی',
      text: 'سبد پلاستیکی باکیفیت با گوشه‌های نرم و دستگیره‌های فرورفته، حتی در حالت پر نیز به‌راحتی جابه‌جا می‌شود و برای نظم‌دهی اقلام کوچک و دسترسی سریع‌تر بسیار کاربردی است.',
    },
    ultrathinHinges: {
      title: 'لولاهای فوق‌باریک',
      text: 'طراحی لولاهای فوق‌باریک امکان قرارگیری فریزر در فاصله نزدیک‌تر به دیوار را فراهم می‌کند تا فضای مفید آشپزخانه به‌صورت بهینه استفاده شود.',
    },
    myFreshChoice: {
      title: 'My Fresh Choice',
      text: 'با چرخاندن ولوم تنظیم دما، می‌توانید دمای کابین را متناسب با نوع مواد غذایی انتخاب کنید تا هر محصول در شرایط نگهداری مناسب خود قرار گیرد.',
    },
    hoveringDoor: {
      title: 'درب Hovering',
      text: 'درب این فریزر می‌تواند در زاویه‌های بین ۳۰ تا ۶۰ درجه ثابت بماند تا بدون نیاز به نگه داشتن درب، مواد غذایی را به‌راحتی داخل یا خارج کنید.',
    },
    mechanicalTemperatureControl: {
      title: 'کنترل مکانیکی دما',
      text: 'کنترل مکانیکی دما در مقایسه با پنل‌های الکترونیکی، دوام بالاتری دارد و به‌دلیل سادگی کاربری، گزینه‌ای ایده‌آل برای استفاده روزمره و کاربران سالمند محسوب می‌شود.',
    },
    superFreeze: {
      title: 'انجماد سریع',
      text: 'با فعال‌سازی حالت Super Freeze، دمای فریزر تا ۳۰- درجه سانتی‌گراد کاهش می‌یابد تا تازگی، طعم، بافت و ارزش غذایی مواد غذایی همانند روز اول حفظ شود.',
    },
  },
};

export const REF_PRODUCTS: TvProduct[] = [
  {
    id: 'sbs-650',
    sku: 'SBS-650',
    series: 'SBS-650',
    seriesLabel: 'SBS-650 Side-by-Side',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: [
      'Ice & Water Dispenser',
      'Independent Fridge & Freezer Zone',
      'Self-closing System',
      'Multi-Air Flow',
      'Digital Sensors',
    ],
    image: sbs650Hero,
    posterImage: sbs650Poster,
    gallery: sbs650Gallery,
    banners: [
      {
        id: 'sbs-650-banner',
        desktop: productAsset('sbs-650/Sbs-650-1.jpg'),
        mobile: productAsset('sbs-650/Sbs-650-2.jpg'),
        alt: 'Hisense SBS-650',
      },
      {
        id: 'sbs-650-banner-2',
        desktop: productAsset('sbs-650/Sbs-650-3.jpg'),
        mobile: productAsset('sbs-650/Sbs-650-4.jpg'),
        alt: 'Hisense SBS-650',
      },
      {
        id: 'sbs-650-banner-3',
        desktop: productAsset('sbs-650/Sbs-650-4.jpg'),
        mobile: productAsset('sbs-650/Sbs-650-4.jpg'),
        alt: 'Hisense SBS-650',
      },
    ],
    featureCards: sbs650FeatureCards,
    sectionGroups: [
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          {
            image: productAsset('sbs-650/1-ice-water-dispencer.jpg'),
            copyKey: 'iceWaterDispenser',
          },
          { image: productAsset('sbs-650/2-independent-zones.jpg'), copyKey: 'independentZones' },
          { image: productAsset('sbs-650/4-self-closing.jpg'), copyKey: 'selfClosingSystem' },
          { image: productAsset('sbs-650/5-multi-air-flow.jpg'), copyKey: 'multiAirFlow' },
          { image: productAsset('sbs-650/6-digital-sensors.jpg'), copyKey: 'digitalSensors' },
        ],
      },
    ],
    specs: {
      en: [
        'Side-by-side refrigerator & freezer',
        'Water dispenser and ice maker',
        'No-frost system',
        'Multi-air flow circulation',
        'Super freeze',
        'Digital display',
        'Automatic defrost system',
        'Adjustable shelves',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 179',
        'Width (cm): 91',
        'Depth (cm): 73',
        'Net weight (kg): 107',
        'Net fridge capacity (L): 415',
        'Net freezer capacity (L): 186',
      ],
      fa: [
        'یخچال و فریزر ساید بای ساید',
        'مجهز به آبریز و یخساز',
        'سیستم بدون برفک',
        'سیستم گردش هوا در طبقات',
        'انجماد سریع',
        'صفحه نمایش دیجیتال',
        'سیستم یخ‌زدایی خودکار',
        'قابلیت جابجایی طبقات',
        'نور یکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی در کشو',
        'ارتفاع (cm): 179',
        'پهنا (cm): 91',
        'عمق (cm): 73',
        'وزن خالص (kg): 107',
        'ظرفیت خالص یخچال (L): 415',
        'ظرفیت خالص فریزر (L): 186',
      ],
    },
    copy: {
      en: sbs650CopyEn,
      fa: sbs650CopyFa,
    },
  },
  {
    id: 'rft-560',
    sku: 'RFT-560',
    series: 'RFT-560',
    seriesLabel: 'Top-Mount RT Series',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: ['Sleek Water Dispenser', 'Durable Inverter', 'Total No Frost'],
    availableColors: {
      en: ['White', 'Silver'],
      fa: ['سفید', 'نقره‌ای'],
    },
    image: rft560Hero,
    posterImage: rft560Poster,
    topBanner: rft560Banner,
    gallery: rft560Gallery,
    featureCards: rft560FeatureCards,
    sectionGroups: [
      {
        kind: 'content',
        sections: [
          {
            image: productAsset('rft-560/1-sleek-water-dispenser.png'),
            copyKey: 'sleekWaterDispenser',
          },
          { image: productAsset('rft-560/2-durable-inverter.png'), copyKey: 'durableInverter' },
          { image: productAsset('rft-560/3-total-no-frost.png'), copyKey: 'totalNoFrost' },
        ],
      },
      {
        kind: 'overlay',
        sections: [
          { image: productAsset('rft-560/4-big-capacity.png'), copyKey: 'bigCapacity' },
          { image: productAsset('rft-560/5-large-crisper-plus.png'), copyKey: 'largeCrisperPlus' },
        ],
      },
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('rft-560/6-premium-design.png'), copyKey: 'premiumDesign' },
        ],
      },
      {
        kind: 'overlay',
        sections: [{ image: productAsset('rft-560/7-counter-depth.png'), copyKey: 'counterDepth' }],
      },
      {
        kind: 'content',
        sections: [
          { image: productAsset('rft-560/8-fresh-zone.png'), copyKey: 'freshZone' },
          {
            image: productAsset('rft-560/9-removeable-twist-ice-maker.jpg'),
            copyKey: 'removableTwistIceMaker',
          },
          { image: productAsset('rft-560/10-multi-air-flow.png'), copyKey: 'multiAirFlow' },
        ],
      },
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('rft-560/11-electronic-touch-control.png'),
            copyKey: 'electronicTouchControl',
          },
          { image: productAsset('rft-560/12-soft-led-lighting.png'), copyKey: 'softLedLighting' },
          { image: productAsset('rft-560/13-super-freeze.png'), copyKey: 'superFreeze' },
        ],
      },
    ],
    specs: {
      en: [
        'Super Freeze',
        'Water dispenser',
        'No-frost system',
        'Digital display',
        'Adjustable shelves',
        'Automatic defrost system',
        'Self-diagnostic system',
        'Multi-air flow circulation',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 185',
        'Width (cm): 80',
        'Depth (cm): 68',
        'Net weight (kg): 79',
        'Net fridge capacity (L): 431',
        'Net freezer capacity (L): 117',
        'Refrigerant: R600a',
      ],
      fa: [
        'انجماد سریع',
        'مجهز به آبریز',
        'سیستم بدون برفک',
        'صفحه نمایش دیجیتال',
        'قابلیت جابجایی طبقات',
        'سیستم یخ‌زدایی خودکار',
        'سیستم عیب‌یابی خودکار',
        'سیستم گردش هوا در طبقات',
        'نور یکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی در کشو',
        'ارتفاع (cm): 185',
        'پهنا (cm): 80',
        'عمق (cm): 68',
        'وزن خالص (kg): 79',
        'ظرفیت خالص یخچال (L): 431',
        'ظرفیت خالص فریزر (L): 117',
        'گاز مبرد: R600a',
      ],
    },
    copy: {
      en: rft560CopyEn,
      fa: rft560CopyFa,
    },
  },
  {
    id: 'rfc500',
    sku: 'RFC500',
    series: 'RFC500',
    seriesLabel: 'RFC-500 French Door',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: ['Premium Flat Door Design', 'Big Capacity', 'Metal Cooling'],
    image: rfc500Hero,
    posterImage: rfc500Poster,
    gallery: rfc500Gallery,
    availableColors: {
      en: ['White', 'Silver'],
      fa: ['سفید', 'نقره‌ای'],
    },
    featureCards: rfc500FeatureCards,
    sectionGroups: [
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('rfc-500/1-premium-flat-door.jpg'), copyKey: 'premiumFlatDoor' },
        ],
      },
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('rfc-500/2-big-capacity.jpg'),
            copyKey: 'bigCapacity',
            textPosition: 'right',
          },
          { image: productAsset('rfc-500/3-metal-cooling.jpg'), copyKey: 'metalCooling' },
        ],
      },
      {
        kind: 'content',
        sections: [
          {
            image: productAsset('rfc-500/4-micro-vents-technology.jpg'),
            copyKey: 'microVentsTechnology',
          },
          { image: productAsset('rfc-500/5-durable-inverter.jpg'), copyKey: 'durableInverter' },
          {
            image: productAsset('rfc-500/6-moisture-fresh-crisper.jpg'),
            copyKey: 'moistureFreshCrisper',
          },
          {
            image: productAsset('rfc-500/7-sleek-water-dispenser.jpg'),
            copyKey: 'sleekWaterDispenser',
          },
        ],
      },
    ],
    specs: {
      fa: [
        'انجماد سریع',
        'مجهز به آبریز',
        'سیستم بدون برفک',
        'قابلیت جابجایی طبقات',
        'سیستم یخ زدایی خودکار',
        'سیستم عیب یابی خودکار',
        'سیستم گردش هوا در طبقات',
        'نور یکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی در کشو',
        'ارتفاع (cm): 173',
        'پهنا (cm): 80',
        'عمق (cm): 70',
        'وزن خاص یخچال (kg): 86',
        'ظرفیت خالص یخچال (L): 353',
        'ظرفیت خالص فریزر (L): 147',
        'گاز مبرد: R600a',
      ],
      en: [
        'Super freeze',
        'Water dispenser',
        'No-frost system',
        'Adjustable shelves',
        'Automatic defrost system',
        'Self-diagnostic system',
        'Multi-air flow circulation',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 173',
        'Width (cm): 80',
        'Depth (cm): 70',
        'Net weight (kg): 86',
        'Net fridge capacity (L): 353',
        'Net freezer capacity (L): 147',
        'Refrigerant: R600a',
      ],
    },
    copy: {
      en: rfc500CopyEn,
      fa: rfc500CopyFa,
    },
  },
  {
    id: 'rfc300',
    sku: 'RFC-300',
    series: 'RFC-300',
    seriesLabel: 'RFC-300 Bottom-Mount',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: ['Total No Frost', 'Slim Water Dispenser', 'Micro Vents Cooling'],
    image: rfc300Hero,
    posterImage: rfc300Poster,
    gallery: rfc300Gallery,
    availableColors: {
      en: ['White', 'Silver'],
      fa: ['سفید', 'نقره‌ای'],
    },
    featureCards: rfc300FeatureCards,
    sectionGroups: [
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('rfc-300/1-total-no-frost.jpg'),
            copyKey: 'totalNoFrost',
            textPosition: 'right',
          },
          {
            image: productAsset('rfc-300/2-soft-led-lighting.jpg'),
            copyKey: 'softLedLighting',
            textPosition: 'right',
          },
          {
            image: productAsset('rfc-300/3-slim-water-dispenser.jpg'),
            copyKey: 'sleekWaterDispenser',
            textPosition: 'right',
          },
          {
            image: productAsset('rfc-300/4-tempered-glass-shelves.jpg'),
            copyKey: 'temperedGlassShelves',
            textPosition: 'right',
          },
        ],
      },
      {
        kind: 'content',
        sections: [
          {
            image: productAsset('rfc-300/5-micro-vents-cooling.jpg'),
            copyKey: 'microVentsTechnology',
          },
          { image: productAsset('rfc-300/6-fresh-box.jpg'), copyKey: 'freshBox' },
          {
            image: productAsset('rfc-300/7-moisture-fresh-crisper.jpg'),
            copyKey: 'moistureFreshCrisper',
          },
          { image: productAsset('rfc-300/8-super-freeze.jpg'), copyKey: 'superFreeze' },
          {
            image: productAsset('rfc-300/9-precise-electronic-control.jpg'),
            copyKey: 'preciseElectronicControl',
          },
          { image: productAsset('rfc-300/10-reversible-door.jpg'), copyKey: 'reversibleDoor' },
          { image: productAsset('rfc-300/11-low-noise.jpg'), copyKey: 'lowNoise' },
          {
            image: productAsset('rfc-300/12-easy-to-use-drawer.jpg'),
            copyKey: 'easyToUseDrawer',
          },
          { image: productAsset('rfc-300/13-easy-open-drawer.jpg'), copyKey: 'easyOpenDrawer' },
        ],
      },
    ],
    specs: {
      fa: [
        'انجماد سریع',
        'مجهز به آبریز',
        'سیستم بدون برفک',
        'قابلیت جابجایی طبقات',
        'سیستم یخ زدایی خودکار',
        'سیستم عیب یابی خودکار',
        'سیستم گردش هوا در طبقات',
        'نور یکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی در کشو',
        'ارتفاع (cm): 186',
        'پهنا (cm): 60',
        'عمق (cm): 59',
        'وزن خالص (kg): 63',
        'ظرفیت خالص یخچال (L): 205',
        'ظرفیت خالص فریزر (L): 93',
        'گاز مبرد: R600a',
      ],
      en: [
        'Super freeze',
        'Water dispenser',
        'No-frost system',
        'Adjustable shelves',
        'Automatic defrost system',
        'Self-diagnostic system',
        'Multi-air flow circulation',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 186',
        'Width (cm): 60',
        'Depth (cm): 59',
        'Net weight (kg): 63',
        'Net fridge capacity (L): 205',
        'Net freezer capacity (L): 93',
        'Refrigerant: R600a',
      ],
    },
    copy: {
      en: rfc300CopyEn,
      fa: rfc300CopyFa,
    },
  },
  {
    id: 'rs-370',
    sku: 'RS-370',
    series: 'RS-370',
    seriesLabel: 'RS-370 Refrigerator',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: [
      'Easy-open Door Handle',
      'Fresh Crisper',
      'Full Width Airflow',
      'LED Lighting',
      'Super Cool',
    ],
    image: rs370Hero,
    posterImage: rs370Poster,
    gallery: rs370Gallery,
    featureCards: rs370FeatureCards,
    sectionGroups: [
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          {
            image: productAsset('rs-370/1-easy-open-door-handle.jpg'),
            copyKey: 'easyOpenDoorHandle',
          },
          { image: productAsset('rs-370/2-fresh-crisper.jpg'), copyKey: 'freshCrisper' },
        ],
      },
      {
        kind: 'content',
        sections: [
          { image: productAsset('rs-370/3-full-width-airflow.jpg'), copyKey: 'fullWidthAirflow' },
          { image: productAsset('rs-370/4-LED-lighting.jpg'), copyKey: 'ledLighting' },
          { image: productAsset('rs-370/5-pure-appearance.jpg'), copyKey: 'pureAppearance' },
          {
            image: productAsset('rs-370/6-sleek-water-dispenser.jpg'),
            copyKey: 'sleekWaterDispenser',
          },
          { image: productAsset('rs-370/7-reversible-door.jpg'), copyKey: 'reversibleDoor' },
          { image: productAsset('rs-370/8-super-cool.jpg'), copyKey: 'superCool' },
        ],
      },
    ],
    specs: {
      fa: [
        'یخچال',
        'مجهز به آبریز',
        'سیستم بدون برفک',
        'سیستم گردش هوا در طبقات',
        'انجماد سریع',
        'صفحه نمایش دیجیتال',
        'سـیستم یـخ زدایی خودکار',
        'قـــــابلیت جــابــجایی طـــبقات',
        'نوریکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی  در کشو',
        'ارتفاع (cm): 186',
        'پهنا (cm): 60',
        'عمق (cm): 67',
        'وزن خالص یخچال (kg): 66',
        'ظرفیت خالص یخچال (L): 350',
      ],
      en: [
        'Refrigerator',
        'Water dispenser',
        'No-frost system',
        'Multi-air flow circulation',
        'Super freeze',
        'Digital display',
        'Automatic defrost system',
        'Adjustable shelves',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 186',
        'Width (cm): 60',
        'Depth (cm): 67',
        'Net refrigerator weight (kg): 66',
        'Net refrigerator capacity (L): 350',
      ],
    },
    copy: {
      en: rs370CopyEn,
      fa: rs370CopyFa,
    },
  },
  {
    id: 'fs-270',
    sku: 'FS-270',
    series: 'FS-270',
    seriesLabel: 'FS-270 Freezer',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: ['Total No Frost', 'Super Freeze', 'LED Display', 'Reversible Door', 'Low Noise'],
    image: fs270Hero,
    posterImage: fs270Poster,
    gallery: fs270Gallery,
    featureCards: fs270FeatureCards,
    sectionGroups: [
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('fs-270/1-total-no-frost.jpg'), copyKey: 'totalNoFrost' },
          { image: productAsset('fs-270/2-super-freeze.jpg'), copyKey: 'superFreeze' },
        ],
      },
      {
        kind: 'content',
        sections: [
          { image: productAsset('fs-270/3-adjustable-legs.jpg'), copyKey: 'adjustableLegs' },
          { image: productAsset('fs-270/4-LED-display.jpg'), copyKey: 'ledDisplay' },
          { image: productAsset('fs-270/5-premium-appearance.jpg'), copyKey: 'premiumAppearance' },
          { image: productAsset('fs-270/6-reversible-door.jpg'), copyKey: 'reversibleDoor' },
          { image: productAsset('fs-270/7-low-noise.jpg'), copyKey: 'lowNoise' },
        ],
      },
    ],
    specs: {
      fa: [
        'فریزر',
        'سیستم بدون برفک',
        'سیستم گردش هوا در طبقات',
        'انجماد سریع',
        'صفحه نمایش دیجیتال',
        'سـیستم یـخ زدایی خودکار',
        'قـــــابلیت جــابــجایی طـــبقات',
        'نوریکنواخت در فضای کابین یخچال',
        'قابلیت دسترسی سریع و آسان به مواد غذایی  در کشو',
        'ارتفاع (cm): 186',
        'پهنا (cm): 60',
        'عمق (cm): 67',
        'وزن خالص فریزر (kg): 72',
        'ظرفیت خالص فریزر (L): 260',
      ],
      en: [
        'Freezer',
        'No-frost system',
        'Multi-air flow circulation',
        'Super freeze',
        'Digital display',
        'Automatic defrost system',
        'Adjustable shelves',
        'Uniform cabinet lighting',
        'Easy-access drawers',
        'Height (cm): 186',
        'Width (cm): 60',
        'Depth (cm): 67',
        'Net freezer weight (kg): 72',
        'Net freezer capacity (L): 260',
      ],
    },
    copy: {
      en: fs270CopyEn,
      fa: fs270CopyFa,
    },
  },
  {
    id: 'fc-310',
    sku: 'FC-310',
    series: 'FC-310',
    seriesLabel: 'FC-310 Chest Freezer',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: [
      'Premium Boundless Door',
      'Hovering Door',
      'Mechanical Temperature Control',
      'Super Freeze',
    ],
    image: fc310Hero,
    posterImage: fc310Poster,
    gallery: fc310Gallery,
    featureCards: fc310FeatureCards,
    sectionGroups: [
      {
        kind: 'stacked',
        textFirst: true,
        sections: [{ image: productAsset('fc-310/1-less-is-more.jpg'), copyKey: 'lessIsMore' }],
      },
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('fc-310/2-premium-boundless-door.jpg'),
            copyKey: 'premiumBoundlessDoor',
            textPosition: 'left',
          },
        ],
      },
      {
        kind: 'content',
        sections: [
          { image: productAsset('fc-310/3-sliding-basket.jpg'), copyKey: 'slidingBasket' },
          { image: productAsset('fc-310/4-ultrathin-hinges.jpg'), copyKey: 'ultrathinHinges' },
          { image: productAsset('fc-310/5-my-fresh-choice.jpg'), copyKey: 'myFreshChoice' },
          { image: productAsset('fc-310/6-hovering-door.jpg'), copyKey: 'hoveringDoor' },
          {
            image: productAsset('fc-310/7-mechanical-temperature-control.jpg'),
            copyKey: 'mechanicalTemperatureControl',
          },
          { image: productAsset('fc-310/8-super-freeze.jpg'), copyKey: 'superFreeze' },
        ],
      },
    ],
    specs: {
      fa: [
        'ارتفاع (cm): 85',
        'پهنا (cm): 112',
        'عمق (cm): 63',
        'وزن خالص (kg): 40',
        'ظرفیت خالص فریزر (L): 297',
        'گاز مبرد: R600a',
      ],
      en: [
        'Height (cm): 85',
        'Width (cm): 112',
        'Depth (cm): 63',
        'Net weight (kg): 40',
        'Net freezer capacity (L): 297',
        'Refrigerant: R600a',
      ],
    },
    copy: {
      en: fc310CopyEn,
      fa: fc310CopyFa,
    },
  },
  {
    id: 'fc-210',
    sku: 'FC-210',
    series: 'FC-210',
    seriesLabel: 'FC-210 Chest Freezer',
    panel: '',
    resolution: '',
    refreshRate: '',
    os: '',
    sound: '',
    connectivity: [],
    tuner: '',
    extras: ['Super Freeze', 'My Fresh Choice', '360° Cooling', 'Big Capacity'],
    image: fc210Hero,
    posterImage: fc210Poster,
    gallery: fc210Gallery,
    featureCards: fc210FeatureCards,
    sectionGroups: [
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('fc-210/1-super-freeze.jpg'),
            copyKey: 'superFreeze',
            textPosition: 'left',
          },
        ],
      },
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('fc-210/2-my-fresh-choice.jpg'), copyKey: 'myFreshChoice' },
        ],
      },
      {
        kind: 'overlay',
        sections: [
          {
            image: productAsset('fc-210/3-keep-for-135H.png'),
            copyKey: 'keepFor135H',
            textPosition: 'left',
          },
          {
            image: productAsset('fc-210/4-360-cooling.jpg'),
            copyKey: 'cooling360',
            textPosition: 'left',
          },
        ],
      },
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('fc-210/5-ultrathin-hinges.jpg'), copyKey: 'ultrathinHinges' },
        ],
      },
      {
        kind: 'stacked',
        textFirst: true,
        sections: [{ image: productAsset('fc-210/6-big-capacity.jpg'), copyKey: 'bigCapacity' }],
      },
      {
        kind: 'stacked',
        textFirst: true,
        sections: [
          { image: productAsset('fc-210/7-sliding-basket.jpg'), copyKey: 'slidingBasket' },
        ],
      },
    ],
    specs: {
      fa: [
        'ارتفاع (cm): 85',
        'پهنا (cm): 80',
        'عمق (cm): 56',
        'وزن خالص فریزر (kg): 30',
        'ظرفیت خالص فریزر (L): 198',
        'گاز مبرد: R600a',
      ],
      en: [
        'Height (cm): 85',
        'Width (cm): 80',
        'Depth (cm): 56',
        'Net freezer weight (kg): 30',
        'Net freezer capacity (L): 198',
        'Refrigerant: R600a',
      ],
    },
    copy: {
      en: fc210CopyEn,
      fa: fc210CopyFa,
    },
  },
];
