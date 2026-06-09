'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { BreadcrumbItem } from '@/components/tv/product-detail/Breadcrumbs';
import Breadcrumbs from '@/components/tv/product-detail/Breadcrumbs';
import type { ImageSource } from '@/types/tv';

type RefrigeratorHeroProps = {
  locale: string;
  lang: 'fa' | 'en';
  breadcrumbItems: BreadcrumbItem[];
  productName: string;
  seriesDisplay: string;
  tagline?: string;
  gallery: ImageSource[];
  availableColors?: string[];
};

export default function RefrigeratorHero({
  lang,
  breadcrumbItems,
  productName,
  seriesDisplay,
  tagline,
  gallery,
  availableColors,
}: RefrigeratorHeroProps) {
  const images = useMemo(
    () => (Array.isArray(gallery) && gallery.length > 0 ? gallery : []),
    [gallery],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRatio, setActiveRatio] = useState('1 / 1');
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section className="w-full pt-4 sm:pt-6">
      <div className="w-full mx-auto max-w-360 px-4 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={breadcrumbItems}
          lang={lang}
          className="text-[11px] sm:text-xs md:text-sm font-semibold"
          separatorClassName="opacity-60"
        />

        <div className="mt-4 grid gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10">
          <div>
            <div
              className="relative w-full overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#fafafa,#eef1f4)] shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
              style={{ aspectRatio: activeRatio }}
            >
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={productName}
                  fill
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  className="object-contain"
                  priority
                  onLoad={(event) => {
                    const image = event.currentTarget;
                    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                      setActiveRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
                    }
                  }}
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5 sm:gap-3">
                {images.map((image, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={`${productName}-thumb-${idx}`}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-12 w-12 overflow-hidden rounded-xl border sm:h-14 sm:w-14 ${
                        isActive ? 'border-(--brand-color)' : 'border-black/10'
                      }`}
                      aria-label={`Select image ${idx + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${productName} thumbnail ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain bg-white/80 p-2"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className={lang === 'fa' ? 'text-right' : 'text-left'}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted-color)">
              {seriesDisplay}
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-(--text-color) sm:mt-3 sm:text-4xl lg:text-5xl">
              {productName}
            </h1>
            {availableColors && availableColors.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-4 sm:gap-4">
                <div className="inline-flex h-3 w-5 items-center justify-center rounded-full border border-(--brand-color) bg-(--brand-color)" />
                <ul className="flex flex-wrap items-center gap-3 text-xs font-semibold text-(--text-muted-color) sm:gap-4 sm:text-base">
                  {availableColors.map((color, idx) => (
                    <li key={`${color}-${idx}`} className="flex items-center gap-2">
                      <span>{color}</span>
                      {idx < availableColors.length - 1 && (
                        <span aria-hidden className="opacity-70">
                          |
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tagline && (
              <p className="mt-3 text-sm leading-relaxed text-(--text-muted-color) sm:mt-4 sm:text-base lg:text-lg">
                {tagline}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
