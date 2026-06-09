// Shared product contract returned by the product API routes.
import type { ProductCategory } from './categories';

export type ApiLocale = 'en' | 'fa';

export type ApiCopyBlock = {
  title?: string;
  text?: string;
};

export type ApiCopy = {
  locale: ApiLocale;
  name: string;
  tagline: string;
  description?: string;
  highlights: string[];
  blocks: Record<string, ApiCopyBlock>;
};

export type ApiBanner = {
  id: string;
  desktop: string;
  mobile?: string;
  alt: string;
};

export type ApiSection = {
  image: string;
  copyKey: string;
  textPosition?: 'left' | 'right';
};

export type ApiSectionGroup = {
  kind: 'content' | 'stacked' | 'overlay';
  textFirst?: boolean;
  sections: ApiSection[];
};

export type ApiComparisonSection = {
  copyKey: string;
  before: string;
  after: string;
};

export type ApiFeatureCard = {
  title: string;
  description: string;
  image: string;
  imageBlack?: string;
};

export type ApiExperienceSection = {
  copyKey: string;
  image: string;
};

export type ApiProduct = {
  id: string;
  slug: string;
  category: ProductCategory;
  sku?: string | null;
  size?: string | null;
  sizes: string[];
  series: string;
  seriesLabel?: string | null;
  panel: string;
  resolution: string;
  refreshRate: string;
  os: string;
  sound: string;
  connectivity: string[];
  tuner: string;
  extras: string[];
  imageUrl: string;
  posterImageUrl?: string | null;
  heroVideoUrl?: string | null;
  gallery?: string[];
  banners?: ApiBanner[];
  featureCards?: ApiFeatureCard[];
  sectionGroups?: ApiSectionGroup[];
  contentSections?: ApiSection[];
  stackedSections?: ApiSection[];
  bottomStackedSections?: ApiSection[];
  comparisonSections?: ApiComparisonSection[];
  experienceSection?: ApiExperienceSection;
  badges?: string[];
  specs?: Record<ApiLocale, string[]>;
  copy: Record<ApiLocale, ApiCopy>;
};
