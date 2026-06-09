import type { Metadata } from 'next';
import Link from 'next/link';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { getLocale, getTranslations } from 'next-intl/server';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import type { Locale } from '@/i18n/routing';
import { prisma } from '@/lib/db';
import { mediaUrl } from '@/lib/mediaUrl';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

type IconType = typeof ShieldOutlinedIcon;

type Highlight = {
  label: string;
  value: string;
  icon: IconType;
};

type TermSection = {
  title: string;
  description?: string;
  icon: IconType;
  items: string[];
};

type DownloadItem = {
  label: string;
  description: string;
  href: string;
};

type WarrantyContent = {
  intro: {
    title: string;
    description: string;
  };
  highlights: Highlight[];
  sections: TermSection[];
  note: {
    title: string;
    description: string;
  };
  support: {
    title: string;
    description: string;
    phoneLabel: string;
    phoneValue: string;
    hoursLabel: string;
    hoursValue: string;
    primaryAction: {
      label: string;
      href: string;
    };
    secondaryAction: {
      label: string;
      href: string;
    };
  };
  downloads: {
    title: string;
    description: string;
    items: DownloadItem[];
  };
  officialLinks: {
    eyebrow: string;
    title: string;
    items: Array<{
      href: string;
      label: string;
      description: string;
    }>;
  };
};

const DOWNLOADS: Record<Locale, DownloadItem[]> = {
  fa: [
    {
      label: 'دانلود نسخه فارسی PDF',
      description: 'شرایط و ضوابط گارانتی و وارانتی محصولات به زبان فارسی.',
      href: '/media/downloads/warranty-and-guarantee-fa.pdf',
    },
    {
      label: 'دانلود نسخه انگلیسی PDF',
      description: 'English warranty, guarantee, and after-sales service terms.',
      href: '/media/downloads/warranty-and-guarantee-en.pdf',
    },
  ],
  en: [
    {
      label: 'Download English PDF',
      description: 'English warranty, guarantee, and after-sales service terms.',
      href: '/media/downloads/warranty-and-guarantee-en.pdf',
    },
    {
      label: 'Download Persian PDF',
      description: 'Persian warranty and guarantee terms for Hisense Iran customers.',
      href: '/media/downloads/warranty-and-guarantee-fa.pdf',
    },
  ],
};

const WARRANTY_CONTENT: Record<Locale, WarrantyContent> = {
  fa: {
    intro: {
      title: 'شرایط گارانتی، ضمانت و خدمات پس از فروش محصولات هایسنس',
      description:
        'این صفحه خلاصه‌ای خوانا و قابل جستجو از شرایط گارانتی محصولات عرضه‌شده توسط صنایع زرین نمای کاسپین، نماینده رسمی Hisense در ایران است. متن زیر برای کمک به مشتریان در شناخت پوشش گارانتی، مسئولیت‌ها، موارد خارج از ضمانت و مسیر دریافت خدمات تنظیم شده است.',
    },
    highlights: [
      {
        label: 'مدت گارانتی محصول',
        value: '۲۴ ماه از تاریخ نصب',
        icon: ShieldOutlinedIcon,
      },
      {
        label: 'گارانتی کمپرسور',
        value: 'حداقل ۶۰ ماه',
        icon: VerifiedOutlinedIcon,
      },
      {
        label: 'پشتیبانی پس از گارانتی',
        value: 'تا ۱۰ سال خدمات و قطعات',
        icon: SupportAgentOutlinedIcon,
      },
      {
        label: 'نصب استاندارد',
        value: 'رایگان طبق شرایط اعلام‌شده',
        icon: HandymanOutlinedIcon,
      },
    ],
    sections: [
      {
        title: 'تعاریف مهم',
        icon: RuleOutlinedIcon,
        items: [
          'گارانتی یعنی تعهد شرکت برای تعمیر یا تعویض قطعات معیوب در بازه زمانی مشخص و طبق شرایط ضمانت.',
          'ضمانت یا Guarantee تعهد گسترده‌تری است که می‌تواند شامل نصب، تعمیر، تعویض یا بازپرداخت در شرایط تعریف‌شده باشد.',
          'دوره خدمات پس از فروش، بازه ارائه خدمات، قطعات یدکی و پشتیبانی فنی پس از پایان گارانتی است که ممکن است شامل هزینه باشد.',
          'استفاده صحیح یعنی استفاده از دستگاه مطابق دفترچه راهنما، استانداردهای نصب و دستورالعمل‌های شرکت سازنده.',
        ],
      },
      {
        title: 'شرایط عمومی گارانتی',
        description: 'مبنای دریافت خدمات رسمی، نصب و استفاده استاندارد و ارائه مدارک معتبر است.',
        icon: AssignmentTurnedInOutlinedIcon,
        items: [
          'تمامی محصولات طبق شرایط استاندارد شامل نصب رایگان هستند. برای کولر گازی، لوله‌کشی تا ۵ متر در شرایط نصب استاندارد در نظر گرفته می‌شود.',
          'گارانتی محصول از تاریخ نصب به مدت ۲۴ ماه معتبر است، مگر اینکه در کارت گارانتی یا قرارداد فروش مدت دیگری اعلام شده باشد.',
          'گارانتی کمپرسور برای محصولات مشمول، حداقل ۶۰ ماه است.',
          'پشتیبانی خدمات پس از فروش و تأمین قطعات، طبق ضوابط شرکت تا ۱۰ سال ارائه می‌شود.',
          'خدمات گارانتی فقط از طریق مراکز خدمات مجاز و نمایندگان رسمی در ایران انجام می‌شود.',
          'ارائه کارت گارانتی، اطلاعات خرید یا مدارک نصب برای ثبت و پیگیری خدمات ضروری است.',
        ],
      },
      {
        title: 'سیاست سرویس، تعویض و بازپرداخت',
        icon: Inventory2OutlinedIcon,
        items: [
          'در صورت مشاهده ایراد ساختاری در ۲۴ ساعت نخست پس از نصب، امکان بررسی برای تعویض دستگاه وجود دارد.',
          'ایرادهای تولیدی که تا ۹۰ روز پس از نصب یا تحویل تأیید شوند، ممکن است طبق نظر کارشناسی منجر به تعویض محصول شوند.',
          'خرابی‌های تکرارشونده، در صورت تأیید فنی و احراز شرایط، می‌توانند مشمول بررسی برای تعویض شوند.',
          'اگر تعمیر در بازه زمانی تعریف‌شده امکان‌پذیر نباشد، تعویض یا بازپرداخت طبق ضوابط و قیمت روز قابل بررسی است.',
          'پس از پایان دوره گارانتی، محاسبات بازپرداخت یا خدمات جایگزین با در نظر گرفتن استهلاک انجام می‌شود.',
        ],
      },
      {
        title: 'مسئولیت‌های مشتری',
        icon: HandymanOutlinedIcon,
        items: [
          'فراهم کردن شرایط ایمن نصب مانند دسترسی مناسب، داربست، بالابر یا نردبان در صورت نیاز.',
          'پرداخت هزینه متریال مصرفی و موارد خارج از نصب استاندارد مانند لوله، کابل، پایه، سوراخ‌کاری یا تغییرات ساختمانی.',
          'استفاده از دستگاه مطابق دفترچه راهنما و جلوگیری از فشار کاری یا شرایط محیطی نامناسب.',
          'نگهداری مدارک خرید، کارت گارانتی و اطلاعات نصب برای فعال‌سازی یا پیگیری خدمات.',
        ],
      },
      {
        title: 'موارد خارج از پوشش گارانتی',
        icon: GppMaybeOutlinedIcon,
        items: [
          'آسیب ناشی از استفاده نادرست، نصب غیرمجاز، نوسان برق، حوادث، رطوبت غیرمجاز یا عوامل محیطی خارج از استاندارد.',
          'صدمات فیزیکی مانند شکستگی، ضربه، فرورفتگی، خط و خش یا آسیب حمل‌ونقل پس از تحویل.',
          'هرگونه تعمیر، باز کردن دستگاه، تغییر قطعه یا دستکاری توسط افراد یا مراکز غیرمجاز.',
          'ایرادهای ناشی از برق‌کشی، ارت، ولتاژ یا شرایط ورودی خارج از محدوده استاندارد دستگاه.',
          'هزینه نصب‌های اضافه، تغییرات ساختمانی، تجهیزات جانبی یا متریال مصرفی که جزو تعهد گارانتی نیستند.',
        ],
      },
      {
        title: 'نکات تکمیلی خدمات',
        icon: AccessTimeOutlinedIcon,
        items: [
          'شارژ گاز کولر گازی برای لوله‌کشی تا ۵ متر در شرایط استاندارد لحاظ شده است و متراژ بیشتر شامل هزینه جداگانه می‌شود.',
          'حمل‌ونقل خدمات در محدوده شهری در دوره گارانتی طبق شرایط شرکت رایگان است.',
          'برای مناطق خارج از محدوده شهری یا مسیرهای خاص، هزینه ایاب‌وذهاب یا حمل ممکن است جداگانه محاسبه شود.',
          'برخی لوازم جانبی، مصرفی یا اقلام وابسته به نوع محصول ممکن است تحت پوشش گارانتی نباشند.',
        ],
      },
    ],
    note: {
      title: 'توجه مهم',
      description:
        'این متن نسخه وب و بهینه‌شده برای مطالعه سریع است. در صورت وجود اختلاف، کارت گارانتی محصول، فاکتور خرید، قرارداد فروش و نسخه رسمی PDF مبنای بررسی کارشناسی خواهند بود.',
    },
    support: {
      title: 'برای پیگیری گارانتی با ما تماس بگیرید',
      description:
        'اگر درباره پوشش ضمانت، وضعیت سرویس یا مدارک موردنیاز سؤال دارید، از مسیرهای رسمی پشتیبانی استفاده کنید.',
      phoneLabel: 'امور مشتریان و نمایندگان',
      phoneValue: '021 72133',
      hoursLabel: 'ساعات پاسخگویی',
      hoursValue: 'شنبه تا چهارشنبه ۸:۳۰ تا ۱۶:۰۰ | پنجشنبه ۸:۳۰ تا ۱۳:۳۰',
      primaryAction: {
        label: 'تماس با پشتیبانی',
        href: 'tel:02172133',
      },
      secondaryAction: {
        label: 'ثبت شکایت',
        href: '/complaint',
      },
    },
    downloads: {
      title: 'دانلود فایل‌های PDF',
      description:
        'متن کامل شرایط گارانتی را می‌توانید در پایان صفحه به‌صورت PDF فارسی یا انگلیسی دانلود کنید.',
      items: DOWNLOADS.fa,
    },
    officialLinks: {
      eyebrow: 'مسیرهای رسمی',
      title: 'لینک‌های مرتبط با گارانتی و خدمات هایسنس ایران',
      items: [
        {
          href: '/faq',
          label: 'سوالات متداول',
          description: 'پاسخ سریع به سوالات نصب، تعمیر، جابجایی و پوشش گارانتی محصولات.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'ثبت درخواست سرویس و تعمیرات رسمی محصولات هایسنس.',
        },
        {
          href: '/contact-us',
          label: 'تماس با هایسنس ایران',
          description: 'شماره‌ها، آدرس دفتر مرکزی و کانال‌های رسمی ارتباط با تیم پشتیبانی.',
        },
      ],
    },
  },
  en: {
    intro: {
      title: 'Hisense Warranty, Guarantee, and After-Sales Service Terms',
      description:
        'This page provides a readable, searchable version of the warranty and guarantee terms for products supplied by Zarrin Namaye Caspian Industries, the official Hisense representative in Iran. It explains coverage, customer responsibilities, exclusions, and how to request official service.',
    },
    highlights: [
      {
        label: 'Product warranty',
        value: '24 months from installation',
        icon: ShieldOutlinedIcon,
      },
      {
        label: 'Compressor warranty',
        value: 'At least 60 months',
        icon: VerifiedOutlinedIcon,
      },
      {
        label: 'After-sales support',
        value: 'Up to 10 years',
        icon: SupportAgentOutlinedIcon,
      },
      {
        label: 'Standard installation',
        value: 'Free under stated conditions',
        icon: HandymanOutlinedIcon,
      },
    ],
    sections: [
      {
        title: 'Definitions',
        icon: RuleOutlinedIcon,
        items: [
          'Warranty means the supplier commitment to repair or replace defective parts free of charge within a specified period and under defined conditions.',
          'Guarantee is a broader service commitment that may include installation, repair, replacement, or refund under defined conditions.',
          'After-sales service period means the paid support period after warranty expiration, including spare parts and technical support.',
          'Proper use means using the product according to the manufacturer instructions, installation standards, and product guidelines.',
        ],
      },
      {
        title: 'General Warranty Terms',
        description:
          'Official warranty service depends on standard installation, proper use, and valid service documents.',
        icon: AssignmentTurnedInOutlinedIcon,
        items: [
          'All products include free installation under standard conditions. For AC units, up to 5 meters of piping is included under standard installation terms.',
          'Warranty is valid for 24 months from the installation date unless another period is stated on the warranty card or sales contract.',
          'Compressor warranty is at least 60 months for eligible products.',
          'After-sales support and spare parts availability are provided up to 10 years according to company policy.',
          'Warranty service is provided only through authorized service centers and official representatives in Iran.',
          'The warranty card, purchase information, or installation documents must be presented for service requests.',
        ],
      },
      {
        title: 'Service, Replacement, and Refund Policy',
        icon: Inventory2OutlinedIcon,
        items: [
          'Structural defects reported within 24 hours of installation may qualify for replacement review.',
          'Manufacturing defects confirmed within 90 days may lead to product replacement after technical approval.',
          'Repeated failures may qualify for replacement if approved by the technical team and if warranty conditions are met.',
          'If repair is not possible within defined timelines, replacement or refund based on company policy and current price may be offered.',
          'After the warranty period, refund or replacement calculations may consider product depreciation.',
        ],
      },
      {
        title: 'Customer Responsibilities',
        icon: HandymanOutlinedIcon,
        items: [
          'Provide safe installation conditions, including proper access, scaffolding, ladders, or lifting equipment when required.',
          'Cover the cost of consumables and non-standard installation items such as pipes, cables, brackets, drilling, or structural modifications.',
          'Use the product according to the user manual and avoid unsuitable operating or environmental conditions.',
          'Keep purchase documents, warranty card, and installation details for warranty activation and service follow-up.',
        ],
      },
      {
        title: 'Exclusions from Warranty',
        icon: GppMaybeOutlinedIcon,
        items: [
          'Damage caused by improper use, unauthorized installation, power fluctuation, accidents, unsuitable humidity, or external environmental factors.',
          'Physical damage such as breakage, impact, dents, scratches, or transport damage after delivery.',
          'Any repair, disassembly, part replacement, or modification performed by unauthorized people or service centers.',
          'Issues caused by wiring, grounding, voltage, or input conditions outside the product standard operating range.',
          'Additional installation costs, structural changes, accessories, or consumables that are not included in warranty obligations.',
        ],
      },
      {
        title: 'Additional Service Notes',
        icon: AccessTimeOutlinedIcon,
        items: [
          'AC gas charge is included for up to 5 meters of piping under standard conditions; extra length may incur additional cost.',
          'Service transportation within city limits is free during the warranty period according to company terms.',
          'Outside city limits or special routes may include additional travel or transportation charges.',
          'Some accessories, consumables, or product-specific items may not be covered by warranty.',
        ],
      },
    ],
    note: {
      title: 'Important Note',
      description:
        'This is the website-optimized reading version. In case of conflict, the product warranty card, purchase invoice, sales contract, and official PDF version will be used for technical review.',
    },
    support: {
      title: 'Contact us for warranty support',
      description:
        'If you have questions about warranty coverage, service status, or required documents, use the official support channels.',
      phoneLabel: 'Customer Service',
      phoneValue: '+98 21 72133',
      hoursLabel: 'Working hours',
      hoursValue: 'Saturday-Wednesday 8:30 AM-4:00 PM | Thursday 8:30 AM-1:30 PM',
      primaryAction: {
        label: 'Call Support',
        href: 'tel:+982172133',
      },
      secondaryAction: {
        label: 'Submit Complaint',
        href: '/complaint',
      },
    },
    downloads: {
      title: 'Download PDF Files',
      description:
        'You can download the official warranty and guarantee files in English or Persian at the end of this page.',
      items: DOWNLOADS.en,
    },
    officialLinks: {
      eyebrow: 'Official paths',
      title: 'Related Hisense Iran warranty and service links',
      items: [
        {
          href: '/faq',
          label: 'FAQ',
          description:
            'Quick answers about installation, repair, relocation, and warranty coverage.',
        },
        {
          href: '/hisense-repair',
          label: 'Repair and support',
          description: 'Request official service and repair for Hisense products.',
        },
        {
          href: '/contact-us',
          label: 'Contact Hisense Iran',
          description:
            'Verified numbers, head-office address, and official customer support channels.',
        },
      ],
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.warranty');
  const localizedPath = `/${locale}/warranty-and-guarantee`;
  const languageAlternates = getLanguageAlternates('/warranty-and-guarantee');

  return {
    title: routeTranslations('title'),
    description: routeTranslations('description'),
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: routeTranslations('title'),
      description: routeTranslations('description'),
      url: `${SITE_URL}${localizedPath}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: routeTranslations('title'),
      description: routeTranslations('description'),
    },
  };
}

function getSchemaText(content: WarrantyContent) {
  return [
    content.intro.description,
    ...content.sections.flatMap((section) => [section.title, ...section.items]),
  ].join(' ');
}

async function getDownloadItems(locale: Locale, fallback: DownloadItem[]) {
  if (!prisma) {
    return fallback;
  }

  try {
    const assets = await prisma.downloadAsset.findMany({
      where: {
        pageKey: 'warranty-and-guarantee',
        locale,
        isActive: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { fileLocale: 'asc' }],
    });

    if (assets.length === 0) {
      return fallback;
    }

    return assets.map((asset) => ({
      label: asset.label,
      description: asset.description,
      href: asset.path,
    }));
  } catch (error) {
    console.error('[warranty-and-guarantee] failed to load download assets', error);
    return fallback;
  }
}

export default async function WarrantyAndGuaranteePage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.warranty');
  const content = WARRANTY_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/warranty-and-guarantee`,
  });
  const downloadItems = await getDownloadItems(locale, content.downloads.items);
  const isRTL = locale === 'fa';
  const resolveHref = (href: string) => (href.startsWith('/') ? `/${locale}${href}` : href);
  const pageUrl = `${SITE_URL}/${locale}/warranty-and-guarantee`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.intro.title,
    description: routeTranslations('description'),
    articleBody: getSchemaText(content),
    inLanguage: getLocaleLanguage(locale),
    url: pageUrl,
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: locale === 'fa' ? 'شرکت صنایع زرین نمای کاسپین' : 'Zarrin Namaye Caspian Industries',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: locale === 'fa' ? 'شرکت صنایع زرین نمای کاسپین' : 'Zarrin Namaye Caspian Industries',
    },
  };

  return (
    <div className="space-y-10 pb-16 pt-6 sm:space-y-12 sm:pt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={articleSchema} />

      <RouteHero
        eyebrow={routeTranslations('eyebrow')}
        title={routeTranslations('title')}
        description={routeTranslations('description')}
        locale={locale}
        breadcrumbItems={breadcrumbItems}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-(--brand-color)">
              {routeTranslations('eyebrow')}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-(--default-black-font) sm:text-3xl">
              {content.intro.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-(--text-muted-color) sm:text-base">
              {content.intro.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {content.highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--brand-color) text-white">
                    <Icon fontSize="small" />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-bold text-(--default-black-font)">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {content.sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--surface-muted-color) text-(--brand-color)">
                    <Icon fontSize="small" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-(--default-black-font)">
                      {section.title}
                    </h2>
                    {section.description ? (
                      <p className="mt-2 text-sm leading-7 text-(--text-muted-color)">
                        {section.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-sm leading-7 text-(--text-muted-color)">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-(--brand-color)"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-(--border-color) bg-(--surface-muted-color) p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white">
              <GppMaybeOutlinedIcon fontSize="small" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-(--default-black-font)">
                {content.note.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-(--text-muted-color)">
                {content.note.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-(--surface-muted-color) px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-(--default-black-font)">
              {content.support.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--text-muted-color)">
              {content.support.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={content.support.primaryAction.href}
                className="inline-flex items-center justify-center rounded-full bg-(--brand-color) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark)"
              >
                {content.support.primaryAction.label}
              </a>
              <Link
                href={resolveHref(content.support.secondaryAction.href)}
                className="inline-flex items-center justify-center rounded-full border border-(--border-color) bg-(--surface-color) px-5 py-2.5 text-sm font-semibold text-(--default-black-font) transition hover:border-(--brand-color) hover:text-(--brand-color)"
              >
                {content.support.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={content.support.primaryAction.href}
              className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm transition hover:border-(--brand-color)"
            >
              <LocalPhoneOutlinedIcon className="text-(--brand-color)" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                {content.support.phoneLabel}
              </p>
              <p className="mt-1 text-lg font-bold text-(--default-black-font)" dir="ltr">
                {content.support.phoneValue}
              </p>
            </a>
            <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm">
              <AccessTimeOutlinedIcon className="text-(--brand-color)" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                {content.support.hoursLabel}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-(--default-black-font)">
                {content.support.hoursValue}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-(--default-black-font)">
              {content.downloads.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--text-muted-color)">
              {content.downloads.description}
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {downloadItems.map((item) => (
              <a
                key={item.href}
                href={mediaUrl(item.href)}
                download
                className="group flex items-center justify-between gap-4 rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-5 transition hover:border-(--brand-color)"
              >
                <span>
                  <span className="block text-base font-bold text-(--default-black-font)">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-(--text-muted-color)">
                    {item.description}
                  </span>
                </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white transition group-hover:bg-(--brand-color-dark)">
                  <DownloadOutlinedIcon fontSize="small" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <OfficialLinksSection
        locale={locale}
        eyebrow={content.officialLinks.eyebrow}
        title={content.officialLinks.title}
        items={content.officialLinks.items.map((item) => ({
          ...item,
          href: `/${locale}${item.href}`,
        }))}
      />
    </div>
  );
}
