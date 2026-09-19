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
  // Optional stable scroll anchor: section `idx` becomes `${prefix}-${startIndex + idx}`.
  sectionIdPrefix?: string;
  startIndex?: number;
};

export default function StackedContentSections({
  sections,
  isRTL = false,
  textFirst = false,
  className,
  cardClassName,
  imageClassName,
  sectionIdPrefix,
  startIndex = 0,
}: StackedContentSectionsProps) {
  const containerClassName = className
    ? `w-full mx-auto space-y-8 sm:space-y-10 md:space-y-12 max-w-360 ${className}`
    : 'w-full mx-auto space-y-8 sm:space-y-10 md:space-y-12 max-w-360';
  const resolvedCardClassName = cardClassName
    ? `overflow-hidden rounded-3xl scroll-mt-28 ${cardClassName}`
    : 'overflow-hidden rounded-3xl scroll-mt-28';
  const resolvedImageClassName = imageClassName
    ? `object-cover rounded-3xl ${imageClassName}`
    : 'object-cover rounded-3xl';

  return (
    <div className={containerClassName} dir={isRTL ? 'rtl' : 'ltr'}>
      {sections.map((section, idx) => {
        const textBlock = (
          <div className="px-4 pb-5 pt-4 text-center sm:px-6 md:px-10">
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">{section.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-(--text-muted-color) md:text-base">
              {section.text}
            </p>
          </div>
        );

        const imageBlock = (
          <div className="relative aspect-video w-full">
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
                />
              );
            })()}
          </div>
        );

        return (
          <div
            key={`${section.title}-${idx}`}
            id={sectionIdPrefix ? `${sectionIdPrefix}-${startIndex + idx}` : undefined}
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
