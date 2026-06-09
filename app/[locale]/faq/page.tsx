import type { Metadata } from 'next';
import Link from 'next/link';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { getLocale, getTranslations } from 'next-intl/server';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import type { Locale } from '@/i18n/routing';
import { createBreadcrumbItems, getLanguageAlternates, SITE_URL } from '@/lib/seo/site';

type IconType = typeof LocalPhoneOutlinedIcon;

type FaqItem = {
  question: string;
  answer: string[];
  list?: string[];
};

type FaqSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: IconType;
  items: FaqItem[];
};

type ContactItem = {
  label: string;
  value: string;
  href?: string;
  icon: IconType;
  dir?: 'ltr' | 'rtl';
};

type FaqPageContent = {
  introTitle: string;
  introDescription: string;
  sections: FaqSection[];
  contact: {
    title: string;
    description: string;
    items: ContactItem[];
    hoursTitle: string;
    hours: string[];
    primaryAction: {
      label: string;
      href: string;
    };
    secondaryAction: {
      label: string;
      href: string;
    };
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

const FAQ_CONTENT: Record<Locale, FaqPageContent> = {
  fa: {
    introTitle: 'پاسخ سریع به سوالات نصب، گارانتی و خدمات',
    introDescription:
      'در این صفحه، سوالات متداول کولر گازی اسپلیت و تلویزیون هایسنس را درباره نصب، لوله‌کشی، شارژ گاز، گارانتی، تعمیر و جابجایی دستگاه پیدا می‌کنید.',
    sections: [
      {
        id: 'air-conditioner',
        eyebrow: 'کولر گازی',
        title: 'سوالات متداول کولر گازی اسپلیت',
        description: 'پاسخ‌های کاربردی درباره نصب کولر گازی، لوله مسی، شارژ گاز و خدمات گارانتی.',
        icon: AcUnitOutlinedIcon,
        items: [
          {
            question: 'آیا کولر گازی شامل لوله مسی می‌باشد؟',
            answer: [
              'خیر. دستگاه‌ها بدون لوله مسی عرضه می‌شوند و مشتری می‌تواند متناسب با ظرفیت دستگاه، لوله مورد نیاز را از نمایندگی تهیه نماید.',
            ],
          },
          {
            question: 'آیا نصب در ارتفاع توسط نمایندگی انجام می‌شود؟',
            answer: [
              'خیر. تأمین شرایط ایمن نصب مانند داربست، بالابر یا نردبان بر عهده مشتری می‌باشد.',
            ],
          },
          {
            question: 'هزینه نصب کولر گازی چقدر است؟',
            answer: [
              'نصب یونیت داخلی و خارجی به همراه لوله‌کشی تا ۵ متر رایگان است.',
              'موارد زیر شامل هزینه جداگانه می‌شود:',
            ],
            list: [
              'سوراخ‌کاری',
              'جوشکاری',
              'نصب پایه دیواری یا زمینی',
              'کابل‌کشی از کنتور',
              'متریال مصرفی مانند نوار پرایمر و لوله درین',
            ],
          },
          {
            question: 'آیا در صورت لوله‌کشی توکار، دستگاه شامل گارانتی می‌شود؟',
            answer: [
              'بله. در صورت تأیید لوله‌کشی توسط کارشناس شرکت، دستگاه نصب شده و شامل گارانتی خواهد شد.',
            ],
          },
          {
            question: 'آیا دستگاه پس از نصب نیاز به شارژ گاز دارد؟',
            answer: [
              'تا ۵ متر لوله‌کشی، گاز دستگاه به‌صورت کارخانه‌ای تأمین شده است. در صورت افزایش متراژ، شارژ گاز اضافی بر اساس مدل و ظرفیت دستگاه انجام می‌شود.',
            ],
          },
          {
            question: 'زمان مراجعه برای نصب یا تعمیر کولر گازی چقدر است؟',
            answer: [
              'نصب حداکثر تا ۴۸ ساعت کاری و تعمیر حداکثر تا ۷۲ ساعت کاری انجام می‌شود. در ایام پیک، این زمان ممکن است تا یک هفته افزایش پیدا کند.',
            ],
          },
          {
            question: 'آیا هزینه تعمیر در دوره گارانتی بر عهده مشتری است؟',
            answer: [
              'خیر. تمامی هزینه‌های تعمیر در دوره گارانتی، به‌جز موارد خارج از شرایط گارانتی، بر عهده شرکت می‌باشد.',
            ],
          },
          {
            question: 'آیا جابجایی دستگاه در دوره گارانتی هزینه دارد؟',
            answer: [
              'خیر. در صورت تأیید کارشناس، هزینه جابجایی در دوره گارانتی بر عهده شرکت خواهد بود.',
            ],
          },
        ],
      },
      {
        id: 'tv',
        eyebrow: 'تلویزیون',
        title: 'سوالات متداول تلویزیون',
        description:
          'اطلاعات ضروری درباره نصب تلویزیون، بروزرسانی نرم‌افزار، شکستگی پنل و پوشش گارانتی.',
        icon: LiveTvOutlinedIcon,
        items: [
          {
            question: 'هزینه نصب تلویزیون چقدر است؟',
            answer: [
              'نصب تلویزیون در حالت پایه رومیزی رایگان است. در صورت نصب دیواری، هزینه نصب بر عهده مشتری خواهد بود.',
            ],
          },
          {
            question: 'آیا آپدیت تلویزیون هزینه دارد؟',
            answer: [
              'خیر. خدمات بروزرسانی نرم‌افزار کاملاً رایگان بوده و توسط نمایندگی انجام می‌شود.',
            ],
          },
          {
            question: 'زمان نصب یا تعمیر تلویزیون چقدر است؟',
            answer: ['نصب تلویزیون معمولاً بین ۲۴ تا ۴۸ ساعت کاری انجام می‌شود.'],
          },
          {
            question: 'آیا شکستگی پنل شامل گارانتی است؟',
            answer: [
              'خیر. شکستگی پنل شامل گارانتی نمی‌شود و هزینه آن بسته به مدل دستگاه، حدود ۸۰ تا ۹۰ درصد قیمت کل دستگاه است.',
            ],
          },
          {
            question: 'آیا هزینه تعمیر تلویزیون در دوره گارانتی با مشتری است؟',
            answer: [
              'خیر. تمامی هزینه‌ها در دوره گارانتی، به‌جز موارد خارج از شرایط ضمانت، بر عهده شرکت می‌باشد.',
            ],
          },
          {
            question: 'آیا جابجایی تلویزیون در دوره گارانتی هزینه دارد؟',
            answer: ['خیر. در صورت تأیید کارشناس، هزینه جابجایی بر عهده شرکت خواهد بود.'],
          },
        ],
      },
    ],
    contact: {
      title: 'پاسخ خود را پیدا نکردید؟',
      description:
        'اگر پاسخ سؤال شما در این صفحه نبود، از مسیرهای رسمی زیر با تیم هایسنس ایران تماس بگیرید.',
      items: [
        {
          label: 'امور مشتریان و نمایندگان',
          value: '021 72133',
          href: 'tel:02172133',
          icon: LocalPhoneOutlinedIcon,
          dir: 'ltr',
        },
        {
          label: 'فروش و مالی',
          value: '021 72885',
          href: 'tel:02172885',
          icon: SupportAgentOutlinedIcon,
          dir: 'ltr',
        },
      ],
      hoursTitle: 'ساعات پاسخگویی',
      hours: ['شنبه تا چهارشنبه: ۸:۳۰ تا ۱۶:۰۰', 'پنجشنبه: ۸:۳۰ تا ۱۳:۳۰'],
      primaryAction: {
        label: 'تماس با امور مشتریان',
        href: 'tel:02172133',
      },
      secondaryAction: {
        label: 'فرم شکایت',
        href: '/complaint',
      },
    },
    officialLinks: {
      eyebrow: 'مسیرهای رسمی',
      title: 'لینک‌های مرتبط با خدمات و پشتیبانی هایسنس ایران',
      items: [
        {
          href: '/contact-us',
          label: 'تماس با هایسنس ایران',
          description: 'شماره‌ها، آدرس دفتر مرکزی و راه‌های رسمی ارتباط با پشتیبانی و فروش.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'ثبت درخواست سرویس، تعمیرات رسمی و اطلاعات شبکه خدمات پس از فروش.',
        },
        {
          href: '/warranty-and-guarantee',
          label: 'شرایط گارانتی',
          description: 'جزئیات پوشش ضمانت، شرایط استفاده از گارانتی و مسیرهای پیگیری خدمات.',
        },
      ],
    },
  },
  en: {
    introTitle: 'Fast answers for installation, warranty, and service',
    introDescription:
      'Find common Hisense air conditioner and TV questions about installation, copper piping, gas charging, warranty coverage, repair, and relocation.',
    sections: [
      {
        id: 'air-conditioner',
        eyebrow: 'Air Conditioner',
        title: 'Air Conditioner Split FAQ',
        description:
          'Practical answers about AC installation, copper pipes, gas charging, and warranty service.',
        icon: AcUnitOutlinedIcon,
        items: [
          {
            question: 'Do air conditioners include copper piping?',
            answer: [
              'No. Units are supplied without copper pipes. Customers should purchase the required piping based on the unit capacity through authorized dealers.',
            ],
          },
          {
            question: 'Does the installer handle high-altitude installation?',
            answer: [
              'No. The customer must provide safe installation conditions, including scaffolding, ladders, or lifting equipment if required.',
            ],
          },
          {
            question: 'What is the air conditioner installation cost?',
            answer: [
              'Installation of indoor and outdoor units with up to 5 meters of piping is free.',
              'Additional costs may apply for:',
            ],
            list: [
              'Drilling',
              'Welding',
              'Wall or floor brackets',
              'Electrical wiring from the meter',
              'Additional materials such as drain pipe and insulation tape',
            ],
          },
          {
            question: 'Will the unit be under warranty if piping is pre-installed?',
            answer: [
              'Yes. Concealed piping will be inspected by an authorized technician, and if approved, the unit will be installed and covered under warranty.',
            ],
          },
          {
            question: 'Does the unit require additional gas charging after installation?',
            answer: [
              'Units are factory pre-charged for up to 5 meters of piping. Additional gas may be required depending on extra pipe length, model, and unit capacity.',
            ],
          },
          {
            question: 'How long does AC installation or repair take?',
            answer: [
              'Installation is completed within 48 working hours and repair within 72 working hours. During peak seasons, service may take up to one week.',
            ],
          },
          {
            question: 'Is repair cost covered during the warranty period?',
            answer: [
              'Yes. All repair costs are covered under warranty, except for cases excluded in the warranty terms.',
            ],
          },
          {
            question: 'Is relocation covered under warranty?',
            answer: [
              'Yes. If approved by a technician, relocation costs are covered during the warranty period.',
            ],
          },
        ],
      },
      {
        id: 'tv',
        eyebrow: 'TV',
        title: 'TV FAQ',
        description:
          'Essential information about TV installation, software updates, panel damage, and warranty coverage.',
        icon: LiveTvOutlinedIcon,
        items: [
          {
            question: 'What is the TV installation cost?',
            answer: [
              'Installation is free when using the standard stand. Wall-mount installation will incur an additional cost.',
            ],
          },
          {
            question: 'Is software update free?',
            answer: [
              'Yes. Software updates are completely free and performed by authorized service technicians.',
            ],
          },
          {
            question: 'How long does TV installation or repair take?',
            answer: ['Installation is typically completed within 24 to 48 working hours.'],
          },
          {
            question: 'Is a broken panel covered by warranty?',
            answer: [
              'No. Panel damage is not covered and typically costs 80 to 90 percent of the device price depending on the model.',
            ],
          },
          {
            question: 'Is TV repair covered during the warranty period?',
            answer: ['Yes. All repair costs are covered under warranty except for excluded cases.'],
          },
          {
            question: 'Is TV relocation covered during warranty?',
            answer: ['Yes. If approved by a technician, relocation costs are covered.'],
          },
        ],
      },
    ],
    contact: {
      title: 'Still have questions?',
      description:
        'If your question is not answered here, contact Hisense Iran through the official channels below.',
      items: [
        {
          label: 'Customer Service',
          value: '+98 21 72133',
          href: 'tel:+982172133',
          icon: LocalPhoneOutlinedIcon,
          dir: 'ltr',
        },
        {
          label: 'Sales & Finance',
          value: '+98 21 72885',
          href: 'tel:+982172885',
          icon: SupportAgentOutlinedIcon,
          dir: 'ltr',
        },
      ],
      hoursTitle: 'Working hours',
      hours: ['Saturday-Wednesday: 8:30 AM - 4:00 PM', 'Thursday: 8:30 AM - 1:30 PM'],
      primaryAction: {
        label: 'Call Customer Service',
        href: 'tel:+982172133',
      },
      secondaryAction: {
        label: 'Complaint Form',
        href: '/complaint',
      },
    },
    officialLinks: {
      eyebrow: 'Official paths',
      title: 'Related Hisense Iran service and support links',
      items: [
        {
          href: '/contact-us',
          label: 'Contact Hisense Iran',
          description:
            'Verified numbers, head-office address, and official support or sales channels.',
        },
        {
          href: '/hisense-repair',
          label: 'Repair and support',
          description: 'Request official service, repairs, and after-sales support.',
        },
        {
          href: '/warranty-and-guarantee',
          label: 'Warranty terms',
          description: 'Review warranty coverage, claim conditions, and support process details.',
        },
      ],
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.faq');
  const localizedPath = `/${locale}/faq`;
  const languageAlternates = getLanguageAlternates('/faq');

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
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: routeTranslations('title'),
      description: routeTranslations('description'),
    },
  };
}

function getFaqAnswerText(item: FaqItem) {
  return [...item.answer, ...(item.list ?? [])].join(' ');
}

export default async function FaqPage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.faq');
  const content = FAQ_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/faq`,
  });
  const isRTL = locale === 'fa';
  const resolveHref = (href: string) => (href.startsWith('/') ? `/${locale}${href}` : href);
  const faqItems = content.sections.flatMap((section) => section.items);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: getFaqAnswerText(item),
      },
    })),
  };

  return (
    <div className="space-y-10 pb-16 pt-6 sm:space-y-12 sm:pt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={faqSchema} />

      <RouteHero
        eyebrow={routeTranslations('eyebrow')}
        title={routeTranslations('title')}
        description={routeTranslations('description')}
        locale={locale}
        breadcrumbItems={breadcrumbItems}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-(--default-black-font) sm:text-3xl">
            {content.introTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-(--text-muted-color) sm:text-base">
            {content.introDescription}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          {content.sections.map((section) => {
            const Icon = section.icon;

            return (
              <div key={section.id} className="min-w-0">
                <div className="mb-4 flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white">
                    <Icon fontSize="small" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--text-subtle-color)">
                      {section.eyebrow}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-(--default-black-font)">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-(--text-muted-color)">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden border border-(--border-color) bg-(--surface-color) shadow-sm">
                  {section.items.map((item, index) => (
                    <details
                      key={item.question}
                      open={index === 0}
                      className="group border-b border-(--border-color) last:border-b-0 open:bg-(--surface-muted-color)"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold leading-6 text-(--default-black-font) transition hover:bg-(--surface-muted-color) focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-(--brand-color) sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <span
                          aria-hidden
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-lg font-semibold leading-none text-(--brand-color) before:content-['+'] group-open:before:content-['-']"
                        />
                      </summary>
                      <div className="border-t border-(--border-color) px-4 py-4 text-sm leading-7 text-(--text-muted-color) sm:px-5">
                        <div className="space-y-3">
                          {item.answer.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                        {item.list ? (
                          <ul className="mt-4 grid gap-2 text-(--default-black-font) sm:grid-cols-2">
                            {item.list.map((listItem) => (
                              <li key={listItem} className="flex items-start gap-2">
                                <span
                                  aria-hidden
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--brand-color)"
                                />
                                <span>{listItem}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-(--surface-muted-color) px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-(--brand-color)">
              <AccessTimeOutlinedIcon fontSize="small" />
              {content.contact.hoursTitle}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-(--default-black-font)">
              {content.contact.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--text-muted-color)">
              {content.contact.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={content.contact.primaryAction.href}
                className="inline-flex items-center justify-center rounded-full bg-(--brand-color) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark)"
              >
                {content.contact.primaryAction.label}
              </a>
              <Link
                href={resolveHref(content.contact.secondaryAction.href)}
                className="inline-flex items-center justify-center rounded-full border border-(--border-color) bg-(--surface-color) px-5 py-2.5 text-sm font-semibold text-(--default-black-font) transition hover:border-(--brand-color) hover:text-(--brand-color)"
              >
                {content.contact.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.contact.items.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white">
                    <Icon fontSize="small" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                      {item.label}
                    </span>
                    <span
                      className="mt-1 block text-base font-bold text-(--default-black-font)"
                      dir={item.dir}
                    >
                      {item.value}
                    </span>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm transition hover:border-(--brand-color)"
                >
                  {body}
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm"
                >
                  {body}
                </div>
              );
            })}

            <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm sm:col-span-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--brand-color) text-white">
                  <AccessTimeOutlinedIcon fontSize="small" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--text-subtle-color)">
                    {content.contact.hoursTitle}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-(--default-black-font)">
                    {content.contact.hours.map((hour) => (
                      <span key={hour}>{hour}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
