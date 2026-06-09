import type { FC } from 'react';

// Lightweight breadcrumb trail with schema.org markup for the TV detail pages.

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  lang: 'fa' | 'en';
  className?: string;
  separatorClassName?: string;
  includeStructuredData?: boolean;
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  lang,
  className = '',
  separatorClassName = '',
  includeStructuredData = true,
}) => (
  <nav
    aria-label={lang === 'fa' ? 'مسیر راهنما' : 'Breadcrumb'}
    className={className}
    {...(includeStructuredData
      ? {
          itemScope: true,
          itemType: 'https://schema.org/BreadcrumbList',
        }
      : {})}
  >
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, idx) => (
        <li
          key={`crumb-${idx}`}
          {...(includeStructuredData
            ? {
                itemProp: 'itemListElement',
                itemScope: true,
                itemType: 'https://schema.org/ListItem',
              }
            : {})}
          className="flex items-center gap-2"
        >
          <a
            href={item.href}
            {...(includeStructuredData ? { itemProp: 'item' } : {})}
            className="hover:text-(--brand-color) transition-colors"
          >
            <span {...(includeStructuredData ? { itemProp: 'name' } : {})}>{item.label}</span>
          </a>
          {includeStructuredData ? <meta itemProp="position" content={`${idx + 1}`} /> : null}
          {idx < items.length - 1 && (
            <span aria-hidden className={separatorClassName || undefined}>
              /
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
