'use client';

// Standalone showcase list for TV products rendered from content data.
import Image from 'next/image';
import Link from 'next/link';
import { type TvProduct } from '@/types/tv';

type TvProductShowcaseProps = {
  products: TvProduct[];
  locale: string;
  quoteLabel: string;
  supportLabel: string;
};

export default function TvProductShowcase({
  products,
  locale,
  quoteLabel,
  supportLabel,
}: TvProductShowcaseProps) {
  const lang: 'fa' | 'en' = locale === 'fa' ? 'fa' : 'en';
  const dir = lang === 'fa' ? 'rtl' : 'ltr';
  const specLabels =
    lang === 'fa'
      ? {
          resolution: 'وضوح تصویر',
          platform: 'سیستم عامل',
          sound: 'صدا',
          tuner: 'تیونر',
        }
      : {
          resolution: 'Resolution',
          platform: 'Platform',
          sound: 'Sound',
          tuner: 'Tuner',
        };

  return (
    <div className="space-y-10" dir={dir}>
      {products.map((product) => {
        const copy = product.copy[lang];
        return (
          <article
            key={product.id}
            className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color) shadow-sm ring-1 ring-(--border-color)"
          >
            <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative aspect-video w-full overflow-hidden bg-(--surface-color) lg:aspect-video">
                <Image
                  src={product.image}
                  alt={copy.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition duration-700 hover:scale-[1.02]"
                  priority
                />
              </div>

              <div className="flex flex-col gap-4 px-6 py-6 sm:px-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-(--brand-color)">
                  <span>{product.size}</span>
                  <span className="rounded-full bg-(--brand-color)/10 px-3 py-1 text-(--brand-color-dark)">
                    {product.series}
                  </span>
                  <span className="rounded-full bg-(--brand-color)/10 px-3 py-1 text-(--brand-color-dark)">
                    {product.panel}
                  </span>
                  <span className="rounded-full bg-(--brand-color)/10 px-3 py-1 text-(--brand-color-dark)">
                    {product.refreshRate}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold sm:text-3xl">{copy.name}</h3>
                  <p className="text-base font-semibold text-(--text-muted-color)">
                    {copy.tagline}
                  </p>
                  <p className="text-sm text-(--text-muted-color)">{copy.description}</p>
                </div>

                <ul className="grid gap-2 text-sm text-(--default-black-font) sm:grid-cols-2">
                  {copy.highlights.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 rounded-xl bg-(--surface-color-2) px-3 py-2"
                    >
                      <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-(--brand-color)" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid gap-2 text-xs text-(--text-muted-color) sm:grid-cols-2">
                  <Spec label={specLabels.resolution} value={product.resolution} />
                  <Spec label={specLabels.platform} value={product.os} />
                  <Spec label={specLabels.sound} value={product.sound} />
                  <Spec label={specLabels.tuner} value={product.tuner} />
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {product.connectivity.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-(--border-color) px-3 py-1 text-(--default-black-font)"
                    >
                      {item}
                    </span>
                  ))}
                  {product.extras.map((extra) => (
                    <span
                      key={extra}
                      className="rounded-full bg-(--brand-color)/10 px-3 py-1 text-(--brand-color-dark)"
                    >
                      {extra}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/contact-us`}
                    className="inline-flex items-center gap-2 rounded-full bg-(--brand-color) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                  >
                    {quoteLabel}
                  </Link>
                  <Link
                    href={`/${locale}/hisense-repair`}
                    className="inline-flex items-center gap-2 rounded-full border border-(--border-color) px-4 py-2 text-sm font-semibold text-(--default-black-font) transition hover:border-(--brand-color) hover:text-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                  >
                    {supportLabel}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

type SpecProps = {
  label: string;
  value: string;
};

function Spec({ label, value }: SpecProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-(--surface-color-2) px-3 py-2">
      <span className="text-(--default-black-font)">{label}</span>
      <span className="text-(--text-muted-color)">{value}</span>
    </div>
  );
}
