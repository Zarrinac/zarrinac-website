import { type ImageSource } from '@/types/tv';

// Content shape for the D'code brand. D'code is a separate brand from Hisense with
// its own palette and (eventually) its own site. Today it ships a single LED TV
// line (R6D) in three sizes; the model is deliberately kept independent of the
// Hisense `TvProduct` type so the two brands can evolve separately.

export type DcodeLocale = 'en' | 'fa';

// Product family. Only `led` exists today — `ac` etc. will be added later.
export type DcodeCategory = 'led';

// A single physical size of a D'code product. Each size is its own SKU and carries
// its own box dimensions / weight; everything else is shared at the product level.
export type DcodeVariant = {
  sku: string;
  size: string; // display label, e.g. '55"'
  diagonalInch: number; // 55
  image: ImageSource;
  dimensionsWithoutStand: string; // "1230 × 77 × 719 mm"
  dimensionsWithStand: string; // "1230 × 257 × 795 mm"
  netWeight: string; // "12.5 kg"
};

export type DcodeProductCopy = {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
};

export type DcodeFeatureCard = {
  title: Record<DcodeLocale, string>;
  description: Record<DcodeLocale, string>;
  // Optional icon (white/light asset, since D'code pages render on a dark theme).
  // Reused from the Hisense TV icon set for features the D'code model genuinely has.
  icon?: ImageSource;
};

export type DcodeProduct = {
  id: string; // 'r6d'
  brand: 'dcode';
  category: DcodeCategory;
  series: string; // 'R6D'
  panel: string;
  resolution: string;
  os: string;
  storage: string;
  viewingAngle: string;
  tuner: string;
  sound: string;
  connectivity: string[];
  warrantyMonths: number;
  remotes: Record<DcodeLocale, string[]>;
  extras: string[];
  heroImage: ImageSource;
  heroVideo?: string;
  remoteImage?: ImageSource;
  gallery?: ImageSource[];
  variants: DcodeVariant[];
  featureCards?: DcodeFeatureCard[];
  specs: Record<DcodeLocale, string[]>;
  copy: Record<DcodeLocale, DcodeProductCopy>;
};
