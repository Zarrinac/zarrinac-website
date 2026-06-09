import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

// Mobile-friendly header for the TV detail page showing breadcrumbs and sizes.

type MobileHeaderProps = {
  breadcrumbItems: BreadcrumbItem[];
  lang: 'fa' | 'en';
  seriesDisplay: string;
  copyName: string;
  availableSizes: string[];
};

const MobileHeader = ({
  breadcrumbItems,
  lang,
  seriesDisplay,
  copyName,
  availableSizes,
}: MobileHeaderProps) => (
  <div
    className={`md:hidden w-full mx-auto max-w-360 px-4 space-y-2 ${
      lang === 'fa' ? 'text-right' : 'text-left'
    }`}
  >
    <Breadcrumbs
      items={breadcrumbItems}
      lang={lang}
      className="text-[11px] font-semibold text-(--text-muted-color)"
      separatorClassName="text-(--border-color)"
      includeStructuredData={false}
    />
    <div className="space-y-1.5">
      {/* Mobile-visible H1 (BannerSection holds the desktop H1, hidden on mobile). */}
      <h1 className="text-xl font-black leading-tight text-(--default-black-font) sm:text-2xl">
        {seriesDisplay || copyName}
      </h1>
      {availableSizes.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2.5 text-xs text-(--text-muted-color)">
          {availableSizes.map((size, idx) => (
            <li key={`${size}-${idx}`} className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 items-center justify-center rounded-full border border-(--brand-color)" />
              <span className="font-semibold text-(--default-black-font)">{size}</span>
              {idx < availableSizes.length - 1 && (
                <span aria-hidden className="text-(--border-color)">
                  |
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default MobileHeader;
