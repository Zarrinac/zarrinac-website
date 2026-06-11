import { type DcodeProduct } from '@/types/dcode';
import { dcodeAsset } from '@/lib/dcode/brand';

// Bundled fallback catalog for the D'code brand, used when a database is not
// available. Data extracted from the official D'code LED TV catalogue
// (public/dcode/led/r6d-files/Dcode-LED-TV.pdf). Today D'code ships a single LED
// line (R6D) in three sizes; AC and other families will be added later.

// R6D LED TV assets — each size ships a front (A) and angled (B) render.
const r6d55Image = dcodeAsset('led/r6d-files/DCODE-55-A.png');
const r6d55ImageB = dcodeAsset('led/r6d-files/DCODE-55-B.png');
const r6d65Image = dcodeAsset('led/r6d-files/DCODE-65-A.png');
const r6d65ImageB = dcodeAsset('led/r6d-files/DCODE-65-B.png');
const r6d75Image = dcodeAsset('led/r6d-files/DCODE-75-A.png');
const r6d75ImageB = dcodeAsset('led/r6d-files/DCODE-75-B.png');
const r6dRemoteImage = dcodeAsset('led/r6d-files/DCode-Remote.png');
const r6dVideo = dcodeAsset('led/r6d-files/DCODE-LED.mp4');

// Feature icons (white assets for the dark D'code theme), reused from the Hisense
// TV icon set for features the R6D genuinely has per the catalogue.
const iconShareToTv = dcodeAsset('icons/share-to-tv.png');
const iconVoiceControl = dcodeAsset('icons/voice-control.png');
const iconHdr10 = dcodeAsset('icons/hdr10.png');

export const DCODE_PRODUCTS: DcodeProduct[] = [
  {
    id: 'r6d',
    brand: 'dcode',
    category: 'led',
    series: 'R6D',
    panel: '4K UHD LED',
    resolution: '4K (3840 × 2160)',
    os: 'Android 11',
    storage: '32GB internal storage',
    viewingAngle: '178°',
    tuner: 'Built-in DVB-T/T2 digital tuner, Time Shift',
    sound: 'Headphone and Optical (SPDIF) output',
    connectivity: [
      'WiFi',
      'Bluetooth',
      'HDMI x3',
      'USB 2.0 x2',
      'Component',
      'AV',
      'miracast / e-share',
    ],
    warrantyMonths: 24,
    remotes: {
      en: ['Standard IR remote control', 'Bluetooth Air Mouse remote control'],
      fa: ['ریموت کنترل نرمال (IR)', 'ریموت کنترل بلوتوثی (Air Mouse)'],
    },
    extras: [
      'Android 11 Smart TV',
      '4K UHD',
      '32GB internal storage',
      'Dual remote (IR + Bluetooth Air Mouse)',
      'High-End Frame and Stand',
    ],
    heroImage: r6d75Image,
    heroVideo: r6dVideo,
    remoteImage: r6dRemoteImage,
    // Angled lifestyle shots only — the straight-on (A) renders already appear in
    // the hero / size selector, so the gallery shows the distinct angled scenes.
    gallery: [r6d55ImageB, r6d65ImageB, r6d75ImageB],
    variants: [
      {
        sku: 'R6D55KE8050UW',
        size: '55"',
        diagonalInch: 55,
        image: r6d55Image,
        dimensionsWithoutStand: '1230 × 77 × 719 mm',
        dimensionsWithStand: '1230 × 257 × 795 mm',
        netWeight: '12.5 kg',
      },
      {
        sku: 'R6D65KE8050UW',
        size: '65"',
        diagonalInch: 65,
        image: r6d65Image,
        dimensionsWithoutStand: '1450 × 77 × 842 mm',
        dimensionsWithStand: '1450 × 290 × 890 mm',
        netWeight: '19 kg',
      },
      {
        sku: 'R6D75KE8050UW',
        size: '75"',
        diagonalInch: 75,
        image: r6d75Image,
        dimensionsWithoutStand: '1670 × 84 × 960 mm',
        dimensionsWithStand: '1670 × 363 × 1030 mm',
        netWeight: '27.5 kg',
      },
    ],
    featureCards: [
      {
        title: { en: '4K UHD · Android 11', fa: '4K UHD · اندروید ۱۱' },
        description: {
          en: 'Sharp 8MP 4K picture on the Android 11 smart platform with a wide app library.',
          fa: 'تصویر شفاف هشت مگاپیکسلی 4K روی پلتفرم هوشمند اندروید ۱۱ با کتابخانه‌ی گسترده‌ی اپلیکیشن‌ها.',
        },
      },
      {
        title: { en: 'Share to TV', fa: 'اشتراک‌گذاری با تلویزیون' },
        description: {
          en: 'Mirror your phone to the TV over miracast / e-share.',
          fa: 'انعکاس تصویر گوشی روی تلویزیون با miracast / e-share.',
        },
        icon: iconShareToTv,
      },
      {
        title: { en: 'HDR10', fa: 'HDR10' },
        description: {
          en: 'High dynamic range for deeper contrast and richer 4K colour.',
          fa: 'محدوده‌ی دینامیکی بالا برای کنتراست عمیق‌تر و رنگ‌های غنی‌تر 4K.',
        },
        icon: iconHdr10,
      },
      {
        title: { en: 'Voice Control', fa: 'کنترل صوتی' },
        description: {
          en: 'Hands-free voice search and control on the Android 11 platform.',
          fa: 'جستجو و کنترل صوتی روی پلتفرم اندروید ۱۱.',
        },
        icon: iconVoiceControl,
      },
      {
        title: { en: 'High-End Frame and Stand', fa: 'بدنه و پایه‌ی High-End' },
        description: {
          en: 'A premium slim frame and metal stand for a refined look in any room.',
          fa: 'قاب باریک و پایه‌ی فلزی پریمیوم برای ظاهری شکیل در هر فضایی.',
        },
      },
    ],
    specs: {
      en: [
        'Smart TV',
        'Android 11 operating system',
        'High-clarity, sharp picture',
        '8MP 4K picture',
        '3840 × 2160 resolution',
        '178° viewing angle',
        '32GB internal storage',
        'TV program recording',
        'Time Shift support',
        'UHD technology',
        'Built-in digital tuner',
        'WiFi and Bluetooth connectivity',
        'Phone connectivity (miracast / e-share)',
        'Built-in DVB-T/T2 digital tuner',
        'Headphone and Optical output',
        'Component, AV, USB 2.0 x2, HDMI x3',
        '24-month warranty',
        'Two remote controls (standard IR + Bluetooth Air Mouse)',
      ],
      fa: [
        'تلویزیون هوشمند Smart',
        'دارای سیستم عامل Android 11',
        'وضوح تصویر بالا و شفاف',
        'تصویر هشت مگا پیکسل 4K',
        'رزولوشن ۳۸۴۰ × ۲۱۶۰',
        'زاویه دید ۱۷۸ درجه',
        'دارای ۳۲ گیگابایت حافظه‌ی داخلی',
        'قابلیت ضبط برنامه‌های تلویزیونی',
        'مجهز به Time Shift',
        'مجهز به فناوری UHD',
        'گیرنده‌ی دیجیتال داخلی',
        'قابلیت اتصال به WIFI و Bluetooth',
        'قابلیت اتصال به گوشی (miracast / e-share)',
        'تیونر دیجیتال داخلی DVB-T/T2',
        'خروجی هدفون و Optical',
        'Component، AV، دو درگاه USB 2.0 و سه درگاه HDMI',
        '۲۴ ماه ضمانت',
        'دو ریموت کنترل (نرمال IR و بلوتوثی Air Mouse)',
      ],
    },
    copy: {
      en: {
        name: "D'code R6D 4K Smart LED TV",
        tagline: '4K UHD Android 11 smart TV in 55, 65, and 75 inches.',
        description:
          "D'code's R6D LED line pairs a sharp 4K UHD panel with the Android 11 smart platform, 32GB of storage, and dual remotes — all wrapped in a high-end slim frame and metal stand.",
        highlights: [
          '4K UHD (3840 × 2160) LED panel with 178° viewing angle.',
          'Android 11 smart platform with 32GB internal storage.',
          'Time Shift, TV recording, and built-in DVB-T/T2 tuner.',
          'WiFi, Bluetooth, and phone mirroring (miracast / e-share).',
          'Two remotes included: standard IR and Bluetooth Air Mouse.',
          'Available in 55", 65", and 75" with a high-end frame and stand.',
        ],
      },
      fa: {
        name: "تلویزیون هوشمند LED 4K D'code مدل R6D",
        tagline: 'تلویزیون هوشمند 4K UHD با اندروید ۱۱ در سه سایز ۵۵، ۶۵ و ۷۵ اینچ.',
        description:
          "سری R6D برند D'code، پنل شفاف 4K UHD را با پلتفرم هوشمند اندروید ۱۱، ۳۲ گیگابایت حافظه‌ی داخلی و دو ریموت کنترل ترکیب کرده است؛ همه در قابی باریک و پایه‌ای فلزی با کیفیت High-End.",
        highlights: [
          'پنل LED 4K UHD (۳۸۴۰ × ۲۱۶۰) با زاویه دید ۱۷۸ درجه.',
          'پلتفرم هوشمند اندروید ۱۱ با ۳۲ گیگابایت حافظه‌ی داخلی.',
          'قابلیت Time Shift، ضبط برنامه و تیونر دیجیتال داخلی DVB-T/T2.',
          'اتصال WiFi، بلوتوث و اشتراک تصویر گوشی (miracast / e-share).',
          'همراه با دو ریموت: نرمال (IR) و بلوتوثی Air Mouse.',
          'موجود در سه سایز ۵۵، ۶۵ و ۷۵ اینچ با بدنه و پایه‌ی High-End.',
        ],
      },
    },
  },
];

// Convenience lookups for pages and (later) the DB→fallback chain.
export const getDcodeProductById = (id: string): DcodeProduct | undefined =>
  DCODE_PRODUCTS.find((product) => product.id === id);

export const getDcodeProductBySku = (sku: string): DcodeProduct | undefined =>
  DCODE_PRODUCTS.find((product) => product.variants.some((variant) => variant.sku === sku));
