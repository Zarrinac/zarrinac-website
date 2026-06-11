'use client';

// Brand-themed detail body for a D'code product (the R6D LED line). Renders on the
// D'code black/red palette (independent of the site light/dark toggle) and mirrors
// the Hisense TV detail layout: hero with an overlaid breadcrumb + size badges,
// an icon feature grid, a spec sheet, and a gallery. Interactive: size selector.
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import { DCODE_THEME_STYLE } from '@/components/dcode/dcodeTheme';
import type { DcodeLocale, DcodeProduct } from '@/types/dcode';

export type DcodeShowcaseLabels = {
  selectSize: string;
  model: string;
  specifications: string;
  keyFeatures: string;
  gallery: string;
  dimensionsWithStand: string;
  dimensionsWithoutStand: string;
  netWeight: string;
  watchVideo: string;
};

export type DcodeBreadcrumb = { label: string; href: string };

type DcodeShowcaseProps = {
  product: DcodeProduct;
  locale: DcodeLocale;
  labels: DcodeShowcaseLabels;
  breadcrumbItems: DcodeBreadcrumb[];
};

const imageToSrc = (image: DcodeProduct['heroImage']): string =>
  typeof image === 'string' ? image : image.src;

export default function DcodeShowcase({
  product,
  locale,
  labels,
  breadcrumbItems,
}: DcodeShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const copy = product.copy[locale];
  const specs = product.specs[locale] ?? [];
  const activeVariant = product.variants[activeIndex] ?? product.variants[0];
  const Chevron = locale === 'fa' ? HiChevronLeft : HiChevronRight;

  return (
    <div
      style={DCODE_THEME_STYLE}
      className="bg-(--dcode-black) text-(--dcode-text)"
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Breadcrumb — part of the hero */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-(--dcode-text-muted) sm:text-sm">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li key={item.href} className="flex items-center gap-1.5">
                  {isLast ? (
                    <span className="text-(--dcode-text)">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="transition-colors hover:text-(--dcode-red)">
                      {item.label}
                    </Link>
                  )}
                  {!isLast && <Chevron aria-hidden className="opacity-60" />}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Hero */}
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <DcodeLogo className="h-10 w-auto" priority />
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {copy.name}
            </h1>
            <p className="text-lg text-(--dcode-text-muted) sm:text-xl">{copy.tagline}</p>
            <p className="text-sm leading-relaxed text-(--dcode-text-muted) sm:text-base">
              {copy.description}
            </p>
            {product.heroVideo && (
              <a
                href={product.heroVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-(--dcode-red) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
              >
                ▶ {labels.watchVideo}
              </a>
            )}
          </div>

          <div className="relative">
            <div className="relative aspect-4/3 w-full">
              <Image
                src={activeVariant.image}
                alt={`${copy.name} — ${activeVariant.size}`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Size selector */}
        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-(--dcode-text-muted)">
            {labels.selectSize}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.variants.map((variant, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={variant.sku}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`min-w-20 rounded-2xl border px-5 py-3 text-center transition-colors ${
                    isActive
                      ? 'border-(--dcode-red) bg-(--dcode-red) text-white'
                      : 'border-(--dcode-border) bg-(--dcode-surface-muted) text-(--dcode-text) hover:border-(--dcode-red)'
                  }`}
                >
                  <span className="block text-lg font-bold" dir="ltr">
                    {variant.size}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active variant detail */}
          <div className="mt-6 grid gap-4 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface-muted) p-6 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label={labels.model} value={activeVariant.sku} ltr />
            <DetailItem
              label={labels.dimensionsWithStand}
              value={activeVariant.dimensionsWithStand}
              ltr
            />
            <DetailItem
              label={labels.dimensionsWithoutStand}
              value={activeVariant.dimensionsWithoutStand}
              ltr
            />
            <DetailItem label={labels.netWeight} value={activeVariant.netWeight} ltr />
          </div>
        </section>

        {/* Feature cards */}
        {product.featureCards && product.featureCards.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold">{labels.keyFeatures}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.featureCards.map((card) => {
                const iconSrc = card.icon ? imageToSrc(card.icon) : null;
                return (
                  <div
                    key={card.title[locale]}
                    className="flex gap-4 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface-muted) p-6"
                  >
                    {iconSrc ? (
                      <div className="relative h-12 w-16 shrink-0">
                        <Image
                          src={iconSrc}
                          alt=""
                          fill
                          aria-hidden
                          className="object-contain object-left"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <span
                        className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-(--dcode-red)"
                        aria-hidden
                      />
                    )}
                    <div>
                      <h3 className="text-base font-bold text-(--dcode-text)">
                        {card.title[locale]}
                      </h3>
                      <p className="mt-1 text-sm text-(--dcode-text-muted)">
                        {card.description[locale]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Specifications */}
        {specs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold">{labels.specifications}</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {specs.map((spec) => (
                <li
                  key={spec}
                  className="flex gap-3 border-b border-(--dcode-border) pb-3 text-sm text-(--dcode-text-muted)"
                >
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--dcode-red)"
                    aria-hidden
                  />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Gallery */}
        {product.gallery && product.gallery.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold">{labels.gallery}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {product.gallery.map((image, index) => (
                <div
                  key={`${activeVariant.sku}-gallery-${index}`}
                  className="relative aspect-4/3 overflow-hidden rounded-2xl border border-(--dcode-border) bg-(--dcode-surface-muted)"
                >
                  <Image
                    src={image}
                    alt={`${copy.name} ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="rounded-2xl border border-(--dcode-border) bg-(--dcode-black) p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--dcode-text-muted)">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-(--dcode-text)" dir={ltr ? 'ltr' : undefined}>
        {value}
      </p>
    </div>
  );
}
