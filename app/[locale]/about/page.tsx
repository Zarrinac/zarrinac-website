import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import { getAboutContent } from '@/content/about';
import type { AboutImageKey, AboutPageContent } from '@/content/about/types';
import JsonLd from '@/components/seo/JsonLd';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import { mediaUrl } from '@/lib/mediaUrl';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
} from '@/lib/seo/site';

// About page hydrates structured content from locale-specific JSON files.
const OG_LOCALE_MAP: Record<Locale, string> = {
  fa: 'fa_IR',
  en: 'en_US',
};

const aboutAsset = (path: string) => mediaUrl(`/images/${path}`);

const ABOUT_IMAGES: Record<AboutImageKey, string> = {
  factory: aboutAsset('factory.png'),
  hisense: aboutAsset('hisense.png'),
  showroom: aboutAsset('showroom.png'),
};

type AboutPageProps = {
  params: Promise<{ locale: Locale }>;
};

function resolveAboutContent(locale: Locale): AboutPageContent {
  return getAboutContent(locale);
}

function getImageAsset(key: AboutImageKey): string {
  return ABOUT_IMAGES[key] ?? ABOUT_IMAGES.factory;
}

export async function generateMetadata(props: AboutPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const content = resolveAboutContent(locale);
  const metadataBase = new URL(SITE_URL);
  const localizedPath = `/${locale}/about`;
  const showroomSrc = getImageAsset('showroom');
  const ogImageUrl = showroomSrc.startsWith('http') ? showroomSrc : `${SITE_URL}${showroomSrc}`;
  const languageAlternates = getLanguageAlternates('/about');

  return {
    metadataBase,
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: `${SITE_URL}${localizedPath}`,
      siteName: 'Zarrin Namaye Caspian | Hisense Iran',
      locale: OG_LOCALE_MAP[locale],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 800,
          alt: content.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const content = resolveAboutContent(locale);
  const isRTL = locale === 'fa';
  const heroImage = content.hero.imageKey ? getImageAsset(content.hero.imageKey) : null;
  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: content.meta.title,
    href: `/${locale}/about`,
  });
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: content.meta.title,
    description: content.meta.description,
    url: `${SITE_URL}/${locale}/about`,
    inLanguage: getLocaleLanguage(locale),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
  };
  const officialLinks =
    locale === 'fa'
      ? {
          eyebrow: 'مسیرهای رسمی برند',
          title: 'صفحات کلیدی هایسنس ایران',
          items: [
            {
              href: `/${locale}`,
              label: 'صفحه اصلی هایسنس ایران',
              description: 'مرجع رسمی برند، دسته‌بندی محصولات و سیگنال اصلی جستجوی برند.',
            },
            {
              href: `/${locale}/contact-us`,
              label: 'تماس با ما',
              description: 'شماره‌های تماس، دفتر مرکزی و کانال‌های رسمی پشتیبانی.',
            },
            {
              href: `/${locale}/warranty-and-guarantee`,
              label: 'گارانتی و خدمات',
              description: 'شرایط گارانتی، خدمات پس از فروش و مسیرهای پشتیبانی رسمی.',
            },
            {
              href: `/${locale}/hisense-repair`,
              label: 'خدمات تعمیر و پشتیبانی',
              description: 'سرویس و تعمیرات رسمی برای محصولات هایسنس در سراسر ایران.',
            },
            {
              href: `/${locale}/complaint`,
              label: 'فرم شکایت',
              description: 'ثبت و پیگیری شکایت‌های مرتبط با خدمات، گارانتی یا کیفیت محصول.',
            },
          ],
        }
      : {
          eyebrow: 'Official brand paths',
          title: 'Key Hisense Iran pages',
          items: [
            {
              href: `/${locale}`,
              label: 'Hisense Iran homepage',
              description: 'Official brand hub for products, categories, and core entity signals.',
            },
            {
              href: `/${locale}/contact-us`,
              label: 'Contact us',
              description:
                'Verified phone numbers, head office details, and official support channels.',
            },
            {
              href: `/${locale}/warranty-and-guarantee`,
              label: 'Warranty and service',
              description:
                'Official warranty terms, after-sales information, and service guidance.',
            },
            {
              href: `/${locale}/hisense-repair`,
              label: 'Repair and support',
              description: 'Official maintenance, repair, and product support page.',
            },
            {
              href: `/${locale}/complaint`,
              label: 'Complaint form',
              description:
                'Submit service, warranty, or product complaints for official follow-up.',
            },
          ],
        };

  return (
    <div className="space-y-16 bg-(--background-color) pb-20 pt-10">
      <JsonLd data={aboutSchema} />
      <PageBreadcrumbs items={breadcrumbItems} locale={locale} className="-mt-5 pt-0" />
      <section className="relative isolate overflow-hidden px-6 py-16 text-(--hero-title-color) sm:py-24">
        {heroImage && (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Image src={heroImage} alt="" fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}
        <div className="mx-auto max-w-5xl text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-white/70">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80">{content.hero.summary}</p>
          {content.hero.ctas && content.hero.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {content.hero.ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white hover:text-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {cta.label}
                </a>
              ))}
              <Link
                href={`/${locale}`}
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white hover:text-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {locale === 'fa' ? 'صفحه اصلی هایسنس ایران' : 'Hisense Iran homepage'}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-(--surface-color) p-8 shadow-lg ring-1 ring-(--border-color)">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.stats.map((stat) => (
              <div key={`${stat.label}-${stat.value}`} className="text-center sm:text-start">
                <p className="text-3xl font-bold text-(--brand-color) sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-base font-semibold text-(--default-black-font)">
                  {stat.label}
                </p>
                {stat.sublabel && (
                  <p className="mt-1 text-sm text-(--text-muted-color)">{stat.sublabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {content.pillars && content.pillars.length > 0 && (
        <section className="px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-(--surface-color) p-8 shadow-lg ring-1 ring-(--border-color)">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-(--text-subtle-color)">
                {locale === 'fa' ? 'ارکان برند' : 'Brand pillars'}
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                {locale === 'fa'
                  ? 'هم‌راستا با global.hisense.com'
                  : 'Aligned with global.hisense.com storytelling'}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {content.pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-6 transition hover:-translate-y-1 hover:border-(--brand-color)"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--brand-color)">
                    {pillar.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-(--text-muted-color)">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.sections.map((section, index) => {
        const isEven = index % 2 === 0;
        const imageAsset = getImageAsset(section.image.key);
        return (
          <section key={section.title} className="px-6">
            <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-(--surface-color) p-8 shadow-lg ring-1 ring-(--border-color) lg:grid-cols-2 lg:items-center">
              <div className={`flex flex-col gap-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-(--text-subtle-color)">
                  {section.subtitle}
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">{section.title}</h2>
                <div className="space-y-4 text-base leading-relaxed text-(--text-muted-color)">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.highlights && (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {section.highlights.map((item) => (
                      <li
                        key={item.title}
                        className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-4"
                      >
                        <p className="text-sm font-semibold text-(--brand-color)">{item.title}</p>
                        <p className="mt-1 text-sm text-(--text-muted-color)">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={`relative overflow-hidden rounded-2xl bg-(--surface-muted-color) ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <Image
                  src={imageAsset}
                  alt={section.image.alt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </section>
        );
      })}

      {content.timeline && content.timeline.length > 0 && (
        <section className="px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-(--surface-color) p-8 shadow-lg ring-1 ring-(--border-color)">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-(--text-subtle-color)">
                {locale === 'fa' ? 'جدول زمانی' : 'Timeline'}
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {locale === 'fa' ? 'نقاط عطف هایسنس ایران' : 'Key milestones of Hisense Iran'}
              </h2>
            </div>
            <div
              className={`relative border-(--border-color) ${
                isRTL ? 'border-e-2 pr-6' : 'border-s-2 pl-6'
              }`}
            >
              {content.timeline.map((entry) => (
                <div
                  key={`${entry.year}-${entry.title}`}
                  className={`relative pb-8 last:pb-0 ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                >
                  <span
                    className="absolute top-1 h-4 w-4 rounded-full border-2 border-white bg-(--brand-color) shadow ring-4 ring-(--surface-color)"
                    style={isRTL ? { right: -15 } : { left: -15 }}
                  />
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-(--brand-color)">
                    {entry.year}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-(--default-black-font)">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-base text-(--text-muted-color)">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.values && content.values.length > 0 && (
        <section className="px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-(--surface-muted-color) p-8 shadow-inner ring-1 ring-(--border-color)">
            <div className="grid gap-6 md:grid-cols-2">
              {content.values.map((value) => (
                <div key={value.title} className="rounded-2xl bg-(--surface-color) p-6 shadow">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--brand-color)">
                    {value.title}
                  </p>
                  <p className="mt-3 text-base text-(--text-muted-color)">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <OfficialLinksSection
        locale={locale}
        eyebrow={officialLinks.eyebrow}
        title={officialLinks.title}
        items={officialLinks.items}
      />

      {content.csr && (
        <section className="px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-(--surface-color) p-8 shadow-lg ring-1 ring-(--border-color)">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-(--text-subtle-color)">
                  {locale === 'fa' ? 'مسئولیت اجتماعی' : 'CSR & sustainability'}
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{content.csr.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-(--text-muted-color)">
                  {content.csr.description}
                </p>
              </div>
              <div className="space-y-4">
                {content.csr.highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-5 shadow-sm"
                  >
                    <p className="text-base font-semibold text-(--default-black-font)">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-(--text-muted-color)">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-(--brand-color) px-8 py-12 text-white shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">
                {content.hero.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{content.contact.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                {content.contact.description}
              </p>
              <a
                href={content.contact.ctaHref}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-(--brand-color) transition hover:bg-white/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {content.contact.ctaLabel}
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {content.contact.items.map((item) => (
                <div key={`${item.label}-${item.value}`} className="rounded-2xl bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-3 block text-lg font-semibold leading-tight text-white hover:text-white/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-3 text-lg font-semibold leading-tight">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
