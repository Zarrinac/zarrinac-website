import type { TvFeatureCard } from '@/types/tv';
import FeatureCardImage from '@/components/tv/FeatureCardImage';

// Grid of product feature badges, swapping images for dark mode when available.

type FeatureCardsGridProps = {
  featureCards: TvFeatureCard[];
  compactFeatureTitles: Set<string>;
};

const FeatureCardsGrid = ({ featureCards, compactFeatureTitles }: FeatureCardsGridProps) => {
  if (featureCards.length === 0) return null;

  return (
    <div className="w-full mx-auto max-w-360">
      <div className="grid w-full grid-cols-2 gap-3 mx-auto sm:grid-cols-3 md:gap-4 md:grid-cols-5">
        {featureCards.map((block) => {
          const isInline = block.layout === 'inline';
          const cardLayoutClass = isInline
            ? 'flex-row items-center gap-2.5 px-3 py-3 md:gap-3 md:px-4'
            : 'flex-col gap-2 items-center justify-between px-2 py-2.5 md:px-3';
          const titleClass = isInline
            ? 'text-[11px] text-left leading-snug md:text-sm'
            : 'mb-1 text-[11px] text-center leading-snug md:text-sm md:mb-2';

          return (
            <div
              key={block.title}
              className={`flex ${cardLayoutClass} rounded-xl border border-(--border-color) bg-(--surface-color) shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-(--brand-color) [background:radial-gradient(circle_at_18%_18%,rgba(15,118,178,0.38),transparent_42%),radial-gradient(circle_at_82%_6%,rgba(59,130,246,0.32),transparent_36%),linear-gradient(150deg,rgba(15,23,42,0.6),rgba(15,23,42,0.3)),var(--surface-color)] dark:[background:linear-gradient(150deg,rgba(15,23,42,0.85),rgba(15,23,42,0.55))]`}
              dir={isInline ? 'ltr' : undefined}
            >
              <div className="rounded-2xl bg-(--surface-color-2) flex items-center justify-center">
                {(() => {
                  const isCompact = compactFeatureTitles.has(block.title);
                  const imageClasses = `${isCompact ? 'h-12 mt-4' : 'h-14 mt-2'} w-auto object-contain`;

                  return (
                    <FeatureCardImage
                      title={block.title}
                      image={block.image}
                      imageBlack={block.imageBlack}
                      className={imageClasses}
                    />
                  );
                })()}
              </div>
              <h4 className={titleClass}>{block.title}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCardsGrid;
