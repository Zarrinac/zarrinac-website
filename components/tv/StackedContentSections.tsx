'use client';

// Animated stack of image/text sections with optional RTL + text-first ordering.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ImageSource } from '@/types/tv';

export type StackedSectionData = {
  image: ImageSource;
  title: string;
  text: string;
};

type StackedContentSectionsProps = {
  sections: StackedSectionData[];
  isRTL?: boolean;
  textFirst?: boolean;
  className?: string;
  cardClassName?: string;
  imageClassName?: string;
};

export default function StackedContentSections({
  sections,
  isRTL = false,
  textFirst = false,
  className,
  cardClassName,
  imageClassName,
}: StackedContentSectionsProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() => sections.map(() => false));

  useEffect(() => {
    // Fade/slide sections in as they enter the viewport.
    const targets = [...refs.current];
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          entries.forEach((entry) => {
            const indexAttr = (entry.target as HTMLElement).dataset.index;
            if (!indexAttr) return;
            const idx = Number(indexAttr);
            if (entry.isIntersecting) {
              next[idx] = true;
            }
          });
          return next;
        });
      },
      { threshold: 0.35 },
    );

    targets.forEach((el) => el && observer.observe(el));
    return () => {
      targets.forEach((el) => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, [sections.length]);

  const containerClassName = className
    ? `w-full mx-auto space-y-8 sm:space-y-10 md:space-y-12 max-w-360 ${className}`
    : 'w-full mx-auto space-y-8 sm:space-y-10 md:space-y-12 max-w-360';
  const resolvedCardClassName = cardClassName
    ? `overflow-hidden rounded-3xl ${cardClassName}`
    : 'overflow-hidden rounded-3xl';
  const resolvedImageClassName = imageClassName
    ? `object-cover rounded-3xl ${imageClassName}`
    : 'object-cover rounded-3xl';

  return (
    <div className={containerClassName} dir={isRTL ? 'rtl' : 'ltr'}>
      {sections.map((section, idx) => {
        const show = visible[idx];
        const textBlock = (
          <div
            className={`px-4 pb-5 pt-4 text-center sm:px-6 md:px-10 transition-all duration-700 ease-out ${
              show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: show ? '140ms' : '0ms' }}
          >
            <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{section.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-(--text-muted-color) md:text-base">
              {section.text}
            </p>
          </div>
        );

        const imageBlock = (
          <div
            className={`relative aspect-video w-full transition-all duration-1000 ease-out ${
              show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/*
             * Normalize the image source to the exact union Next.js expects to avoid any/unsafe lint noise.
             */}
            {(() => {
              const imageSrc: ImageSource = section.image;
              return (
                <Image
                  src={imageSrc}
                  alt={section.title}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className={resolvedImageClassName}
                  priority={idx === 0}
                />
              );
            })()}
          </div>
        );

        return (
          <div
            key={`${section.title}-${idx}`}
            data-index={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            className={resolvedCardClassName}
          >
            {textFirst ? (
              <>
                {textBlock}
                {imageBlock}
              </>
            ) : (
              <>
                {imageBlock}
                {textBlock}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
