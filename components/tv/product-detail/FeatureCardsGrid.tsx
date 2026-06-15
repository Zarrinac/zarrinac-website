'use client';

import type { TvFeatureCard } from '@/types/tv';
import FeatureCardImage from '@/components/tv/FeatureCardImage';
import { smoothScrollToId } from '@/lib/scrollToElement';

// Grid of product feature badges. Every card uses one consistent dark "glass"
// tile in both light and dark themes, so logos of any colour (white, teal,
// colourful, or inverted black line icons) read uniformly. See FeatureCardImage
// for the per-logo colour handling.
//
// When `linkTargets[i]` is set, card `i` becomes a button that smooth-scrolls to
// the matching content section (mapping built by buildFeatureCardSectionLinks).
// Cards without a target stay as plain, non-interactive tiles.

type FeatureCardsGridProps = {
  featureCards: TvFeatureCard[];
  linkTargets?: (string | null)[];
};

// Shared tile background: deep slate glass with a soft teal corner sheen.
const TILE_BG =
  '[background:radial-gradient(120%_120%_at_15%_10%,rgba(0,179,172,0.16),transparent_46%),linear-gradient(150deg,#1e293b_0%,#0f172a_55%,#0b1220_100%)]';

const BASE_TILE =
  'flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 p-4 text-center shadow-[0_8px_22px_rgba(2,6,23,0.30)] transition duration-300';

const INTERACTIVE_TILE =
  'cursor-pointer hover:-translate-y-1 hover:border-(--brand-color) hover:shadow-[0_16px_34px_rgba(2,6,23,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)';

const FeatureCardsGrid = ({ featureCards, linkTargets }: FeatureCardsGridProps) => {
  if (featureCards.length === 0) return null;

  return (
    <div className="w-full mx-auto max-w-360">
      <div className="grid w-full grid-cols-2 gap-3 mx-auto sm:grid-cols-3 md:gap-4 md:grid-cols-5">
        {featureCards.map((block, idx) => {
          const target = linkTargets?.[idx] ?? null;
          const inner = (
            <>
              <div className="flex items-center justify-center w-full h-16">
                <FeatureCardImage
                  title={block.title}
                  image={block.image}
                  imageBlack={block.imageBlack}
                  className="max-h-12 w-auto max-w-[80%] object-contain"
                />
              </div>
              <h4 className="text-[11px] font-medium leading-snug text-slate-100/90 md:text-sm">
                {block.title}
              </h4>
            </>
          );

          if (target) {
            return (
              <button
                key={block.title}
                type="button"
                onClick={() => smoothScrollToId(target)}
                className={`group ${BASE_TILE} ${INTERACTIVE_TILE} ${TILE_BG}`}
              >
                {inner}
              </button>
            );
          }

          return (
            <div key={block.title} className={`group ${BASE_TILE} ${TILE_BG}`}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCardsGrid;
