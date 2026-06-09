import { mediaUrl } from '@/lib/mediaUrl';
import type { WmProduct } from '@/types/wm';
import type { TvFeatureCard, TvSectionGroup } from '@/types/tv';

const productAsset = (path: string) => mediaUrl(`/products/rac/${path}`);
const logoAsset = (path: string) => mediaUrl(`/products/rac/logos/${path}`);

const btuFromModel = (modelCode: string): string => {
  if (modelCode.includes('-09')) return '9000 BTU';
  if (modelCode.includes('-12')) return '12000 BTU';
  if (modelCode.includes('-18')) return '18000 BTU';
  if (modelCode.includes('-24')) return '24000 BTU';
  if (modelCode.includes('-30')) return '30000 BTU';
  return '';
};

const tqFeatureCards: TvFeatureCard[] = [
  {
    title: 'ACCURATE TEMPERATURE CONTROL',
    description: 'Set the temperature you like and it will be kept',
    image: logoAsset('2-accurate-tempereture-control-icon.png'),
  },
  {
    title: 'I FEEL',
    description: 'The temperature you feel is the temperature you need',
    image: logoAsset('3-accurate-tempereture-control-icon.png'),
  },
  {
    title: '4D AUTO-SWING',
    description: 'Better airflow distribution and comfort',
    image: logoAsset('4-4d-auto-swing-icon.png'),
  },
  {
    title: 'ANTI-CORROSION GOLDEN FIN',
    description: 'Higher anti-corrosion durability and efficiency',
    image: logoAsset('5-anti-corrosion-golden-fin-icon.jpg'),
  },
];

const tgFeatureCards: TvFeatureCard[] = [
  {
    title: 'HIGH ENERGY EFFICIENCY',
    description: 'Up to 30% lower power consumption',
    image: logoAsset('5-high-energy-efficiency-icon.png'),
  },
  {
    title: '4D AUTO-SWING',
    description: 'Better airflow distribution and comfort',
    image: logoAsset('6-4d-auto-swing-icon.png'),
  },
  {
    title: 'ANTI-CORROSION GOLDEN FIN',
    description: 'Higher anti-corrosion durability and efficiency',
    image: logoAsset('7-anti-corrosion-golden-fin-icon.jpg'),
  },
];

const tqGallery = [
  productAsset('tq-hrtc-series/tq-1.jpg'),
  productAsset('tq-hrtc-series/tq-2.jpg'),
  productAsset('tq-hrtc-series/tq-3.jpg'),
  productAsset('tq-hrtc-series/tq-4.jpg'),
  productAsset('tq-hrtc-series/tq-5.jpg'),
];

const tgGallery = [
  productAsset('tg-series/tg-1.png'),
  productAsset('tg-series/tg-2.png'),
  productAsset('tg-series/tg-3.png'),
  productAsset('tg-series/tg-4.png'),
  productAsset('tg-series/tg-5.png'),
];

const vqGallery = [productAsset('vq-series/vq-card.jpg')];

const tqSectionGroups: TvSectionGroup[] = [
  {
    kind: 'content',
    sections: [
      { image: productAsset('tq-hrtc-series/1-4-in-1-filter.jpg'), copyKey: 'fourInOneFilter' },
      {
        image: productAsset('tq-hrtc-series/2-accurate-tempereture-control.jpg'),
        copyKey: 'accurateTemperatureControl',
      },
      { image: productAsset('tq-hrtc-series/3-i-feel.jpg'), copyKey: 'iFeel' },
      { image: productAsset('tq-hrtc-series/4-4d-auto-swing.jpg'), copyKey: 'autoSwing4d' },
      {
        image: productAsset('tq-hrtc-series/5-anti-corrosion-golden-fin.jpg'),
        copyKey: 'antiCorrosionGoldenFin',
      },
      { image: productAsset('tq-hrtc-series/6-easy-cleaning.png'), copyKey: 'easyCleaning' },
      {
        image: productAsset('tq-hrtc-series/7-easy-installations.jpg'),
        copyKey: 'easyInstallations',
      },
      { image: productAsset('tq-hrtc-series/8-easy-maintenance.jpg'), copyKey: 'easyMaintenance' },
    ],
  },
];

const tgSectionGroups: TvSectionGroup[] = [
  {
    kind: 'content',
    sections: [
      {
        image: productAsset('tg-series/1-anion- sterilization.jpg'),
        copyKey: 'anionSterilization',
      },
      { image: productAsset('tg-series/2-4-in-1-filter.jpg'), copyKey: 'fourInOneFilter' },
      {
        image: productAsset('tg-series/3-accurate-tempereture-control.jpg'),
        copyKey: 'accurateTemperatureControl',
      },
      { image: productAsset('tg-series/4-i-feel.jpg'), copyKey: 'iFeel' },
      {
        image: productAsset('tg-series/5-high-energy-efficiency.png'),
        copyKey: 'highEnergyEfficiency',
      },
      { image: productAsset('tg-series/6-4d-auto-swing.jpg'), copyKey: 'autoSwing4d' },
      {
        image: productAsset('tg-series/7-anti-corrosion-golden-fin.jpg'),
        copyKey: 'antiCorrosionGoldenFin',
      },
      { image: productAsset('tg-series/8-easy-cleaning.png'), copyKey: 'easyCleaning' },
      { image: productAsset('tg-series/9-wider-tubing-space.jpg'), copyKey: 'easyInstallations' },
      {
        image: productAsset('tg-series/10-Quick-easy-replace-pcb.jpg'),
        copyKey: 'easyMaintenance',
      },
    ],
  },
];

const tqBlocksEn = {
  featureIntro: {
    title: 'TQ Series',
    text: 'Reliable comfort with precise control and easy serviceability.',
  },
  fourInOneFilter: {
    title: '4-IN-1 FILTER',
    text: 'The combination of four filters can effectively remove all kinds of dust and odor in the air and refresh the indoor air.',
  },
  accurateTemperatureControl: {
    title: 'ACCURATE TEMPERATURE CONTROL',
    text: 'Set the temperature you like and it will be kept. With ultra wide frequency control technology, control is more accurate to prevent room temperature fluctuations and keep you comfortable.',
  },
  iFeel: {
    title: 'I FEEL',
    text: 'The temperature you feel is the temperature you need. The air conditioner senses temperature through the remote and adjusts temperature and wind speed for better comfort.',
  },
  autoSwing4d: {
    title: '4D AUTO-SWING',
    text: 'The horizontal and vertical auto swing improves distribution of cooling, prevents direct blowing, and improves comfort.',
  },
  antiCorrosionGoldenFin: {
    title: 'ANTI-CORROSION GOLDEN FIN',
    text: 'Based on salt spray testing, the anti-corrosion level is 3 to 4 times higher than common fins and provides better hydrophilic performance and heat exchange efficiency.',
  },
  easyCleaning: {
    title: 'EASY CLEANING',
    text: 'The indoor unit can be disassembled and cleaned in less than one minute.',
  },
  easyInstallations: {
    title: 'EASY INSTALLATIONS',
    text: 'Gas and liquid pipes can be connected while the AC is mounted on the wall, using a unique installation structure for convenient and efficient setup.',
  },
  easyMaintenance: {
    title: 'EASY MAINTENANCE',
    text: 'New indoor structure design means there is no need to move the evaporator when checking the PCB or cross-flow fan motor.',
  },
};

const tqBlocksFa = {
  featureIntro: {
    title: 'سری TQ',
    text: 'عملکرد پایدار با کنترل دقیق دما و نگهداری آسان.',
  },
  fourInOneFilter: {
    title: 'فیلتر ۴ در ۱',
    text: 'ترکیب چهار فیلتر می‌تواند انواع گرد و غبار و بوهای نامطبوع را از هوا حذف کرده و هوای تازه‌تری در فضای داخلی ایجاد کند.',
  },
  accurateTemperatureControl: {
    title: 'کنترل دقیق دما',
    text: 'دمای دلخواه را تنظیم کنید تا ثابت بماند. با فناوری کنترل فرکانس گسترده، نوسان دمای اتاق کاهش یافته و آسایش بیشتری فراهم می‌شود.',
  },
  iFeel: {
    title: 'I FEEL',
    text: 'دمایی که احساس می‌کنید، همان دمای موردنیاز شماست. دستگاه با سنجش دما از طریق ریموت، دما و سرعت باد را متناسب تنظیم می‌کند.',
  },
  autoSwing4d: {
    title: 'نوسان خودکار ۴ جهته',
    text: 'نوسان افقی و عمودی خودکار، توزیع یکنواخت‌تری از هوا ایجاد می‌کند و از وزش مستقیم جلوگیری می‌کند.',
  },
  antiCorrosionGoldenFin: {
    title: 'فین طلایی ضدخوردگی',
    text: 'طبق تست اسپری نمک، سطح مقاومت به خوردگی فین طلایی ۳ تا ۴ برابر بیشتر از فین‌های معمولی است و راندمان تبادل حرارتی بالاتری دارد.',
  },
  easyCleaning: {
    title: 'نظافت آسان',
    text: 'یونیت داخلی در کمتر از یک دقیقه قابل باز شدن و نظافت است.',
  },
  easyInstallations: {
    title: 'نصب آسان',
    text: 'با ساختار ویژه نصب، لوله‌های گاز و مایع پس از نصب دستگاه روی دیوار به‌راحتی متصل می‌شوند.',
  },
  easyMaintenance: {
    title: 'سرویس آسان',
    text: 'در ساختار جدید یونیت داخلی، برای بررسی PCB یا موتور فن عرضی نیازی به جابه‌جایی اواپراتور نیست.',
  },
};

const tgBlocksEn = {
  featureIntro: {
    title: 'TG Series',
    text: 'Healthy air, stable comfort, and higher energy efficiency.',
  },
  anionSterilization: {
    title: 'ANION STERILIZATION',
    text: 'Efficient sterilization for healthier life. Anions generated by the AC help eliminate bacteria, mold, viruses, and pollen, creating fresher indoor air.',
  },
  fourInOneFilter: tqBlocksEn.fourInOneFilter,
  accurateTemperatureControl: tqBlocksEn.accurateTemperatureControl,
  iFeel: tqBlocksEn.iFeel,
  highEnergyEfficiency: {
    title: 'HIGH ENERGY EFFICIENCY',
    text: 'By using 3D inverter technology with optimized air duct and advanced louver fin, efficiency is significantly improved and power consumption can be reduced by up to 30%.',
  },
  autoSwing4d: tqBlocksEn.autoSwing4d,
  antiCorrosionGoldenFin: tqBlocksEn.antiCorrosionGoldenFin,
  easyCleaning: tqBlocksEn.easyCleaning,
  easyInstallations: tqBlocksEn.easyInstallations,
  easyMaintenance: tqBlocksEn.easyMaintenance,
};

const tgBlocksFa = {
  featureIntro: {
    title: 'سری TG',
    text: 'هوایی سالم‌تر، آسایش پایدارتر و مصرف انرژی بهینه‌تر برای خانه‌های مدرن.',
  },
  anionSterilization: {
    title: 'استریلیزاسیون یونی',
    text: 'تولید یون‌های منفی به کاهش مؤثر باکتری‌ها، ویروس‌ها، قارچ‌ها و آلرژن‌ها کمک کرده و کیفیت هوای محیط را به‌طور محسوسی بهبود می‌بخشد.',
  },
  fourInOneFilter: tqBlocksFa.fourInOneFilter,
  accurateTemperatureControl: tqBlocksFa.accurateTemperatureControl,
  iFeel: tqBlocksFa.iFeel,
  highEnergyEfficiency: {
    title: 'بازدهی انرژی بالا',
    text: 'با بهره‌گیری از فناوری اینورتر سه‌بعدی، طراحی بهینه مسیر هوا و فین‌های پیشرفته، مصرف انرژی کاهش یافته و راندمان دستگاه تا ۳۰٪ بهبود می‌یابد.',
  },
  autoSwing4d: tqBlocksFa.autoSwing4d,
  antiCorrosionGoldenFin: tqBlocksFa.antiCorrosionGoldenFin,
  easyCleaning: tqBlocksFa.easyCleaning,
  easyInstallations: tqBlocksFa.easyInstallations,
  easyMaintenance: tqBlocksFa.easyMaintenance,
};

const tqCommonSpecsFa = [
  '• مبرد R410A',
  '• مجهز به فیلتر ۴ در ۱',
  '• مصرف انرژی بهینه و عملکرد قدرتمند',
  '• محدوده ولتاژ کاری ۱۸۷ تا ۲۶۴ ولت',
  '• فیلتر ۴ در ۱',
  '• فیلتر HEPA (حذف ۹۹.۷٪ ذرات تا ۰.۳ میکرون)',
  '• فیلتر یون نقره‌ای',
  '• فیلتر ویتامین C',
  '• فیلتر کاتچین',
  '• گارانتی: ۱۸ ماه قطعات / ۵ سال کمپرسور',
];

const tgCommonSpecsFa = [
  '• مبرد R410A',
  '• مجهز به فیلتر ۴ در ۱',
  '• مصرف انرژی بهینه و عملکرد قدرتمند',
  '• محدوده ولتاژ کاری ۱۵۰ تا ۲۶۴ ولت',
  '• عملکرد پایدار در دمای محیط تا ۵۰ درجه سانتی‌گراد',
  '• فیلتر HEPA (حذف ۹۹.۷٪ ذرات تا ۰.۳ میکرون)',
  '• فیلتر یون نقره‌ای',
  '• فیلتر ویتامین C',
  '• فیلتر کاتچین',
  '• گارانتی: ۱۸ ماه قطعات / ۵ سال کمپرسور',
];

const tqCommonSpecsEn = [
  'R410A refrigerant',
  '4-in-1 filter',
  'Energy saving and high performance',
  'Operating voltage range: 187 ~ 264',
  'Warranty: Parts 18 months / Compressor 5 years',
];

const tgCommonSpecsEn = [
  'R410A refrigerant',
  '4-in-1 filter',
  'Energy saving and high performance',
  'Operating voltage range: 150 ~ 264',
  'Operating temperature up to 50°C',
  'Warranty: Parts 18 months / Compressor 5 years',
];

const hrhSpecs: Record<string, Record<'fa' | 'en', string[]>> = {
  'hrh-09tq': {
    fa: [
      ...tqCommonSpecsFa,
      'ابعاد پنل: پهنا 836 – ارتفاع 270 – عمق 210',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 24kg',
      'محدوده دمای کارکرد تا 46 درجه',
    ],
    en: [
      ...tqCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 836 × 270 × 210',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 24kg',
      'Operating temperature up to 46°C',
    ],
  },
  'hrh-12tq': {
    fa: [
      ...tqCommonSpecsFa,
      'ابعاد پنل: پهنا 836 – ارتفاع 270 – عمق 210',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8.4kg',
      'ابعاد موتور: پهنا 715 – ارتفاع 240 – عمق 482',
      'ابعاد بسته بندی موتور: پهنا 830 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 27kg',
      'محدوده دمای کارکرد تا 46 درجه',
    ],
    en: [
      ...tqCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 836 × 270 × 210',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8.4kg',
      'Outdoor unit dimensions (W×H×D): 715 × 240 × 482',
      'Outdoor package dimensions (W×H×D): 830 × 530 × 315',
      'Outdoor net weight: 27kg',
      'Operating temperature up to 46°C',
    ],
  },
  'hrh-18tq': {
    fa: [
      '• گاز R410A',
      '• صرفه جویی در انرژی و عملکرد فوق العاده',
      '• محدوده ولتاژ کارکرد 187 ~ 264',
      '• محدوده دمای کارکرد تا 48 درجه',
      'گارانتی: قطعات 18 ماه / کمپرسور 5 سال',
      'ابعاد پنل: پهنا 1014 – ارتفاع 315 – عمق 231',
      'ابعاد بسته بندی پنل: پهنا 1066 – ارتفاع 390 – عمق 315',
      'وزن خالص پنل: 12.5kg',
      'ابعاد موتور: پهنا 780 – ارتفاع 540 – عمق 260',
      'ابعاد بسته بندی موتور: پهنا 910 – ارتفاع 600 – عمق 360',
      'وزن خالص موتور: 38kg',
    ],
    en: [
      'R410A refrigerant',
      'Energy saving and high performance',
      'Operating voltage range: 187 ~ 264',
      'Operating temperature up to 48°C',
      'Warranty: Parts 18 months / Compressor 5 years',
      'Indoor unit dimensions (W×H×D): 1014 × 315 × 231',
      'Indoor package dimensions (W×H×D): 1066 × 390 × 315',
      'Indoor net weight: 12.5kg',
      'Outdoor unit dimensions (W×H×D): 780 × 540 × 260',
      'Outdoor package dimensions (W×H×D): 910 × 600 × 360',
      'Outdoor net weight: 38kg',
    ],
  },
  'hrh-24tq': {
    fa: [
      ...tqCommonSpecsFa,
      'ابعاد پنل: پهنا 1185 – ارتفاع 315 – عمق 231',
      'ابعاد بسته بندی پنل: پهنا 1236 – ارتفاع 390 – عمق 315',
      'وزن خالص پنل: 14.5kg',
      'ابعاد موتور: پهنا 860 – ارتفاع 650 – عمق 310',
      'ابعاد بسته بندی موتور: پهنا 995 – ارتفاع 730 – عمق 445',
      'وزن خالص موتور: 47kg',
      'محدوده دمای کارکرد تا 46 درجه',
    ],
    en: [
      ...tqCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 1185 × 315 × 231',
      'Indoor package dimensions (W×H×D): 1236 × 390 × 315',
      'Indoor net weight: 14.5kg',
      'Outdoor unit dimensions (W×H×D): 860 × 650 × 310',
      'Outdoor package dimensions (W×H×D): 995 × 730 × 445',
      'Outdoor net weight: 47kg',
      'Operating temperature up to 46°C',
    ],
  },
  'hrh-30tq': {
    fa: [
      ...tqCommonSpecsFa,
      'ابعاد پنل: پهنا 1185 – ارتفاع 315 – عمق 231',
      'ابعاد بسته بندی پنل: پهنا 1236 – ارتفاع 390 – عمق 315',
      'وزن خالص پنل: 15kg',
      'ابعاد موتور: پهنا 860 – ارتفاع 650 – عمق 310',
      'ابعاد بسته بندی موتور: پهنا 995 – ارتفاع 730 – عمق 445',
      'وزن خالص موتور: 54kg',
      'محدوده دمای کارکرد تا 48 درجه',
    ],
    en: [
      ...tqCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 1185 × 315 × 231',
      'Indoor package dimensions (W×H×D): 1236 × 390 × 315',
      'Indoor net weight: 15kg',
      'Outdoor unit dimensions (W×H×D): 860 × 650 × 310',
      'Outdoor package dimensions (W×H×D): 995 × 730 × 445',
      'Outdoor net weight: 54kg',
      'Operating temperature up to 48°C',
    ],
  },
};

const hihSpecs: Record<string, Record<'fa' | 'en', string[]>> = {
  'hih-09tg': {
    fa: [
      ...tgCommonSpecsFa,
      'ابعاد پنل: پهنا 880 – ارتفاع 275 – عمق 207',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 23kg',
    ],
    en: [
      ...tgCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 880 × 275 × 207',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 23kg',
    ],
  },
  'hih-12tg': {
    fa: [
      ...tgCommonSpecsFa,
      'ابعاد پنل: پهنا 880 – ارتفاع 275 – عمق 207',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 23kg',
    ],
    en: [
      ...tgCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 880 × 275 × 207',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 23kg',
    ],
  },
  'hih-18tg': {
    fa: [
      ...tgCommonSpecsFa,
      'ابعاد پنل: پهنا 880 – ارتفاع 275 – عمق 207',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 23kg',
    ],
    en: [
      ...tgCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 880 × 275 × 207',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 23kg',
    ],
  },
  'hih-24tg': {
    fa: [
      ...tgCommonSpecsFa,
      'ابعاد پنل: پهنا 880 – ارتفاع 275 – عمق 207',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 23kg',
    ],
    en: [
      ...tgCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 880 × 275 × 207',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 23kg',
    ],
  },
  'hih-30vq': {
    fa: [
      ...tgCommonSpecsFa,
      'ابعاد پنل: پهنا 880 – ارتفاع 275 – عمق 207',
      'ابعاد بسته بندی پنل: پهنا 930 – ارتفاع 335 – عمق 260',
      'وزن خالص پنل: 8kg',
      'ابعاد موتور: پهنا 660 – ارتفاع 482 – عمق 240',
      'ابعاد بسته بندی موتور: پهنا 780 – ارتفاع 530 – عمق 315',
      'وزن خالص موتور: 23kg',
    ],
    en: [
      ...tgCommonSpecsEn,
      'Indoor unit dimensions (W×H×D): 880 × 275 × 207',
      'Indoor package dimensions (W×H×D): 930 × 335 × 260',
      'Indoor net weight: 8kg',
      'Outdoor unit dimensions (W×H×D): 660 × 482 × 240',
      'Outdoor package dimensions (W×H×D): 780 × 530 × 315',
      'Outdoor net weight: 23kg',
    ],
  },
};

const buildRacProduct = (params: {
  id: string;
  series: string;
  seriesLabel: string;
  image: string;
  gallery: string[];
  specs: Record<'fa' | 'en', string[]>;
  blocksEn: Record<string, { title?: string; text?: string }>;
  blocksFa: Record<string, { title?: string; text?: string }>;
  sectionGroups: TvSectionGroup[];
  featureCards: TvFeatureCard[];
  mode: 'cool-only' | 'hot-cool';
}) => {
  const model = params.id.toUpperCase();
  const btu = btuFromModel(model);
  const modeEn = params.mode === 'cool-only' ? 'Cooling only' : 'Cooling and heating';
  const modeFa = params.mode === 'cool-only' ? 'فقط سرمایشی' : 'سرمایش و گرمایش';
  const isHihSeriesModel = params.id.startsWith('hih-');
  const enName = isHihSeriesModel
    ? `Hisense Inverter Air Conditioner ${model}`
    : `Hisense Air Conditioner ${model}`;
  const faName = isHihSeriesModel
    ? `کولر گازی اینورتر هایسنس ${model}`
    : `کولر گازی هایسنس ${model}`;

  const product: WmProduct = {
    id: params.id,
    sku: model,
    series: params.series,
    seriesLabel: params.seriesLabel,
    sizes: btu ? [btu] : [],
    extras: [
      modeEn,
      ...(params.series.includes('TG') ? ['Anion sterilization'] : []),
      '4-in-1 Filter',
      'I Feel',
      '4D Auto-Swing',
    ],
    image: params.image,
    posterImage: params.image,
    gallery: params.gallery,
    featureCards: params.featureCards,
    sectionGroups: params.sectionGroups,
    specs: params.specs,
    copy: {
      en: {
        name: enName,
        tagline: `${params.seriesLabel} | ${modeEn}`,
        description: params.series.includes('TG')
          ? 'Healthy-air inverter split AC with anion sterilization, 4-in-1 filtration, and precise temperature control.'
          : 'Reliable split AC with 4-in-1 filtration, precise temperature control, and service-friendly structure.',
        highlights: [
          modeEn,
          ...(params.series.includes('TG')
            ? ['Anion Sterilization', 'High Energy Efficiency']
            : ['Accurate Temperature Control']),
          '4D Auto-Swing',
          'Anti-Corrosion Golden Fin',
          'Easy Cleaning and Maintenance',
        ],
        blocks: params.blocksEn,
      },
      fa: {
        name: faName,
        tagline: `${params.seriesLabel} | ${modeFa}`,
        description: params.series.includes('TG')
          ? 'کولر گازی اینورتر هایسنس با استریلیزاسیون یونی، فیلتر ۴ در ۱ و کنترل دقیق دما؛ انتخابی هوشمند برای هوای سالم‌تر و مصرف انرژی بهینه.'
          : 'کولر گازی هایسنس با فیلتر ۴ در ۱، کنترل دقیق دما و ساختار مناسب برای نصب و سرویس آسان؛ عملکردی پایدار برای سرمایش و گرمایش روزمره.',
        highlights: [
          modeFa,
          ...(params.series.includes('TG')
            ? ['استریلیزاسیون یونی', 'بازدهی انرژی بالا با فناوری اینورتر']
            : ['کنترل دقیق و پایدار دما']),
          'نوسان خودکار چهارجهته (4D Auto-Swing)',
          'فین طلایی ضدخوردگی با دوام بالا',
          'نظافت و سرویس آسان',
        ],
        blocks: params.blocksFa,
      },
    },
  };

  return product;
};

const hrhModels = ['hrh-09tq', 'hrh-12tq', 'hrh-18tq', 'hrh-24tq', 'hrh-30tq'];
const hrtcModels = ['hrtc-12tq', 'hrtc-18tq', 'hrtc-24tq', 'hrtc-30vq'];
const hihModels = ['hih-09tg', 'hih-12tg', 'hih-18tg', 'hih-24tg', 'hih-30vq'];

const hrhProducts = hrhModels.map((id) =>
  buildRacProduct({
    id,
    series: 'HRH',
    seriesLabel: 'HRH TQ Series',
    image: productAsset('tq-hrtc-series/tq-card.jpg'),
    gallery: tqGallery,
    specs: hrhSpecs[id],
    blocksEn: tqBlocksEn,
    blocksFa: tqBlocksFa,
    sectionGroups: tqSectionGroups,
    featureCards: tqFeatureCards,
    mode: 'hot-cool',
  }),
);

const hrtcProducts = hrtcModels.map((id) =>
  buildRacProduct({
    id,
    series: 'HRTC',
    seriesLabel: id.includes('30vq') ? 'HRTC VQ Series' : 'HRTC TQ Series',
    image: id.includes('30vq')
      ? productAsset('vq-series/vq-card.jpg')
      : productAsset('tq-hrtc-series/tq-card.jpg'),
    gallery: id.includes('30vq') ? vqGallery : tqGallery,
    specs: hrhSpecs[`hrh-${id.split('-')[1]}tq`] ?? hrhSpecs['hrh-30tq'],
    blocksEn: tqBlocksEn,
    blocksFa: tqBlocksFa,
    sectionGroups: tqSectionGroups,
    featureCards: tqFeatureCards,
    mode: 'cool-only',
  }),
);

const hihProducts = hihModels.map((id) =>
  buildRacProduct({
    id,
    series: 'HIH',
    seriesLabel: id.includes('30vq') ? 'HIH VQ Series' : 'HIH TG Series',
    image: id.includes('30vq')
      ? productAsset('vq-series/vq-card.jpg')
      : productAsset('tg-series/tg-card.jpg'),
    gallery: id.includes('30vq') ? vqGallery : tgGallery,
    specs: hihSpecs[id],
    blocksEn: tgBlocksEn,
    blocksFa: tgBlocksFa,
    sectionGroups: tgSectionGroups,
    featureCards: tgFeatureCards,
    mode: 'hot-cool',
  }),
);

const hfhProducts: WmProduct[] = [
  {
    id: 'hfh-36fm',
    sku: 'HFH-36FM',
    series: 'HFH',
    seriesLabel: 'HFH Series',
    sizes: ['36000 BTU'],
    extras: ['Cooling and heating', 'Rotary compressor', '24-hour Timer', 'Auto Swing'],
    image: productAsset('hfh-series/hfh-card.jpg'),
    posterImage: productAsset('hfh-series/hfh-card.jpg'),
    gallery: [productAsset('hfh-series/hfh-card.jpg')],
    specs: {
      en: [
        'Cooling capacity: 34120 Btu/h',
        'Heating capacity: 30708 Btu/h',
        'R410A refrigerant',
        'Indoor noise level (max/min): 46 / 44 dB(A)',
        'Outdoor noise level: 58 dB(A)',
        'Power supply: 220-240V~/1Ph/50Hz',
        'Phase: Single phase',
        'Rated current (cooling): 14.76A',
        'Rated current (heating): 16.3A',
        'Rated power input (cooling): 10500W',
        'Rated power input (heating): 9000W',
        'Compressor type: Rotary',
        'Liquid pipe size: 3/8 inch',
        'Gas pipe size: 3/5 inch',
        'Max. piping length / height difference: 20 / 30m',
        'Climate class: T3',
        'Control type: L1',
        'Front display panel: Yes',
        'Remote control: Yes',
        'Washable front panel: Yes',
        'Washable propylene filter: Yes',
        '24-hour timer: Yes',
        '4-speed fan with auto mode: Yes',
        'Auto vertical swing: Yes',
        'Auto horizontal swing: Yes',
        'Sleep mode: Yes',
        'Touch keys: Yes',
        'Indoor unit dimensions (W×H×D): 500 × 1760 × 280',
        'Outdoor unit dimensions (W×H×D): 900 × 750 × 340',
        'Indoor net weight: 34kg',
        'Outdoor net weight: 62kg',
        'Indoor package dimensions (W×H×D): 610 × 1890 × 410',
        'Outdoor package dimensions (W×H×D): 1040 × 830 × 460',
        'Indoor gross weight: 40kg',
        'Outdoor gross weight: 66kg',
      ],
      fa: [
        'ظرفیت سرمایش: 34120 بی‌تی‌یو بر ساعت',
        'ظرفیت گرمایش: 30708 بی‌تی‌یو بر ساعت',
        'مبرد R410A',
        'سطح صدای یونیت داخلی (حداکثر/حداقل): 46 / 44 دسی‌بل',
        'سطح صدای یونیت بیرونی: 58 دسی‌بل',
        'منبع تغذیه: 220-240V~/1Ph/50Hz',
        'فاز: تک‌فاز',
        'جریان مصرفی سرمایش: 14.76 آمپر',
        'جریان مصرفی گرمایش: 16.3 آمپر',
        'توان مصرفی سرمایش: 10500 وات',
        'توان مصرفی گرمایش: 9000 وات',
        'نوع کمپرسور: روتاری',
        'سایز لوله مایع: 3/8 اینچ',
        'سایز لوله گاز: 3/5 اینچ',
        'حداکثر طول/ارتفاع لوله‌کشی: 20 / 30 متر',
        'شرایط کارکرد محیطی: T3',
        'نوع کنترل: L1',
        'نمایشگر جلوی پنل داخلی: دارد',
        'ریموت کنترل: دارد',
        'پنل باز و بسته‌شونده با قابلیت شستشو: دارد',
        'فیلتر پلی‌پروپیلن قابل شستشو: دارد',
        'تایمر 24 ساعته: دارد',
        'کنترل چهارحالته سرعت فن به‌همراه حالت اتوماتیک: دارد',
        'تنظیم اتوماتیک پرتاب باد عمودی: دارد',
        'تنظیم اتوماتیک پرتاب باد افقی: دارد',
        'حالت خواب: دارد',
        'کلیدهای لمسی: دارد',
        'ابعاد یونیت داخلی (پهنا×ارتفاع×عمق): 500 × 1760 × 280 میلی‌متر',
        'ابعاد یونیت بیرونی (پهنا×ارتفاع×عمق): 900 × 750 × 340 میلی‌متر',
        'وزن خالص یونیت داخلی: 34 کیلوگرم',
        'وزن خالص یونیت بیرونی: 62 کیلوگرم',
        'ابعاد بسته‌بندی یونیت داخلی (پهنا×ارتفاع×عمق): 610 × 1890 × 410 میلی‌متر',
        'ابعاد بسته‌بندی یونیت بیرونی (پهنا×ارتفاع×عمق): 1040 × 830 × 460 میلی‌متر',
        'وزن ناخالص یونیت داخلی: 40 کیلوگرم',
        'وزن ناخالص یونیت بیرونی: 66 کیلوگرم',
      ],
    },
    copy: {
      en: {
        name: 'Hisense Air Conditioner HFH-36FM',
        tagline: 'HFH Series | Cooling and heating',
        description:
          'Hisense HFH-36FM floor-standing air conditioner with powerful cooling and heating, rotary compressor, and practical control features for larger residential and commercial spaces.',
        highlights: [
          'Cooling and heating',
          '34120 Btu/h cooling capacity',
          'Single-phase 220-240V power supply',
          'Rotary compressor',
          '24-hour timer and auto swing',
        ],
        blocks: {},
      },
      fa: {
        name: 'کولر گازی هایسنس HFH-36FM',
        tagline: 'سری HFH | سرمایش و گرمایش',
        description:
          'کولر گازی ایستاده هایسنس HFH-36FM با سرمایش و گرمایش قدرتمند، کمپرسور روتاری و امکانات کنترلی کاربردی، گزینه‌ای مناسب برای فضاهای بزرگ مسکونی و تجاری است.',
        highlights: [
          'سرمایش و گرمایش',
          'ظرفیت سرمایش 34120 بی‌تی‌یو بر ساعت',
          'برق تک‌فاز 220-240V',
          'کمپرسور روتاری',
          'تایمر 24 ساعته و پرتاب باد خودکار',
        ],
        blocks: {},
      },
    },
  },
  {
    id: 'hfh-55fm',
    sku: 'HFH-55FM',
    series: 'HFH',
    seriesLabel: 'HFH Series',
    sizes: ['55000 BTU'],
    extras: ['Cooling and heating', 'Rotary compressor', '24-hour Timer', 'Auto Swing'],
    image: productAsset('hfh-series/hfh-card.jpg'),
    posterImage: productAsset('hfh-series/hfh-card.jpg'),
    gallery: [productAsset('hfh-series/hfh-card.jpg')],
    specs: {
      en: [
        'Cooling capacity: 54592 Btu/h',
        'Heating capacity: 58004 Btu/h',
        'R410A refrigerant',
        'Indoor noise level (max/min): 52 / 48 dB(A)',
        'Outdoor noise level: 62 dB(A)',
        'Power supply: 380~415V~/3Ph/50Hz',
        'Phase: Three phase',
        'Rated current (cooling): 7.97A',
        'Rated current (heating): 8.01A',
        'Rated power input (cooling): 16000W',
        'Rated power input (heating): 17000W',
        'Compressor type: Rotary',
        'Liquid pipe size: 3/8 inch',
        'Gas pipe size: 3/4 inch',
        'Max. piping length / height difference: 30 / 50m',
        'Climate class: T3',
        'Control type: L1',
        'Front display panel: Yes',
        'Remote control: Yes',
        'Washable front panel: Yes',
        'Washable propylene filter: Yes',
        '24-hour timer: Yes',
        '4-speed fan with auto mode: Yes',
        'Auto vertical swing: Yes',
        'Auto horizontal swing: Yes',
        'Sleep mode: Yes',
        'Touch keys: Yes',
        'Indoor unit dimensions (W×H×D): 580 × 1870 × 380',
        'Outdoor unit dimensions (W×H×D): 900 × 1170 × 320',
        'Indoor net weight: 52kg',
        'Outdoor net weight: 88kg',
        'Indoor package dimensions (W×H×D): 690 × 2000 × 480',
        'Outdoor package dimensions (W×H×D): 970 × 430 × 1300',
        'Indoor gross weight: 62kg',
        'Outdoor gross weight: 95kg',
      ],
      fa: [
        'ظرفیت سرمایش: 54592 بی‌تی‌یو بر ساعت',
        'ظرفیت گرمایش: 58004 بی‌تی‌یو بر ساعت',
        'مبرد R410A',
        'سطح صدای یونیت داخلی (حداکثر/حداقل): 52 / 48 دسی‌بل',
        'سطح صدای یونیت بیرونی: 62 دسی‌بل',
        'منبع تغذیه: 380~415V~/3Ph/50Hz',
        'فاز: سه‌فاز',
        'جریان مصرفی سرمایش: 7.97 آمپر',
        'جریان مصرفی گرمایش: 8.01 آمپر',
        'توان مصرفی سرمایش: 16000 وات',
        'توان مصرفی گرمایش: 17000 وات',
        'نوع کمپرسور: روتاری',
        'سایز لوله مایع: 3/8 اینچ',
        'سایز لوله گاز: 3/4 اینچ',
        'حداکثر طول/ارتفاع لوله‌کشی: 30 / 50 متر',
        'شرایط کارکرد محیطی: T3',
        'نوع کنترل: L1',
        'نمایشگر جلوی پنل داخلی: دارد',
        'ریموت کنترل: دارد',
        'پنل باز و بسته‌شونده با قابلیت شستشو: دارد',
        'فیلتر پلی‌پروپیلن قابل شستشو: دارد',
        'تایمر 24 ساعته: دارد',
        'کنترل چهارحالته سرعت فن به‌همراه حالت اتوماتیک: دارد',
        'تنظیم اتوماتیک پرتاب باد عمودی: دارد',
        'تنظیم اتوماتیک پرتاب باد افقی: دارد',
        'حالت خواب: دارد',
        'کلیدهای لمسی: دارد',
        'ابعاد یونیت داخلی (پهنا×ارتفاع×عمق): 580 × 1870 × 380 میلی‌متر',
        'ابعاد یونیت بیرونی (پهنا×ارتفاع×عمق): 900 × 1170 × 320 میلی‌متر',
        'وزن خالص یونیت داخلی: 52 کیلوگرم',
        'وزن خالص یونیت بیرونی: 88 کیلوگرم',
        'ابعاد بسته‌بندی یونیت داخلی (پهنا×ارتفاع×عمق): 690 × 2000 × 480 میلی‌متر',
        'ابعاد بسته‌بندی یونیت بیرونی (پهنا×ارتفاع×عمق): 970 × 430 × 1300 میلی‌متر',
        'وزن ناخالص یونیت داخلی: 62 کیلوگرم',
        'وزن ناخالص یونیت بیرونی: 95 کیلوگرم',
      ],
    },
    copy: {
      en: {
        name: 'Hisense Air Conditioner HFH-55FM',
        tagline: 'HFH Series | Cooling and heating',
        description:
          'Hisense HFH-55FM floor-standing air conditioner with high-capacity cooling and heating, three-phase power supply, rotary compressor, and practical control features for demanding commercial spaces.',
        highlights: [
          'Cooling and heating',
          '54592 Btu/h cooling capacity',
          'Three-phase 380~415V power supply',
          'Rotary compressor',
          '24-hour timer and auto swing',
        ],
        blocks: {},
      },
      fa: {
        name: 'کولر گازی هایسنس HFH-55FM',
        tagline: 'سری HFH | سرمایش و گرمایش',
        description:
          'کولر گازی ایستاده هایسنس HFH-55FM با ظرفیت بالای سرمایش و گرمایش، برق سه‌فاز، کمپرسور روتاری و امکانات کنترلی کاربردی، انتخابی مناسب برای فضاهای بزرگ و محیط‌های تجاری است.',
        highlights: [
          'سرمایش و گرمایش',
          'ظرفیت سرمایش 54592 بی‌تی‌یو بر ساعت',
          'برق سه‌فاز 380~415V',
          'کمپرسور روتاری',
          'تایمر 24 ساعته و پرتاب باد خودکار',
        ],
        blocks: {},
      },
    },
  },
  {
    id: 'hfh-96fm',
    sku: 'HFH-96FM',
    series: 'HFH',
    seriesLabel: 'HFH Series',
    sizes: ['92100 BTU'],
    extras: ['Cooling and heating', 'Rotary compressor', '24-hour Timer', 'Auto Swing'],
    image: productAsset('hfh-series/hfh-96-card.jpg'),
    posterImage: productAsset('hfh-series/hfh-96-card.jpg'),
    gallery: [
      productAsset('hfh-series/hfh-96-card.jpg'),
      productAsset('hfh-series/hfh-96-outdoor.jpg'),
    ],
    specs: {
      en: [
        'Cooling capacity: 92100 Btu/h',
        'Heating capacity: 98900 Btu/h',
        'R410A refrigerant',
        'Indoor noise level (max): 60 dB(A)',
        'Outdoor noise level: 67 dB(A)',
        'Power supply: 380~415V~/3Ph/50Hz',
        'Phase: Three phase',
        'Rated current (cooling): 16A',
        'Rated current (heating): 15A',
        'Rated power input (cooling): 27000W',
        'Rated power input (heating): 29000W',
        'Compressor type: Rotary',
        'Liquid pipe size: 3/8 inch',
        'Gas pipe size: 3/4 inch',
        'Max. piping length / height difference: 30 / 50m',
        'Climate class: T1',
        'Control type: L1',
        'Front display panel: Yes',
        'Remote control: Yes',
        'Washable front panel: Yes',
        'Washable propylene filter: Yes',
        '24-hour timer: Yes',
        '4-speed fan with auto mode: Yes',
        'Auto vertical swing: Yes',
        'Auto horizontal swing: Yes',
        'Sleep mode: Yes',
        'Touch keys: Yes',
        'Indoor unit dimensions (W×H×D): 1200 × 1890 × 340',
        'Outdoor unit dimensions (W×H×D): 1280 × 908 × 700',
        'Indoor net weight: 118kg',
        'Outdoor net weight: 185kg',
        'Indoor package dimensions (W×H×D): 1302 × 2072 × 437',
        'Outdoor package dimensions (W×H×D): 1300 × 1060 × 766',
        'Indoor gross weight: 142kg',
        'Outdoor gross weight: 205kg',
      ],
      fa: [
        'ظرفیت سرمایش: 92100 بی‌تی‌یو بر ساعت',
        'ظرفیت گرمایش: 98900 بی‌تی‌یو بر ساعت',
        'مبرد R410A',
        'سطح صدای یونیت داخلی (حداکثر): 60 دسی‌بل',
        'سطح صدای یونیت بیرونی: 67 دسی‌بل',
        'منبع تغذیه: 380~415V~/3Ph/50Hz',
        'فاز: سه‌فاز',
        'جریان مصرفی سرمایش: 16 آمپر',
        'جریان مصرفی گرمایش: 15 آمپر',
        'توان مصرفی سرمایش: 27000 وات',
        'توان مصرفی گرمایش: 29000 وات',
        'نوع کمپرسور: روتاری',
        'سایز لوله مایع: 3/8 اینچ',
        'سایز لوله گاز: 3/4 اینچ',
        'حداکثر طول/ارتفاع لوله‌کشی: 30 / 50 متر',
        'شرایط کارکرد محیطی: T1',
        'نوع کنترل: L1',
        'نمایشگر جلوی پنل داخلی: دارد',
        'ریموت کنترل: دارد',
        'پنل باز و بسته‌شونده با قابلیت شستشو: دارد',
        'فیلتر پلی‌پروپیلن قابل شستشو: دارد',
        'تایمر 24 ساعته: دارد',
        'کنترل چهارحالته سرعت فن به‌همراه حالت اتوماتیک: دارد',
        'تنظیم اتوماتیک پرتاب باد عمودی: دارد',
        'تنظیم اتوماتیک پرتاب باد افقی: دارد',
        'حالت خواب: دارد',
        'کلیدهای لمسی: دارد',
        'ابعاد یونیت داخلی (پهنا×ارتفاع×عمق): 1200 × 1890 × 340 میلی‌متر',
        'ابعاد یونیت بیرونی (پهنا×ارتفاع×عمق): 1280 × 908 × 700 میلی‌متر',
        'وزن خالص یونیت داخلی: 118 کیلوگرم',
        'وزن خالص یونیت بیرونی: 185 کیلوگرم',
        'ابعاد بسته‌بندی یونیت داخلی (پهنا×ارتفاع×عمق): 1302 × 2072 × 437 میلی‌متر',
        'ابعاد بسته‌بندی یونیت بیرونی (پهنا×ارتفاع×عمق): 1300 × 1060 × 766 میلی‌متر',
        'وزن ناخالص یونیت داخلی: 142 کیلوگرم',
        'وزن ناخالص یونیت بیرونی: 205 کیلوگرم',
      ],
    },
    copy: {
      en: {
        name: 'Hisense Air Conditioner HFH-96FM',
        tagline: 'HFH Series | Cooling and heating',
        description:
          'Hisense HFH-96FM floor-standing air conditioner with very high cooling and heating capacity, three-phase power supply, rotary compressor, and practical control features for large commercial spaces.',
        highlights: [
          'Cooling and heating',
          '92100 Btu/h cooling capacity',
          'Three-phase 380~415V power supply',
          'Rotary compressor',
          '24-hour timer and auto swing',
        ],
        blocks: {},
      },
      fa: {
        name: 'کولر گازی هایسنس HFH-96FM',
        tagline: 'سری HFH | سرمایش و گرمایش',
        description:
          'کولر گازی ایستاده هایسنس HFH-96FM با ظرفیت بسیار بالای سرمایش و گرمایش، برق سه‌فاز، کمپرسور روتاری و امکانات کنترلی کاربردی، راهکاری قدرتمند برای فضاهای بزرگ و محیط‌های تجاری است.',
        highlights: [
          'سرمایش و گرمایش',
          'ظرفیت سرمایش 92100 بی‌تی‌یو بر ساعت',
          'برق سه‌فاز 380~415V',
          'کمپرسور روتاری',
          'تایمر 24 ساعته و پرتاب باد خودکار',
        ],
        blocks: {},
      },
    },
  },
];

export const RAC_PRODUCTS: WmProduct[] = [
  ...hrhProducts,
  ...hihProducts,
  ...hrtcProducts,
  ...hfhProducts,
];
