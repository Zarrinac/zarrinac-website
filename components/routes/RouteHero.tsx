import type { Locale } from '@/i18n/routing';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';

// Slim hero block for route landing pages.
type RouteHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  locale?: Locale;
  breadcrumbItems?: SeoBreadcrumbItem[];
};

export default function RouteHero({
  eyebrow,
  title,
  description,
  locale,
  breadcrumbItems,
}: RouteHeroProps) {
  return (
    <>
      {locale && breadcrumbItems ? (
        <PageBreadcrumbs items={breadcrumbItems} locale={locale} className="pb-3 pt-5 sm:pt-6" />
      ) : null}
      <section className="bg-(--surface-muted-color) px-4 py-12 text-(--default-black-font) sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-(--text-subtle-color) sm:text-xs sm:tracking-[0.6em]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-(--text-muted-color) sm:mt-5 sm:text-base lg:text-lg">
            {description}
          </p>
        </div>
      </section>
    </>
  );
}
