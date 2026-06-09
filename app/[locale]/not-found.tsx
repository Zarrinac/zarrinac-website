import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import type { Locale } from '@/i18n/routing';

// Locale-aware 404 with brand logos and localized navigation actions.

export default async function NotFoundPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: 'NotFound' });
  const homeHref = `/${locale}`;

  const isRTL = locale === 'fa';

  return (
    <section className="py-16 lg:py-24 px-2 md:px-6 xl:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-linear-to-br from-(--surface-muted-color) via-(--surface-color) to-white text-(--default-black-font) shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,179,172,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(0,139,134,0.12),transparent_30%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14 sm:px-12 lg:px-16 lg:gap-16">
          <div className="flex flex-col lg:flex-row lg:justify-center items-center gap-4 sm:gap-6">
            <Image
              src="/icons/hisense-logo-full.svg"
              alt="Hisense logo"
              width={150}
              height={40}
              className="h-8 w-auto sm:h-10 lg:h-14"
              unoptimized
              priority
            />
            <span className="h-8 w-px bg-(--border-color) sm:h-10" aria-hidden="true" />
            <Image
              src="/icons/Zarrin-Logo-Black.png"
              alt="Zarrin Namaye Caspian logo"
              width={160}
              height={40}
              className="h-10 w-auto sm:h-14 lg:h-16"
              priority
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl text-center font-semibold lg:font-bold leading-tight sm:text-3xl 2xl:text-5xl">
              {t('title')}
            </h1>
            <p className="max-w-3xl text-center text-sm text-(--text-muted-color) lg:text-lg">
              {t('description')}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:justify-center items-center gap-4">
            <Link
              href={homeHref}
              className={`inline-flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} w-full  items-center gap-2 rounded-full bg-(--brand-color) px-5 py-3 text-sm font-semibold justify-center text-white shadow-lg shadow-(--brand-color)/30 transition hover:bg-(--brand-color-dark) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)`}
            >
              {isRTL ? (
                <HiArrowLeft className="h-5 w-5" aria-hidden="true" />
              ) : (
                <HiArrowRight className="h-5 w-5" aria-hidden="true" />
              )}
              {t('actions.home')}
            </Link>
            <Link
              href={`${homeHref}/contact-us`}
              className="inline-flex w-full items-center gap-2 rounded-full border border-(--border-color) bg-white/70 px-5 py-3 text-sm font-semibold justify-center text-(--default-black-font) transition hover:-translate-y-0.5 hover:border-(--brand-color) hover:text-(--brand-color) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
            >
              {t('actions.contact')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
