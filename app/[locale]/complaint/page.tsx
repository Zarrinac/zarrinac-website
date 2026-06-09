import type { Metadata } from 'next';
import Link from 'next/link';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getLocale, getTranslations } from 'next-intl/server';
import ComplaintForm, { type ComplaintFormCopy } from '@/components/complaint/ComplaintForm';
import RouteHero from '@/components/routes/RouteHero';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import type { Locale } from '@/i18n/routing';
import { loadIranProvinces } from '@/lib/iranLocationSource';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

type ComplaintPageContent = {
  highlightsTitle: string;
  highlightsDescription: string;
  highlights: string[];
  flowTitle: string;
  flowItems: string[];
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
  form: ComplaintFormCopy;
};

const COMPLAINT_CONTENT: Record<Locale, ComplaintPageContent> = {
  fa: {
    highlightsTitle: 'برای رسیدگی سریع‌تر',
    highlightsDescription:
      'اطلاعات دقیق‌تر باعث می‌شود تیم خدمات شکایت شما را سریع‌تر به واحد مرتبط ارجاع دهد و پیگیری منظم‌تری انجام شود.',
    highlights: [
      'شماره تماس در دسترس، مدل دستگاه و شرح کامل مشکل را وارد کنید.',
      'اگر فاکتور، کد سرویس یا مرجع قبلی دارید، آن را ثبت کنید تا سابقه سریع‌تر پیدا شود.',
      'برای موارد فوری، همزمان از تماس تلفنی یا واتساپ خدمات نیز استفاده کنید.',
    ],
    flowTitle: 'روند بررسی شکایت',
    flowItems: [
      'ثبت اولیه اطلاعات و دریافت کد پیگیری',
      'بررسی توسط تیم پشتیبانی و تماس برای تکمیل جزئیات در صورت نیاز',
      'ارجاع به واحد فروش، خدمات یا گارانتی و پیگیری تا اعلام نتیجه',
    ],
    supportTitle: 'پیگیری فوری یا تماس مستقیم',
    supportDescription:
      'اگر موضوع شما فوری است یا قبلاً درخواست سرویس ثبت کرده‌اید، از مسیرهای مستقیم پشتیبانی هم استفاده کنید.',
    supportActions: [
      {
        label: 'تماس با مرکز خدمات',
        href: 'tel:02172133',
        variant: 'primary',
      },
      {
        label: 'واتساپ خدمات',
        href: 'https://wa.me/989217381016',
        external: true,
        variant: 'secondary',
      },
      {
        label: 'صفحه خدمات تعمیر',
        href: '/hisense-repair',
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
        label: 'ساعات پاسخگویی',
        value: 'شنبه تا چهارشنبه 8:30 تا 16:00 | پنجشنبه 8:30 تا 13:00',
        icon: AccessTimeOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'مسیرهای رسمی',
      title: 'لینک‌های رسمی پشتیبانی هایسنس ایران',
      items: [
        {
          href: '/contact-us',
          label: 'تماس با هایسنس ایران',
          description: 'شماره‌ها، آدرس دفتر مرکزی و کانال‌های رسمی ارتباط با تیم پشتیبانی.',
        },
        {
          href: '/hisense-repair',
          label: 'خدمات تعمیر و پشتیبانی',
          description: 'ثبت درخواست سرویس، تعمیرات رسمی و اطلاعات شبکه خدمات پس از فروش.',
        },
        {
          href: '/warranty-and-guarantee',
          label: 'شرایط گارانتی',
          description: 'جزئیات پوشش گارانتی، شرایط استفاده و مسیرهای پیگیری خدمات.',
        },
      ],
    },
    form: {
      badge: 'فرم رسمی شکایت',
      title: 'ثبت شکایت مشتری',
      description:
        'این فرم برای ثبت مشکلات مرتبط با خدمات، گارانتی، کیفیت محصول یا تجربه خرید طراحی شده است. پس از ثبت، یک کد پیگیری دریافت می‌کنید.',
      helperText:
        'لطفاً اطلاعات تماس و شرح شکایت را کامل وارد کنید تا تیم پشتیبانی بتواند سریع‌تر با شما پیگیری کند.',
      requiredHint: 'فیلدهای ستاره‌دار الزامی هستند.',
      submitLabel: 'ثبت شکایت',
      submittingLabel: 'در حال ثبت...',
      successMessage: 'شکایت شما با موفقیت ثبت شد.',
      trackingCodeLabel: 'شماره پیگیری',
      errorMessage: 'در ثبت شکایت اختلالی رخ داد. لطفاً کمی بعد دوباره تلاش کنید.',
      serverUnavailable:
        'سامانه ثبت شکایت در حال حاضر در دسترس نیست. لطفاً از مسیرهای تماس رسمی استفاده کنید.',
      fields: {
        fullName: {
          label: 'نام و نام خانوادگی',
          placeholder: 'مثلاً علی احمدی',
        },
        phone: {
          label: 'شماره تماس',
          placeholder: '09120000000',
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
          label: 'مدل یا نام کالا',
          placeholder: 'مثلاً 55U7N یا یخچال RT488',
        },
        invoiceNumber: {
          label: 'شماره فاکتور',
          placeholder: 'در صورت وجود وارد کنید',
        },
        referenceNumber: {
          label: 'کد سرویس یا مرجع قبلی',
          placeholder: 'در صورت وجود وارد کنید',
        },
        purchaseDate: {
          label: 'تاریخ خرید یا مراجعه',
          placeholder: 'مثلاً ۱۴۰۵/۰۲/۰۱',
        },
        complaintTopic: {
          label: 'موضوع شکایت',
          placeholder: 'موضوع را انتخاب کنید',
        },
        preferredContactMethod: {
          label: 'روش پیگیری ترجیحی',
          placeholder: 'روش تماس را انتخاب کنید',
        },
        province: {
          label: 'استان',
          placeholder: 'استان را جستجو و انتخاب کنید',
          noOptionsText: 'استانی پیدا نشد',
        },
        city: {
          label: 'شهر',
          placeholder: 'شهر را جستجو و انتخاب کنید',
          noOptionsText: 'ابتدا استان را انتخاب کنید یا نتیجه‌ای پیدا نشد',
        },
        address: {
          label: 'آدرس',
          placeholder: 'در صورت نیاز برای پیگیری میدانی وارد کنید',
        },
        description: {
          label: 'شرح شکایت',
          placeholder:
            'مشکل، زمان وقوع، اقدامات قبلی و نتیجه مورد انتظار خود را با جزئیات بنویسید.',
        },
      },
      options: {
        complaintCategory: {
          tv: 'تلویزیون و نمایشگر',
          refrigerator: 'یخچال و فریزر',
          'washing-machine': 'ماشین لباسشویی',
          rac: 'کولر گازی خانگی',
          cac: 'تهویه مطبوع تجاری',
          other: 'سایر موارد',
        },
        complaintTopic: {
          'after-sales-service': 'کیفیت خدمات پس از فروش',
          installation: 'نصب و راه‌اندازی',
          'repair-delay': 'تاخیر در اعزام یا تعمیر',
          warranty: 'گارانتی و تعهدات',
          'product-quality': 'کیفیت محصول',
          other: 'سایر موارد',
        },
        preferredContactMethod: {
          phone: 'تماس تلفنی',
          email: 'ایمیل',
          whatsapp: 'واتساپ',
        },
      },
      validation: {
        fullNameRequired: 'نام و نام خانوادگی الزامی است.',
        fullNameMin: 'حداقل ۳ کاراکتر وارد کنید.',
        phoneRequired: 'شماره تماس الزامی است.',
        phoneInvalid: 'شماره تماس معتبر وارد کنید.',
        emailInvalid: 'ایمیل معتبر وارد کنید.',
        productCategoryRequired: 'گروه محصول را انتخاب کنید.',
        productModelRequired: 'مدل یا نام کالا الزامی است.',
        productModelMin: 'حداقل ۲ کاراکتر برای مدل وارد کنید.',
        purchaseDateInvalid: 'تاریخ معتبر وارد کنید.',
        complaintTopicRequired: 'موضوع شکایت را انتخاب کنید.',
        preferredContactRequired: 'روش پیگیری ترجیحی را انتخاب کنید.',
        provinceRequired: 'استان را انتخاب کنید.',
        cityRequired: 'شهر را انتخاب کنید.',
        descriptionRequired: 'شرح شکایت الزامی است.',
      },
    },
  },
  en: {
    highlightsTitle: 'For faster handling',
    highlightsDescription:
      'Accurate product and contact details help the support team route the complaint to the correct unit and follow up with less back-and-forth.',
    highlights: [
      'Include an active phone number, the product model, and a clear summary of the issue.',
      'If you already have an invoice or past service reference, add it so the team can trace your case faster.',
      'For urgent cases, use the official phone line or service WhatsApp in parallel with this form.',
    ],
    flowTitle: 'How complaints are handled',
    flowItems: [
      'Initial registration and automatic case reference generation',
      'Review by the support team and a follow-up call if more details are needed',
      'Escalation to sales, service, warranty, or quality teams until the case is resolved',
    ],
    supportTitle: 'Urgent follow-up or direct support',
    supportDescription:
      'If the issue is time-sensitive or linked to an existing service request, use the direct support channels below as well.',
    supportActions: [
      {
        label: 'Call service center',
        href: 'tel:02172133',
        variant: 'primary',
      },
      {
        label: 'Service WhatsApp',
        href: 'https://wa.me/989217381016',
        external: true,
        variant: 'secondary',
      },
      {
        label: 'Repair & support page',
        href: '/hisense-repair',
        variant: 'secondary',
      },
    ],
    supportNotes: [
      {
        label: 'Support phone',
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
        label: 'Working hours',
        value: 'Sat - Wed 8:30 - 16:00 | Thu 8:30 - 13:00',
        icon: AccessTimeOutlinedIcon,
      },
    ],
    officialLinks: {
      eyebrow: 'Official paths',
      title: 'Verified Hisense Iran support links',
      items: [
        {
          href: '/contact-us',
          label: 'Contact Hisense Iran',
          description:
            'Verified phone numbers, HQ address, and official customer support channels.',
        },
        {
          href: '/hisense-repair',
          label: 'Repair & support',
          description: 'Book official repair, maintenance, and support for Hisense products.',
        },
        {
          href: '/warranty-and-guarantee',
          label: 'Warranty terms',
          description: 'Review warranty coverage, claim conditions, and support process details.',
        },
      ],
    },
    form: {
      badge: 'Official complaint form',
      title: 'Customer complaint registration',
      description:
        'Use this form to report issues related to service quality, warranty, product quality, or the purchase experience. A tracking code will be generated after submission.',
      helperText:
        'Provide full contact details and a clear description so the support team can review and follow up faster.',
      requiredHint: 'Fields marked with * are required.',
      submitLabel: 'Submit complaint',
      submittingLabel: 'Submitting...',
      successMessage: 'Your complaint was submitted successfully.',
      trackingCodeLabel: 'Tracking code',
      errorMessage: 'Something went wrong while submitting your complaint. Please try again.',
      serverUnavailable:
        'Complaint intake is currently unavailable. Please use the official support channels below.',
      fields: {
        fullName: {
          label: 'Full name',
          placeholder: 'For example, Ali Ahmadi',
        },
        phone: {
          label: 'Phone number',
          placeholder: '09120000000',
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
          label: 'Product model or name',
          placeholder: 'For example, 55U7N or RT488 refrigerator',
        },
        invoiceNumber: {
          label: 'Invoice number',
          placeholder: 'Add it if available',
        },
        referenceNumber: {
          label: 'Previous service reference',
          placeholder: 'Add it if available',
        },
        purchaseDate: {
          label: 'Purchase or visit date',
          placeholder: 'For example, 1405/02/01',
        },
        complaintTopic: {
          label: 'Complaint topic',
          placeholder: 'Select a topic',
        },
        preferredContactMethod: {
          label: 'Preferred follow-up method',
          placeholder: 'Select a contact method',
        },
        province: {
          label: 'Province',
          placeholder: 'Search and select a province',
          noOptionsText: 'No province found',
        },
        city: {
          label: 'City',
          placeholder: 'Search and select a city',
          noOptionsText: 'Select a province first or refine your search',
        },
        address: {
          label: 'Address',
          placeholder: 'Optional, useful if an on-site follow-up is needed',
        },
        description: {
          label: 'Complaint details',
          placeholder:
            'Explain the issue, when it happened, what has already been done, and what resolution you expect.',
        },
      },
      options: {
        complaintCategory: {
          tv: 'TV & display',
          refrigerator: 'Refrigerator & freezer',
          'washing-machine': 'Washing machine',
          rac: 'Residential AC',
          cac: 'Commercial HVAC',
          other: 'Other',
        },
        complaintTopic: {
          'after-sales-service': 'After-sales service quality',
          installation: 'Installation & setup',
          'repair-delay': 'Repair or dispatch delay',
          warranty: 'Warranty & commitments',
          'product-quality': 'Product quality',
          other: 'Other',
        },
        preferredContactMethod: {
          phone: 'Phone call',
          email: 'Email',
          whatsapp: 'WhatsApp',
        },
      },
      validation: {
        fullNameRequired: 'Full name is required.',
        fullNameMin: 'Enter at least 3 characters.',
        phoneRequired: 'Phone number is required.',
        phoneInvalid: 'Enter a valid phone number.',
        emailInvalid: 'Enter a valid email address.',
        productCategoryRequired: 'Select a product category.',
        productModelRequired: 'Product model is required.',
        productModelMin: 'Enter at least 2 characters for the model.',
        purchaseDateInvalid: 'Enter a valid date.',
        complaintTopicRequired: 'Select a complaint topic.',
        preferredContactRequired: 'Select a preferred follow-up method.',
        provinceRequired: 'Select a province.',
        cityRequired: 'Select a city.',
        descriptionRequired: 'Complaint details are required.',
      },
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.complaint');
  const localizedPath = `/${locale}/complaint`;
  const languageAlternates = getLanguageAlternates('/complaint');

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

export default async function ComplaintPage() {
  const locale = (await getLocale()) as Locale;
  const routeTranslations = await getTranslations('Routes.complaint');
  const content = COMPLAINT_CONTENT[locale];
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: routeTranslations('title'),
    href: `/${locale}/complaint`,
  });
  const isRTL = locale === 'fa';
  const { provinces } = await loadIranProvinces();
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: routeTranslations('title'),
    description: routeTranslations('description'),
    url: `${SITE_URL}/${locale}/complaint`,
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
        <ComplaintForm copy={content.form} locale={locale} provinces={provinces} />

        <aside className="space-y-6">
          <div className="rounded-4xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 text-(--brand-color)">
              <AssignmentTurnedInOutlinedIcon />
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
              <SupportAgentOutlinedIcon />
              <h2 className="text-lg font-semibold text-(--default-black-font)">
                {content.flowTitle}
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {content.flowItems.map((item) => (
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
            <h2 className="text-xl font-semibold">{content.supportTitle}</h2>
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
