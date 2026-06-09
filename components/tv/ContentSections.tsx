'use client';

// Alternating image/text sections with intersection observer reveal animations.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ImageSource } from '@/types/tv';

export type ContentSectionData = {
  image: ImageSource;
  title: string;
  text: string;
  textPosition?: 'left' | 'right';
};

type ContentSectionsProps = {
  sections: ContentSectionData[];
  isRTL?: boolean;
  isImageLeft?: boolean;
};

export default function ContentSections({
  sections,
  isRTL = false,
  isImageLeft = false,
}: ContentSectionsProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() => sections.map(() => false));

  useEffect(() => {
    // Fade/slide sections in as they become visible.
    const elements = [...refs.current];
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
      { threshold: 0.5 },
    );

    elements.forEach((el) => el && observer.observe(el));
    return () => {
      elements.forEach((el) => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, [sections.length]);

  return (
    <div className="w-full mx-auto space-y-8 max-w-360 md:space-y-14">
      {sections.map((section, idx) => {
        const isImageRightBase = idx % 2 === 0;
        const isImageRight = isRTL ? !isImageRightBase : isImageRightBase;
        const show = visible[idx];
        const textOffset = isImageRight ? '-translate-x-10' : 'translate-x-10';
        const imageOffset = isImageRight ? 'translate-x-10' : '-translate-x-10';
        return (
          <div
            key={`${section.title}-${idx}`}
            data-index={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            className={`flex flex-col items-center gap-6 ${
              isImageRight || isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div
              className={`flex-1 space-y-2.5 md:space-y-4 transition-all duration-1100 ease-out ${
                show ? 'opacity-100 translate-x-0' : `opacity-0 ${textOffset}`
              }`}
            >
              <h3 className="text-lg font-bold sm:text-xl md:text-2xl">{section.title}</h3>
              <p className="text-sm leading-relaxed text-(--text-muted-color) md:text-base">
                {section.text}
              </p>
            </div>
            <div
              className={`flex-1 overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color-2) shadow-sm transition-all duration-1100 ease-out ${
                show ? 'opacity-100 translate-x-0' : `opacity-0 ${imageOffset}`
              }`}
            >
              <Image
                src={section.image}
                alt={section.title}
                width={1200}
                height={800}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
