import ContentSections, { type ContentSectionData } from '@/components/tv/ContentSections';
import OverlayContentSections from '@/components/tv/OverlayContentSections';
import StackedContentSections from '@/components/tv/StackedContentSections';

// Dispatches normalized section groups to the appropriate layout component.

export type NormalizedSectionGroup = {
  kind: 'content' | 'stacked' | 'overlay';
  sections: ContentSectionData[];
  textFirst?: boolean;
};

type SectionGroupsRendererProps = {
  sectionGroups: NormalizedSectionGroup[];
  lang: 'fa' | 'en';
  overlayTone?: 'light' | 'dark';
  // When set, each rendered section gets a stable id (`${prefix}-${flatIndex}`)
  // so feature cards can smooth-scroll to it. Index is global across all groups.
  sectionIdPrefix?: string;
};

const SectionGroupsRenderer = ({
  sectionGroups,
  lang,
  overlayTone = 'light',
  sectionIdPrefix,
}: SectionGroupsRendererProps) => {
  // Running start index per group (global across all groups). Computed purely so
  // we never reassign during render — group counts are tiny, so O(n²) is fine.
  const startIndices = sectionGroups.map((_, idx) =>
    sectionGroups.slice(0, idx).reduce((sum, group) => sum + group.sections.length, 0),
  );
  return (
    <>
      {sectionGroups.map((group, idx) => {
        const startIndex = startIndices[idx];
        if (group.kind === 'content') {
          return (
            <ContentSections
              key={`content-${idx}`}
              sections={group.sections}
              isRTL={lang === 'fa'}
              sectionIdPrefix={sectionIdPrefix}
              startIndex={startIndex}
            />
          );
        }
        if (group.kind === 'overlay') {
          return (
            <OverlayContentSections
              key={`overlay-${idx}`}
              sections={group.sections}
              isRTL={lang === 'fa'}
              tone={overlayTone}
              sectionIdPrefix={sectionIdPrefix}
              startIndex={startIndex}
            />
          );
        }
        return (
          <StackedContentSections
            key={`stacked-${idx}`}
            sections={group.sections}
            isRTL={lang === 'fa'}
            textFirst={group.textFirst}
            sectionIdPrefix={sectionIdPrefix}
            startIndex={startIndex}
          />
        );
      })}
    </>
  );
};

export default SectionGroupsRenderer;
