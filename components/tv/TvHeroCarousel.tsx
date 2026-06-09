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

const getSrc = (image: ImageSource) => (typeof image === 'string' ? image : image.src);

function useImagePreloader(images: ImageSource[]) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- set once when there is nothing to preload
      setLoaded(true);
      return;
    }

    let canceled = false;

    const loadImage = (imageData: ImageSource) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = getSrc(imageData);
        if (img.complete) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

    void Promise.all(images.map(loadImage)).then(() => {
      if (!canceled) {
        setLoaded(true);
      }
    });

    return () => {
      canceled = true;
    };
  }, [images]);

  return loaded;
}

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
  const preloadSources = useMemo(() => orderedSlides.map((slide) => slide.image), [orderedSlides]);
  const slidesLoaded = useImagePreloader(preloadSources);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' }, [
    autoplay,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi || !slidesLoaded) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, slidesLoaded]);

  useEffect(() => {
    if (emblaApi && slidesLoaded) {
      emblaApi.reInit({ direction: isRTL ? 'rtl' : 'ltr' });
    }
  }, [emblaApi, isRTL, slidesLoaded]);

  const scrollPrev = useCallback(() => {
    if (!slidesLoaded) {
      return;
    }
    autoplay.reset();
    emblaApi?.scrollPrev();
  }, [autoplay, emblaApi, slidesLoaded]);

  const scrollNext = useCallback(() => {
    if (!slidesLoaded) {
      return;
    }
    autoplay.reset();
    emblaApi?.scrollNext();
  }, [autoplay, emblaApi, slidesLoaded]);

  return (
    <section
      className="relative isolate overflow-hidden bg-(--surface-color) shadow-xl ring-1 ring-(--border-color)"
      aria-label="Featured Hisense TVs"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative" ref={emblaRef} aria-busy={!slidesLoaded}>
        <div
          className={`flex touch-pan-y select-none transition-opacity duration-500 ${
            slidesLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {orderedSlides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-4/3 w-full overflow-hidden sm:aspect-16/10 md:aspect-video lg:aspect-21/9">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
                {/* <div className="absolute inset-0 flex items-end px-6 pb-10 pt-12 sm:px-10 lg:px-16 lg:pb-12 lg:pt-16">
                  <div className="max-w-3xl space-y-3 text-white">
                    <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                      {slide.eyebrow}
                    </p>
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="text-base text-white/80 sm:text-lg">{slide.subtitle}</p>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
        {!slidesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-(--surface-color)">
            <span className="sr-only">Loading banners</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollPrev}
        aria-label="Previous slide"
        disabled={!slidesLoaded}
      >
        <HiChevronLeft className="h-4 w-4 2xl:h-6 2xl:w-6" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollNext}
        aria-label="Next slide"
        disabled={!slidesLoaded}
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
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={index === selectedIndex}
            disabled={!slidesLoaded}
            onClick={() => {
              if (!slidesLoaded) {
                return;
              }
              autoplay.reset();
              emblaApi?.scrollTo(index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
