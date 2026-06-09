import Link from 'next/link';
import { HiArrowLeft, HiArrowRight, HiOutlineWrenchScrewdriver } from 'react-icons/hi2';

// Reusable “under construction” panel with localized CTA buttons.

export type UnderConstructionAction = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

type UnderConstructionProps = {
  eyebrow: string;
  title: string;
  description: string;
  locale: string;
  actions: UnderConstructionAction[];
  supportingText?: string;
  statusItems?: string[];
  className?: string;
};

export default function UnderConstruction({
  eyebrow,
  title,
  description,
  locale,
  actions,
  // supportingText,
  // statusItems = [],
  className,
}: UnderConstructionProps) {
  const isRTL = locale === 'fa';
  const arrowIcon = isRTL ? (
    <HiArrowLeft className="h-4 w-4" aria-hidden="true" />
  ) : (
    <HiArrowRight className="h-4 w-4" aria-hidden="true" />
  );
  const resolvedActions = actions.map((action, index) => ({
    ...action,
    variant: action.variant ?? (index === 0 ? 'primary' : index === 1 ? 'secondary' : 'ghost'),
  }));
  const containerClassName = [
    'relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-(--border-color)',
    'bg-linear-to-br from-(--surface-muted-color) via-white to-(--surface-color)',
    'shadow-(--panel-shadow)',
    className ?? '',
  ]
    .join(' ')
    .trim();

  return (
    <section className={containerClassName}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,179,172,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,139,134,0.1),transparent_30%)]" />
      <div className="relative px-6 py-10 sm:px-12 sm:py-12 lg:items-center">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-(--brand-color) shadow-sm ring-1 ring-(--border-color)">
            <HiOutlineWrenchScrewdriver className="h-4 w-4" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold leading-tight text-(--default-black-font) sm:text-3xl">
              {title}
            </h2>
            <p className="text-base leading-relaxed text-(--text-muted-color) sm:text-lg">
              {description}
            </p>
          </div>
          {resolvedActions.length > 0 && (
            <div
              className={`flex flex-wrap items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}
            >
              {resolvedActions.map((action) => {
                const variant = action.variant ?? 'secondary';
                const baseButtonClass =
                  variant === 'primary'
                    ? 'group inline-flex items-center justify-center gap-2 rounded-full bg-(--brand-color) px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-(--brand-color)/30 transition hover:-translate-y-0.5 hover:bg-(--brand-color-dark) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)'
                    : variant === 'secondary'
                      ? 'group inline-flex items-center justify-center gap-2 rounded-full border border-(--border-color) bg-white/80 px-5 py-3 text-sm font-semibold text-(--default-black-font) transition hover:-translate-y-0.5 hover:border-(--brand-color) hover:text-(--brand-color) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)'
                      : 'inline-flex items-center gap-2 text-sm font-semibold text-(--brand-color) underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)';
                const content = (
                  <>
                    <span>{action.label}</span>
                    {variant !== 'ghost' && (
                      <span className={isRTL ? 'rotate-180' : ''}>{arrowIcon}</span>
                    )}
                  </>
                );
                const isExternal =
                  action.href.startsWith('http') ||
                  action.href.startsWith('mailto:') ||
                  action.href.startsWith('tel:');

                return isExternal ? (
                  <a
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    className={baseButtonClass}
                    rel="noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    className={baseButtonClass}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* <div className="rounded-3xl border border-(--border-color) bg-(--surface-muted-color) p-6 shadow-inner">
          <div className="flex items-center gap-3 text-sm font-semibold text-(--brand-color)">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-(--brand-color) shadow-sm ring-1 ring-(--border-color)">
              <HiOutlineWrenchScrewdriver className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{eyebrow}</span>
          </div>
          <p className="mt-4 text-base text-(--text-muted-color)">
            {supportingText ?? description}
          </p>

          {statusItems.length > 0 && (
            <div className="mt-5 grid gap-3 text-sm text-(--default-black-font)">
              {statusItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-(--border-color)"
                >
                  <span
                    className="mt-0.5 h-2 w-2 rounded-full bg-(--brand-color)"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </section>
  );
}
