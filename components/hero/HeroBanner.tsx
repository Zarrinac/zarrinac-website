'use client';

// Homepage hero carousel with image preloading and Embla autoplay controls.
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { mediaUrl } from '@/lib/mediaUrl';

type ImageSource = StaticImageData | string;

type Banner = {
  id: string;
  desktop: ImageSource;
  mobile?: ImageSource;
  alt: string;
};

const bannerAsset = (path: string) => mediaUrl(`/banner/${path}`);

const BANNERS: Banner[] = [
  {
    id: 'banner-1',
    desktop: bannerAsset('Fix-Banner-02-Back.jpg'),
    alt: 'Hisense flagship lineup hero 1',
  },
  {
    id: 'banner-2',
    desktop: bannerAsset('Fix-Banner-03-Back.jpg'),
    alt: 'Hisense flagship lineup hero 2',
  },
  {
    id: 'banner-3',
    desktop: bannerAsset('Fix-Banner-04-Back.jpg'),
    alt: 'Hisense flagship lineup hero 3',
  },
  {
    id: 'banner-4',
    desktop: bannerAsset('Fix-Banner-05-Back.jpg'),
    alt: 'Hisense flagship lineup hero 4',
  },
  {
    id: 'banner-5',
    desktop: bannerAsset('Fix-Banner-06-Back.jpg'),
    alt: 'Hisense flagship lineup hero 5',
  },
];

const getSrc = (imageData: ImageSource) =>
  typeof imageData === 'string' ? imageData : imageData.src;

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

export default function HeroBanner() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const preloadSources = useMemo(() => {
    return BANNERS.reduce<ImageSource[]>((sources, banner) => {
      sources.push(banner.desktop);
      if (banner.mobile) {
        sources.push(banner.mobile);
      }
      return sources;
    }, []);
  }, []);
  const bannersLoaded = useImagePreloader(preloadSources);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!emblaApi || !bannersLoaded) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, bannersLoaded]);

  useEffect(() => {
    if (emblaApi && bannersLoaded) {
      emblaApi.reInit();
    }
  }, [emblaApi, bannersLoaded]);

  const scrollPrev = useCallback(() => {
    if (!bannersLoaded) {
      return;
    }
    autoplay.reset();
    emblaApi?.scrollPrev();
  }, [autoplay, emblaApi, bannersLoaded]);

  const scrollNext = useCallback(() => {
    if (!bannersLoaded) {
      return;
    }
    autoplay.reset();
    emblaApi?.scrollNext();
  }, [autoplay, emblaApi, bannersLoaded]);

  const slides = useMemo(() => {
    return BANNERS.map((banner) => ({
      ...banner,
      source: isMobile && banner.mobile ? banner.mobile : banner.desktop,
    }));
  }, [isMobile]);

  return (
    <section
      className="relative isolate overflow-hidden bg-(--surface-color)"
      aria-label="Featured Hisense campaigns"
      dir="ltr"
    >
      <div className="relative" ref={emblaRef} aria-busy={!bannersLoaded}>
        {/* No opacity gate: the first slide must paint on first render so the
            priority hero image is the LCP. The section is overflow-hidden, so
            slides 2+ stay clipped before Embla hydrates. */}
        <div className="flex touch-pan-y select-none">
          {slides.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-9/16 w-full md:aspect-video lg:aspect-21/9">
                <Image
                  src={banner.source}
                  alt={banner.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  priority
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollPrev}
        aria-label="Previous banner"
        disabled={!bannersLoaded}
      >
        <HiChevronLeft className="h-4 w-4 2xl:h-6 2xl:w-6" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-(--border-color) bg-white/60 p-3 text-(--default-black-font) shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
        onClick={scrollNext}
        aria-label="Next banner"
        disabled={!bannersLoaded}
      >
        <HiChevronRight className="h-4 w-4 2xl:h-6 2xl:w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`h-2 w-2 rounded-full transition disabled:cursor-not-allowed ${
              index === selectedIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to banner ${index + 1}`}
            aria-pressed={index === selectedIndex}
            disabled={!bannersLoaded}
            onClick={() => {
              if (!bannersLoaded) {
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
