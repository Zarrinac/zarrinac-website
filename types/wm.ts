import type {
  ImageSource,
  Locale,
  TvBanner,
  TvComparisonConfig,
  TvFeatureCard,
  TvProductCopy,
  TvSectionConfig,
  TvSectionGroup,
} from './tv';

export type WmProduct = {
  id: string;
  sku: string;
  sizes?: string[];
  series: string;
  seriesLabel?: string;
  extras: string[];
  image: ImageSource;
  heroVideo?: string;
  posterImage?: ImageSource;
  gallery?: ImageSource[];
  contentSections?: TvSectionConfig[];
  stackedSections?: TvSectionConfig[];
  bottomStackedSections?: TvSectionConfig[];
  sectionGroups?: TvSectionGroup[];
  comparisonSections?: TvComparisonConfig[];
  experienceSection?: TvSectionConfig;
  featureCards?: TvFeatureCard[];
  badges?: ImageSource[];
  banners?: TvBanner[];
  specs?: Record<Locale, string[]>;
  copy: Record<Locale, TvProductCopy>;
};
