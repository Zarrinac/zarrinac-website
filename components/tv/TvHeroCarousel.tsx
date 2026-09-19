'use client';

// TV category hero carousel with Embla autoplay and RTL-aware slide order.
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import type { ImageSource } from '@/types/tv';

type Slide = {
  id: string;
  image: ImageSource;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type TvHeroCarouselProps = {
  slides: readonly Slide[];
  locale: string;
};

export default function TvHeroCarousel({ slides, locale }: TvHeroCarouselProps) {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const isRTL = locale === 'fa';
  const orderedSlides = useMemo(() => (isRTL ? [...slides].reverse() : slides), [isRTL, slides]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' }, [
    autoplay,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ direction: isRTL ? 'rtl' : 'ltr' });
    }
  }, [emblaApi, isRTL]);

  const scrollPrev = useCallback(() => {
    autoplay.reset();
    emblaApi?.scrollPrev();
  }, [autoplay, emblaApi]);

  const scrollNext = useCallback(() => {
    autoplay.reset();
    emblaApi?.scrollNext();
  }, [autoplay, emblaApi]);

  return (
    <section
      className="relative isolate overflow-hidden bg-(--surface-color) shadow-xl ring-1 ring-(--border-color)"
      aria-label={isRTL ? 'محصولات منتخب هایسنس' : 'Featured Hisense products'}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative" ref={emblaRef}>
        <div className="flex touch-pan-y select-none">
          {orderedSlides.map((slide, index) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-4/3 w-full overflow-hidden sm:aspect-16/10 md:aspect-video lg:aspect-21/9">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollPrev}
        aria-label={isRTL ? 'اسلاید قبلی' : 'Previous slide'}
        disabled={!emblaApi}
      >
        <HiChevronLeft className="h-4 w-4 2xl:h-6 2xl:w-6" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollNext}
        aria-label={isRTL ? 'اسلاید بعدی' : 'Next slide'}
        disabled={!emblaApi}
      >
        <HiChevronRight className="h-4 w-4 2xl:h-6 2xl:w-6" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm sm:bottom-4 sm:gap-3 sm:px-4 sm:py-2">
        {orderedSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`h-2 w-2 rounded-full transition disabled:cursor-not-allowed ${
              index === selectedIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={isRTL ? `نمایش اسلاید ${index + 1}` : `Go to slide ${index + 1}`}
            aria-pressed={index === selectedIndex}
            disabled={!emblaApi}
            onClick={() => {
              autoplay.reset();
              emblaApi?.scrollTo(index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
