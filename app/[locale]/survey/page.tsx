import type { Metadata } from 'next';
import Link from 'next/link';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getLocale, getTranslations } from 'next-intl/server';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import SurveyForm, { type SurveyFormCopy } from '@/components/survey/SurveyForm';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

type SurveyPageContent = {
  highlightsTitle: string;
  highlightsDescription: string;
  highlights: string[];
  processTitle: string;
  processItems: string[];
  supportTitle: string;
  supportDescription: string;
  supportActions: Array<{
    label: string;
    href: string;
    external?: boolean;
    variant: 'primary' | 'secondary';
  }>;
  supportNotes: Array<{
    label: string;
    value: string;
    icon: typeof LocalPhoneOutlinedIcon;
    dir?: 'ltr' | 'rtl';
  }>;
  officialLinks: {
    eyebrow: string;
    title: string;
    items: Array<{
      href: string;
      label: string;
      description: string;
    }>;
  };
  form: SurveyFormCopy;
};

const SURVEY_CONTENT: Record<Locale, SurveyPageContent> = {
  fa: {
    highlightsTitle: 'چرا این نظرسنجی مهم است',
    highlightsDescription:
      'بازخورد شما به تیم خدمات کمک می‌کند کیفیت پاسخگویی، زمان‌بندی اعزام و تجربه کلی مشتری را دقیق‌تر ارزیابی و بهبود دهد.',
    highlights: [
      'اگر شماره سرویس، مدل دستگاه یا تاریخ مراجعه را دارید، ثبت آن دقت بررسی را بالاتر می‌برد.',
      'برای نارضایتی‌های مهم، جزئیات تجربه خود را شفاف بنویسید تا واحد مربوطه سریع‌تر بررسی کند.',
      'اگر نیاز به پیگیری مستقیم دارید، همزمان از مسیرهای تماس رسمی پشتیبانی هم استفاده کنید.',
    ],
    processTitle: 'بعد از ثبت نظرسنجی',
    processItems: [
      'بازخورد شما در پنل داخلی ثبت و برای تیم خدمات و تجربه مشتری دسته‌بندی می‌شود.',
      'موارد حساس یا نارضایتی جدی برای بررسی مستقیم به تیم پشتیبانی ارجاع داده می‌شود.',
      'در صورت نیاز و با رضایت شما، تیم ما برای تکمیل اطلاعات یا پیگیری تماس می‌گیرد.',
    ],
    supportTitle: 'نیاز به پیگیری فوری دارید؟',
    supportDescription:
      'اگر موضوع شما صرفاً نظرسنجی نیست و نیاز به رسیدگی مستقیم دارد، از مسیرهای رسمی تماس یا ثبت شکایت استفاده کنید.',
    supportActions: [
      {
        label: 'تماس با مرکز خدمات',
        href: 'tel:02172133',
        variant: 'primary',
      },
      {
        label: 'فرم شکایت',
        href: '/complaint',
        variant: 'secondary',
      },
      {
        label: 'واتساپ خدمات',
        href: 'https://wa.me/989217381016',
        external: true,
        variant: 'secondary',
      },
    ],
    supportNotes: [
      {
        label: 'تلفن پشتیبانی',
        value: '021 72133',
        icon: LocalPhoneOutlinedIcon,
        dir: 'ltr',
      },
      {
        label: 'واتساپ خدمات',
        value: '0921 738 1016',
        icon: WhatsAppIcon,
        dir: 'ltr',
      },
      {
        label: 'مسیر مناسب شکایت',
        value: 'برای پیگیری رسمی نارضایتی‌ها از فرم شکایت استفاده کنید.',
        icon: SupportAgentOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'مسیرهای رسمی',
      title: 'لینک‌های رسمی خدمات و ارتباط با هایسنس ایران',
      items: [
        {
          href: '/contact-us',
          label: 'تماس با هایسنس ایران',
          description: 'شماره‌ها، آدرس دفتر مرکزی و راه‌های رسمی ارتباط با تیم پشتیبانی و فروش.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'ثبت درخواست سرویس، تعمیرات رسمی و اطلاعات شبکه خدمات پس از فروش.',
        },
        {
          href: '/complaint',
          label: 'ثبت شکایت',
          description:
            'برای مشکلات مهم خدمات، گارانتی یا کیفیت محصول از فرم رسمی شکایت استفاده کنید.',
        },
      ],
    },
    form: {
      badge: 'فرم نظرسنجی رسمی',
      title: 'ارزیابی تجربه خدمات',
      description:
        'این فرم برای سنجش رضایت شما از روند اطلاع‌رسانی، رفتار کارشناسان، زمان‌بندی خدمات و کیفیت پیگیری طراحی شده است.',
      helperText:
        'تکمیل این فرم فقط چند دقیقه زمان می‌برد و به بهبود تجربه مشتریان بعدی کمک می‌کند.',
      requiredHint: 'فیلدهای ستاره‌دار الزامی هستند.',
      submitLabel: 'ارسال نظرسنجی',
      submittingLabel: 'در حال ارسال...',
      successMessage: 'نظرسنجی شما با موفقیت ثبت شد.',
      referenceCodeLabel: 'کد ثبت نظرسنجی',
      errorMessage: 'در ثبت نظرسنجی اختلالی رخ داد. لطفاً کمی بعد دوباره تلاش کنید.',
      serverUnavailable:
        'سامانه ثبت نظرسنجی در حال حاضر در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',
      fields: {
        fullName: {
          label: 'نام و نام خانوادگی',
          placeholder: 'مثلاً علی احمدی',
        },
        mobile: {
          label: 'تلفن همراه',
          placeholder: '09120000000',
        },
        phone: {
          label: 'تلفن ثابت',
          placeholder: '02112345678',
        },
        email: {
          label: 'ایمیل',
          placeholder: 'name@example.com',
        },
        productCategory: {
          label: 'گروه محصول',
          placeholder: 'گروه محصول را انتخاب کنید',
        },
        productModel: {
          label: 'مدل دستگاه',
          placeholder: 'در صورت تمایل وارد کنید',
        },
        referenceNumber: {
          label: 'شماره سرویس یا مرجع',
          placeholder: 'در صورت وجود وارد کنید',
        },
        serviceChannel: {
          label: 'نوع خدمت دریافت‌ شده',
          placeholder: 'نوع خدمت را انتخاب کنید',
        },
        serviceDate: {
          label: 'تاریخ مراجعه یا دریافت خدمت',
          placeholder: 'مثلاً ۱۴۰۵/۰۲/۰۵',
        },
        communicationClarity: {
          label: 'آیا فرآیند و اطلاعات موردنیاز به‌صورت شفاف برای شما توضیح داده شد؟',
        },
        staffBehavior: {
          label: 'ارزیابی شما از برخورد کارشناسان چگونه بود؟',
        },
        timeliness: {
          label: 'آیا خدمت در زمان اعلام‌شده انجام شد؟',
        },
        overallSatisfaction: {
          label: 'رضایت کلی شما از تجربه خدمات چگونه است؟',
        },
        followUpConsent: {
          label: 'در صورت نیاز، آیا تیم ما می‌تواند برای پیگیری با شما تماس بگیرد؟',
        },
        overallFeedback: {
          label: 'شرح تجربه شما',
          placeholder:
            'اگر نکته مهمی درباره روند خدمت، تاخیر، کیفیت پاسخگویی یا تجربه کلی دارید اینجا بنویسید.',
        },
        improvementSuggestions: {
          label: 'پیشنهاد برای بهبود',
          placeholder: 'اگر پیشنهادی برای بهبود فرآیند یا کیفیت خدمات دارید، بنویسید.',
        },
      },
      options: {
        productCategory: {
          tv: 'تلویزیون و نمایشگر',
          refrigerator: 'یخچال و فریزر',
          'washing-machine': 'ماشین لباسشویی',
          rac: 'کولر گازی خانگی',
          cac: 'تهویه مطبوع تجاری',
          other: 'سایر موارد',
        },
        serviceChannel: {
          repair: 'تعمیر و خدمات',
          installation: 'نصب و راه‌اندازی',
          warranty: 'گارانتی',
          'call-center': 'مرکز تماس',
          sales: 'فروش و مشاوره',
          dealer: 'نمایندگی',
          website: 'وب‌سایت یا فرم آنلاین',
          other: 'سایر موارد',
        },
        communicationClarity: {
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
        timeliness: {
          yes: 'بله',
          partly: 'تا حدی',
          no: 'خیر',
        },
        overallSatisfaction: {
          'very-satisfied': 'کاملاً راضی',
          satisfied: 'راضی',
          neutral: 'متوسط',
          dissatisfied: 'ناراضی',
        },
        followUpConsent: {
          yes: 'بله',
          no: 'خیر',
        },
      },
      validation: {
        fullNameRequired: 'نام و نام خانوادگی الزامی است.',
        fullNameMin: 'حداقل ۳ کاراکتر وارد کنید.',
        mobileRequired: 'تلفن همراه الزامی است.',
        mobileInvalid: 'شماره تلفن همراه معتبر وارد کنید.',
        phoneInvalid: 'شماره تلفن معتبر وارد کنید.',
        emailInvalid: 'ایمیل معتبر وارد کنید.',
        productCategoryRequired: 'گروه محصول را انتخاب کنید.',
        serviceChannelRequired: 'نوع خدمت را انتخاب کنید.',
        serviceDateInvalid: 'تاریخ معتبر وارد کنید.',
        communicationClarityRequired: 'یکی از گزینه‌ها را انتخاب کنید.',
        staffBehaviorRequired: 'ارزیابی برخورد کارشناسان را انتخاب کنید.',
        timelinessRequired: 'یکی از گزینه‌ها را انتخاب کنید.',
        overallSatisfactionRequired: 'رضایت کلی را انتخاب کنید.',
        followUpConsentRequired: 'یکی از گزینه‌ها را انتخاب کنید.',
        overallFeedbackRequired: 'شرح تجربه شما الزامی است.',
      },
    },
  },
  en: {
    highlightsTitle: 'Why this survey matters',
    highlightsDescription:
      'Your feedback helps the service team measure communication quality, timing, and the overall customer experience more accurately.',
    highlights: [
      'If you have a service reference, product model, or visit date, adding it makes internal review more accurate.',
      'For negative experiences, describe the situation clearly so the right team can review it faster.',
      'If the matter needs direct action, use the official support channels in parallel with this survey.',
    ],
    processTitle: 'What happens after submission',
    processItems: [
      'Your feedback is logged internally and grouped for the customer experience and service teams.',
      'Sensitive or strongly negative responses are flagged for closer review by the support team.',
      'If needed and with your consent, our team may contact you to clarify details or follow up.',
    ],
    supportTitle: 'Need urgent follow-up?',
    supportDescription:
      'If this is more than feedback and requires formal action, use the official contact or complaint channels below.',
    supportActions: [
      {
        label: 'Call support center',
        href: 'tel:02172133',
        variant: 'primary',
      },
      {
        label: 'Complaint form',
        href: '/complaint',
        variant: 'secondary',
      },
      {
        label: 'Service WhatsApp',
        href: 'https://wa.me/989217381016',
        external: true,
        variant: 'secondary',
      },
    ],
    supportNotes: [
      {
        label: 'Support line',
        value: '021 72133',
        icon: LocalPhoneOutlinedIcon,
        dir: 'ltr',
      },
      {
        label: 'Service WhatsApp',
        value: '+98 921 738 1016',
        icon: WhatsAppIcon,
        dir: 'ltr',
      },
      {
        label: 'Best route for escalation',
        value: 'Use the complaint form when you need formal case handling and follow-up.',
        icon: SupportAgentOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'Official paths',
      title: 'Official service and support pages for Hisense Iran',
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
          href: '/complaint',
          label: 'Submit a complaint',
          description:
            'Use the complaint form for serious issues related to service, warranty, or product quality.',
        },
      ],
    },
    form: {
      badge: 'Official survey form',
      title: 'Evaluate your service experience',
      description:
        'This form is designed to measure your satisfaction with communication clarity, staff behavior, service timing, and follow-up quality.',
      helperText:
        'It only takes a few minutes to complete and helps us improve the experience for future customers.',
      requiredHint: 'Fields marked with * are required.',
      submitLabel: 'Submit survey',
      submittingLabel: 'Submitting...',
      successMessage: 'Your survey was submitted successfully.',
      referenceCodeLabel: 'Survey reference code',
      errorMessage: 'Something went wrong while submitting the survey. Please try again.',
      serverUnavailable: 'Survey intake is currently unavailable. Please try again later.',
      fields: {
        fullName: {
          label: 'Full name',
          placeholder: 'For example, Ali Ahmadi',
        },
        mobile: {
          label: 'Mobile number',
          placeholder: '09120000000',
        },
        phone: {
          label: 'Landline',
          placeholder: '02112345678',
        },
        email: {
          label: 'Email',
          placeholder: 'name@example.com',
        },
        productCategory: {
          label: 'Product category',
          placeholder: 'Select a product category',
        },
        productModel: {
          label: 'Product model',
          placeholder: 'Optional',
        },
        referenceNumber: {
          label: 'Service or reference number',
          placeholder: 'Add it if available',
        },
        serviceChannel: {
          label: 'Service type received',
          placeholder: 'Select a service type',
        },
        serviceDate: {
          label: 'Visit or service date',
          placeholder: 'For example, 1405/02/05',
        },
        communicationClarity: {
          label: 'Was the process and required information explained clearly?',
        },
        staffBehavior: {
          label: 'How would you rate staff behavior?',
        },
        timeliness: {
          label: 'Was the service completed on the promised time?',
        },
        overallSatisfaction: {
          label: 'How satisfied are you overall with the service experience?',
        },
        followUpConsent: {
          label: 'May our team contact you if follow-up is needed?',
        },
        overallFeedback: {
          label: 'Your experience details',
          placeholder:
            'Share anything important about delays, staff behavior, communication, or the overall service process.',
        },
        improvementSuggestions: {
          label: 'Suggestions for improvement',
          placeholder: 'Optional suggestions for improving the process or service quality.',
        },
      },
      options: {
        productCategory: {
          tv: 'TV & display',
          refrigerator: 'Refrigerator & freezer',
          'washing-machine': 'Washing machine',
          rac: 'Residential AC',
          cac: 'Commercial HVAC',
          other: 'Other',
        },
        serviceChannel: {
          repair: 'Repair & service',
          installation: 'Installation & setup',
          warranty: 'Warranty',
          'call-center': 'Call center',
          sales: 'Sales & consultation',
          dealer: 'Dealer',
          website: 'Website or online form',
          other: 'Other',
        },
        communicationClarity: {
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
        timeliness: {
          yes: 'Yes',
          partly: 'Partly',
          no: 'No',
        },
        overallSatisfaction: {
          'very-satisfied': 'Very satisfied',
          satisfied: 'Satisfied',
          neutral: 'Neutral',
          dissatisfied: 'Dissatisfied',
        },
        followUpConsent: {
          yes: 'Yes',
          no: 'No',
        },
      },
      validation: {
        fullNameRequired: 'Full name is required.',
        fullNameMin: 'Enter at least 3 characters.',
        mobileRequired: 'Mobile number is required.',
        mobileInvalid: 'Enter a valid mobile number.',
        phoneInvalid: 'Enter a valid phone number.',
        emailInvalid: 'Enter a valid email address.',
        productCategoryRequired: 'Select a product category.',
        serviceChannelRequired: 'Select a service type.',
        serviceDateInvalid: 'Enter a valid date.',
        communicationClarityRequired: 'Select one of the options.',
        staffBehaviorRequired: 'Select a staff behavior rating.',
        timelinessRequired: 'Select one of the options.',
        overallSatisfactionRequired: 'Select an overall satisfaction level.',
        followUpConsentRequired: 'Select one of the options.',
        overallFeedbackRequired: 'Your experience details are required.',
      },
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.survey');
  const localizedPath = `/${locale}/survey`;
  const languageAlternates = getLanguageAlternates('/survey');

  return {
    title: routeTranslations('title'),
    description: routeTranslations('description'),
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function SurveyPage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.survey');
  const content = SURVEY_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/survey`,
  });
  const isRTL = locale === 'fa';
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: routeTranslations('title'),
    description: routeTranslations('description'),
    url: `${SITE_URL}/${locale}/survey`,
    inLanguage: getLocaleLanguage(locale),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
  };

  return (
    <div className="space-y-8 pb-16 pt-6 sm:space-y-10 sm:pt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <JsonLd data={pageSchema} />
      <RouteHero
        eyebrow={routeTranslations('eyebrow')}
        title={routeTranslations('title')}
        description={routeTranslations('description')}
        locale={locale}
        breadcrumbItems={breadcrumbItems}
      />

      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.45fr_0.85fr]">
        <SurveyForm copy={content.form} locale={locale} />

        <aside className="space-y-6">
          <div className="rounded-4xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 text-(--brand-color)">
              <InsightsOutlinedIcon />
              <h2 className="text-lg font-semibold text-(--default-black-font)">
                {content.highlightsTitle}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-(--text-muted-color)">
              {content.highlightsDescription}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-(--default-black-font)">
              {content.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-(--surface-muted-color) px-4 py-3"
                >
                  <span aria-hidden className="mt-1 h-2.5 w-2.5 rounded-full bg-(--brand-color)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-4xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 text-(--brand-color)">
              <AssignmentTurnedInOutlinedIcon />
              <h2 className="text-lg font-semibold text-(--default-black-font)">
                {content.processTitle}
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {content.processItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) px-4 py-3 text-sm leading-relaxed text-(--text-muted-color)"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-4xl bg-(--brand-color) p-6 text-white shadow-lg sm:p-8">
            <div className="flex items-center gap-3">
              <ForumOutlinedIcon />
              <h2 className="text-xl font-semibold">{content.supportTitle}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {content.supportDescription}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {content.supportActions.map((action) => {
                const href = action.href.startsWith('/') ? `/${locale}${action.href}` : action.href;

                return (
                  <Link
                    key={action.label}
                    href={href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noreferrer' : undefined}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white ${
                      action.variant === 'primary'
                        ? 'bg-white text-(--brand-color) hover:bg-white/90'
                        : 'border border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    {action.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              {content.supportNotes.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
                      <Icon fontSize="small" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/65">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium" dir={item.dir}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
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
