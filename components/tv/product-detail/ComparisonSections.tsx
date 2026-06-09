import type { ImageSource } from '@/types/tv';
import BeforeAfterSlider from '@/components/tv/BeforeAfterSlider';

// Renders before/after image comparisons with alternating layout per section.

export type ComparisonSection = {
  title: string;
  text: string;
  before: ImageSource;
  after: ImageSource;
};

type ComparisonLabels = {
  before: string;
  after: string;
};

type ComparisonSectionsProps = {
  sections: ComparisonSection[];
  comparisonLabels: ComparisonLabels;
  lang: 'fa' | 'en';
};

const ComparisonSections = ({ sections, comparisonLabels, lang }: ComparisonSectionsProps) => {
  if (sections.length === 0) return null;

  return (
    <div className="w-full mx-auto space-y-8 sm:space-y-10 md:space-y-12 max-w-360">
      {sections.map((section, idx) => (
        <div key={`${section.title}-${idx}`} className="grid items-center gap-6 lg:grid-cols-2">
          {(() => {
            const isSliderLeftBase = idx % 2 === 0;
            const isSliderLeft = lang === 'fa' ? !isSliderLeftBase : isSliderLeftBase;
            const sliderOrder = isSliderLeft ? 'lg:order-1' : 'lg:order-2';
            const textOrder = isSliderLeft ? 'lg:order-2' : 'lg:order-1';
            return (
              <>
                <div className={sliderOrder}>
                  <BeforeAfterSlider
                    before={section.before}
                    after={section.after}
                    beforeLabel={comparisonLabels.before}
                    afterLabel={comparisonLabels.after}
                    isRTL={lang === 'fa'}
                  />
                </div>
                <div className={`space-y-2.5 lg:space-y-4 ${textOrder}`}>
                  <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{section.title}</h3>
                  <p className="text-sm leading-relaxed text-(--text-muted-color) md:text-base">
                    {section.text}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      ))}
    </div>
  );
};

export default ComparisonSections;
