'use client';

// Overlay variant of content sections with image-first layout and animated copy overlays.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ContentSectionData } from './ContentSections';

type OverlayContentSectionsProps = {
  sections: ContentSectionData[];
  isRTL?: boolean;
  tone?: 'light' | 'dark';
  // Optional stable scroll anchor: section `idx` becomes `${prefix}-${startIndex + idx}`.
  sectionIdPrefix?: string;
  startIndex?: number;
};

export default function OverlayContentSections({
  sections,
  isRTL = false,
  tone = 'light',
  sectionIdPrefix,
  startIndex = 0,
}: OverlayContentSectionsProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() => sections.map(() => false));

  useEffect(() => {
    // Reveal blocks when they enter view for subtle motion.
    const targets = [...refs.current];
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          entries.forEach((entry) => {
            const indexAttr = (entry.target as HTMLElement).dataset.index;
            if (!indexAttr) return;
            const idx = Number(indexAttr);
            if (entry.isIntersecting) next[idx] = true;
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
  }, [sections]);

  return (
    <div
      className="w-full mx-auto space-y-8 sm:space-y-10 max-w-360 md:space-y-16 lg:my-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {sections.map((section, idx) => {
        const requestedSide = section.textPosition ?? (idx % 2 === 0 ? 'left' : 'right');
        const isTextLeft = isRTL ? requestedSide === 'left' : requestedSide === 'right';
        const textAlign = isTextLeft ? 'items-start text-right' : 'items-end text-left';
        const textOffset = isTextLeft ? '-translate-x-6' : 'translate-x-6';
        const show = visible[idx];
        const textToneClass = tone === 'dark' ? 'text-(--default-black-font)' : 'text-white';
        const textMutedClass = tone === 'dark' ? 'text-black/70' : 'text-white/85';
        const overlayClass =
          tone === 'dark'
            ? 'bg-linear-to-t from-white/80 via-white/35 to-transparent'
            : 'bg-linear-to-t from-black/30 via-transparent to-black/5';
        const shadowClass = tone === 'dark' ? '' : 'drop-shadow-[0_14px_32px_rgba(0,0,0,0.65)]';

        return (
          <div
            key={`${section.title}-${idx}`}
            id={sectionIdPrefix ? `${sectionIdPrefix}-${startIndex + idx}` : undefined}
            data-index={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            className="overflow-hidden scroll-mt-28"
          >
            <div className="flex flex-col">
              <div
                className={`lg:hidden flex flex-col gap-2.5 px-4 pb-5 pt-4 sm:px-6 md:px-10 transition-all duration-700 ease-out text-center justify-center`}
                style={{ transitionDelay: show ? '140ms' : '0ms' }}
              >
                <h3 className="text-lg font-black leading-tight sm:text-xl">{section.title}</h3>
                <p className="text-sm leading-relaxed text-(--text-muted-color)">{section.text}</p>
              </div>

              <div
                className={`relative overflow-hidden aspect-video w-full rounded-3xl transition-all duration-900 ease-out lg:aspect-21/9 lg:min-h-105 ${
                  show ? 'opacity-100 translate-y-0' : `opacity-0 ${textOffset}`
                }`}
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  sizes="(min-width: 1440px) 1200px, (min-width: 1024px) 90vw, 100vw"
                  className="object-cover"
                  priority={idx === 0}
                />

                <div className={`hidden lg:block absolute inset-0 ${overlayClass}`} />
                <div
                  className={`hidden lg:flex absolute inset-0 items-center px-5 py-10 sm:px-10 lg:px-16 ${
                    isTextLeft ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-105 space-y-4 ${textToneClass} ${shadowClass} transition-all duration-900 ease-out ${
                      show
                        ? 'opacity-100 translate-y-0 translate-x-0'
                        : `opacity-0 translate-y-4 ${textOffset}`
                    } ${textAlign}`}
                    style={{ transitionDelay: show ? '140ms' : '0ms' }}
                  >
                    <h3 className="text-xl font-black leading-tight sm:text-xl lg:text-2xl 4xl:text-3xl">
                      {section.title}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed sm:text-sm lg:text-base 4xl:text-lg ${textMutedClass}`}
                    >
                      {section.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
