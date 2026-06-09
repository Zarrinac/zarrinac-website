import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import { createBreadcrumbJsonLd } from '@/lib/seo/site';
import JsonLd from './JsonLd';

type PageBreadcrumbsProps = {
  items: SeoBreadcrumbItem[];
  locale: Locale;
  className?: string;
  includeJsonLd?: boolean;
};

export default function PageBreadcrumbs({
  items,
  locale,
  className = '',
  includeJsonLd = true,
}: PageBreadcrumbsProps) {
  const isRTL = locale === 'fa';

  return (
    <>
      {includeJsonLd ? <JsonLd data={createBreadcrumbJsonLd(items)} /> : null}
      <nav
        aria-label={isRTL ? 'مسیر راهنما' : 'Breadcrumb'}
        className={`px-4 sm:px-6 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-xs font-semibold text-(--text-muted-color) sm:text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            // Key must not be URL-like: React serializes element keys into the
            // RSC flight payload, and a `${href}-${index}` key (e.g. "/en-0",
            // "/fa/about-1") gets picked up by crawlers as a phantom URL → 404.
            return (
              <li key={`crumb-${index}`} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-(--default-black-font)" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="transition hover:text-(--brand-color)">
                    {item.label}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden className="text-(--border-color)">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
