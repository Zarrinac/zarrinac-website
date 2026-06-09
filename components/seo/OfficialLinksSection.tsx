import Link from 'next/link';

type OfficialLinkItem = {
  href: string;
  label: string;
  description: string;
};

type OfficialLinksSectionProps = {
  locale: string;
  eyebrow: string;
  title: string;
  items: OfficialLinkItem[];
};

export default function OfficialLinksSection({
  locale,
  eyebrow,
  title,
  items,
}: OfficialLinksSectionProps) {
  const isRTL = locale === 'fa';

  return (
    <section className="px-4 sm:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl rounded-3xl border border-(--border-color) bg-(--surface-color) p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--text-subtle-color)">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-bold text-(--default-black-font) sm:text-3xl">{title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-5 transition hover:-translate-y-0.5 hover:border-(--brand-color)"
            >
              <p className="text-base font-semibold text-(--default-black-font)">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-(--text-muted-color)">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
