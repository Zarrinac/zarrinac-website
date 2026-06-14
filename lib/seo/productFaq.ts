import type { Locale } from '@/i18n/routing';

// Genuine, factual per-product FAQs for product detail pages. Every answer is true
// for the product (warranty, where-to-buy, service + category-specific facts) — no
// fabricated claims, prices, or ratings (those would violate Google's policy). The
// visible Q&A also adds real indexable, purchase-intent content to each page.

export type ProductFaq = { question: string; answer: string };

export type ProductFaqCategory = 'tvs' | 'wms' | 'rac' | 'cac' | 'refrigerator';

type ProductFaqInput = {
  locale: Locale;
  category: ProductFaqCategory;
  productName: string;
  /** Screen sizes in inches — TVs only (drives an extra, data-backed FAQ). */
  tvSizes?: string[];
  /**
   * TV operating system (e.g. "VIDAA Smart OS"). When empty/absent the TV is not
   * a smart TV (e.g. A3Q), so the smart-OS FAQ is omitted — we never claim a
   * non-smart model runs a smart OS.
   */
  tvOs?: string;
};

export const getProductFaqHeading = (locale: Locale, productName: string) =>
  locale === 'fa'
    ? `سوالات متداول درباره ${productName}`
    : `Frequently asked questions about ${productName}`;

export const buildProductFaqs = ({
  locale,
  category,
  productName: name,
  tvSizes = [],
  tvOs = '',
}: ProductFaqInput): ProductFaq[] => {
  const fa = locale === 'fa';
  const faqs: ProductFaq[] = [];

  // Common — true for every Hisense product supplied by the official representative.
  faqs.push({
    question: fa
      ? `آیا ${name} گارانتی رسمی دارد؟`
      : `Does the ${name} include an official warranty?`,
    answer: fa
      ? `بله، ${name} با گارانتی رسمی و خدمات پس از فروش سراسری زرین نمای کاسپین در ایران عرضه می‌شود.`
      : `Yes — the ${name} is supplied with an official warranty and nationwide after-sales service from Zarrin Namaye Caspian in Iran.`,
  });
  faqs.push({
    question: fa ? `${name} را از کجا تهیه کنم تا اصل باشد؟` : `Where can I buy a genuine ${name}?`,
    answer: fa
      ? `برای اطمینان از اصالت کالا و گارانتی رسمی، ${name} را از نمایندگی رسمی و شبکه فروش مجاز زرین نمای کاسپین تهیه کنید.`
      : `To ensure authenticity and an official warranty, buy the ${name} from the authorized Zarrin Namaye Caspian representative and sales network.`,
  });
  faqs.push({
    question: fa
      ? `خدمات پس از فروش و تعمیر ${name} چگونه است؟`
      : `How is after-sales service for the ${name} handled?`,
    answer: fa
      ? `خدمات پس از فروش و تعمیر ${name} از طریق شبکه سراسری نمایندگان مجاز زرین نمای کاسپین ارائه می‌شود؛ نزدیک‌ترین نمایندگی را از صفحه «یافتن نمایندگی خدمات» پیدا کنید.`
      : `After-sales service and repair for the ${name} are provided through Zarrin Namaye Caspian's nationwide authorized network; find your nearest center on the "Find service center" page.`,
  });

  // Category-specific — each statement holds for the whole category.
  if (category === 'tvs') {
    // Only smart TVs (those with an OS) get the operating-system FAQ — a
    // non-smart model like the A3Q has no OS and must not claim VIDAA.
    if (tvOs) {
      faqs.push({
        question: fa ? `سیستم‌عامل ${name} چیست؟` : `Which operating system does the ${name} use?`,
        answer: fa
          ? `${name} مانند دیگر تلویزیون‌های هوشمند هایسنس از سیستم‌عامل VIDAA بهره می‌برد که دسترسی سریع به سرویس‌های پخش محتوا و اپلیکیشن‌ها را فراهم می‌کند.`
          : `Like other Hisense smart TVs, the ${name} runs the VIDAA operating system for fast access to streaming services and apps.`,
      });
    }
    if (tvSizes.length > 0) {
      const sizeList = tvSizes.join(fa ? '، ' : ', ');
      faqs.push({
        question: fa
          ? `${name} در چه اندازه‌هایی عرضه می‌شود؟`
          : `What screen sizes is the ${name} available in?`,
        answer: fa
          ? `${name} در اندازه‌های ${sizeList} اینچ عرضه می‌شود؛ اندازه مناسب را بر اساس فاصله دید و فضای نصب انتخاب کنید.`
          : `The ${name} is available in ${sizeList} inch sizes; choose the right one based on your viewing distance and installation space.`,
      });
    }
  } else if (category === 'rac') {
    faqs.push({
      question: fa
        ? `آیا خدمات نصب ${name} ارائه می‌شود؟`
        : `Is installation available for the ${name}?`,
      answer: fa
        ? `بله، نصب و راه‌اندازی ${name} از طریق نمایندگان مجاز خدمات زرین نمای کاسپین در سراسر ایران انجام می‌شود؛ ظرفیت مناسب (BTU) را بر اساس متراژ فضا انتخاب کنید.`
        : `Yes — installation and setup of the ${name} are available through authorized Zarrin Namaye Caspian service representatives across Iran; choose the right capacity (BTU) for your room size.`,
    });
  } else if (category === 'cac') {
    faqs.push({
      question: fa
        ? `برای ${name} چگونه مشاوره فنی و استعلام بگیرم؟`
        : `How do I get technical consultation for the ${name}?`,
      answer: fa
        ? `برای ${name}، کارشناسان زرین نمای کاسپین مشاوره فنی، طراحی سیستم و استعلام متناسب با پروژه شما را ارائه می‌دهند؛ درخواست خود را از صفحه تماس با ما ثبت کنید.`
        : `For the ${name}, the Zarrin Namaye Caspian team provides technical consultation, system design, and project-based quotes — submit a request via our contact page.`,
    });
  } else if (category === 'wms') {
    faqs.push({
      question: fa
        ? `آیا قطعات یدکی اصل ${name} موجود است؟`
        : `Are genuine spare parts available for the ${name}?`,
      answer: fa
        ? `بله، قطعات یدکی اصل و خدمات تعمیر ${name} از طریق شبکه خدمات پس از فروش رسمی زرین نمای کاسپین تأمین می‌شود.`
        : `Yes — genuine spare parts and repair service for the ${name} are supplied through Zarrin Namaye Caspian's official after-sales network.`,
    });
  } else {
    // refrigerator
    faqs.push({
      question: fa
        ? `آیا قطعات یدکی و خدمات ${name} تأمین می‌شود؟`
        : `Are spare parts and service available for the ${name}?`,
      answer: fa
        ? `بله، قطعات یدکی اصل و خدمات پس از فروش ${name} از طریق شبکه سراسری زرین نمای کاسپین ارائه می‌شود.`
        : `Yes — genuine spare parts and after-sales service for the ${name} are provided through Zarrin Namaye Caspian's nationwide network.`,
    });
  }

  return faqs;
};
