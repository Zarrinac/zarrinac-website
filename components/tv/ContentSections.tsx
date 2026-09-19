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
  // Optional stable scroll anchor: section `idx` becomes `${prefix}-${startIndex + idx}`.
  sectionIdPrefix?: string;
  startIndex?: number;
};

export default function ContentSections({
  sections,
  isRTL = false,
  isImageLeft = false,
  sectionIdPrefix,
  startIndex = 0,
}: ContentSectionsProps) {
  return (
    <div className="w-full mx-auto space-y-8 max-w-360 md:space-y-14">
      {sections.map((section, idx) => {
        const isImageRightBase = idx % 2 === 0;
        const isImageRight = isRTL ? !isImageRightBase : isImageRightBase;
        return (
          <div
            key={`${section.title}-${idx}`}
            id={sectionIdPrefix ? `${sectionIdPrefix}-${startIndex + idx}` : undefined}
            className={`flex scroll-mt-28 flex-col items-center gap-6 ${
              isImageRight || isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="flex-1 space-y-2.5 md:space-y-4">
              <h2 className="text-lg font-bold sm:text-xl md:text-2xl">{section.title}</h2>
              <p className="text-sm leading-relaxed text-(--text-muted-color) md:text-base">
                {section.text}
              </p>
            </div>
            <div className="flex-1 overflow-hidden rounded-3xl border border-(--border-color) bg-(--surface-color-2) shadow-sm">
              <Image
                src={section.image}
                alt={section.title}
                width={1200}
                height={800}
                sizes="(min-width: 1440px) 720px, (min-width: 768px) 50vw, 100vw"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
