import { prisma } from '@/lib/db';
import { DCODE_PRODUCTS } from '@/content/DcodeProducts';
import type {
  DcodeFeatureCard,
  DcodeLocale,
  DcodeProduct,
  DcodeProductCopy,
  DcodeVariant,
} from '@/types/dcode';

// D'code data source: query the DB first, fall back to the bundled content catalog
// when the database is absent or empty. Mirrors lib/serviceCenterSource.ts —
// DB is authoritative, content/DcodeProducts.ts is the emergency fallback.

type DcodeRow = {
  id: string;
  series: string;
  panel: string;
  resolution: string;
  os: string;
  storage: string;
  viewingAngle: string;
  tuner: string;
  sound: string;
  connectivity: string[];
  warrantyMonths: number;
  extras: string[];
  heroImageUrl: string;
  heroVideoUrl: string | null;
  remoteImageUrl: string | null;
  gallery: unknown;
  featureCards: unknown;
  remotes: unknown;
  specs: unknown;
  variants: {
    sku: string;
    size: string;
    diagonalInch: number;
    imageUrl: string;
    dimensionsWithoutStand: string;
    dimensionsWithStand: string;
    netWeight: string;
  }[];
  copies: {
    locale: string;
    name: string;
    tagline: string;
    description: string | null;
    highlights: string[];
  }[];
};

const EMPTY_SPECS: Record<DcodeLocale, string[]> = { en: [], fa: [] };
const EMPTY_REMOTES: Record<DcodeLocale, string[]> = { en: [], fa: [] };

const mapRow = (row: DcodeRow): DcodeProduct => {
  const variants: DcodeVariant[] = row.variants.map((variant) => ({
    sku: variant.sku,
    size: variant.size,
    diagonalInch: variant.diagonalInch,
    image: variant.imageUrl,
    dimensionsWithoutStand: variant.dimensionsWithoutStand,
    dimensionsWithStand: variant.dimensionsWithStand,
    netWeight: variant.netWeight,
  }));

  const copy = row.copies.reduce(
    (acc, row_) => {
      const locale = row_.locale === 'fa' ? 'fa' : 'en';
      acc[locale] = {
        name: row_.name,
        tagline: row_.tagline,
        description: row_.description ?? '',
        highlights: row_.highlights,
      };
      return acc;
    },
    {} as Partial<Record<DcodeLocale, DcodeProductCopy>>,
  );

  // Guarantee both locales so the page never renders an empty copy block.
  const en = copy.en ?? copy.fa;
  const fa = copy.fa ?? copy.en;

  return {
    id: row.id,
    brand: 'dcode',
    category: 'led',
    series: row.series,
    panel: row.panel,
    resolution: row.resolution,
    os: row.os,
    storage: row.storage,
    viewingAngle: row.viewingAngle,
    tuner: row.tuner,
    sound: row.sound,
    connectivity: row.connectivity,
    warrantyMonths: row.warrantyMonths,
    extras: row.extras,
    heroImage: row.heroImageUrl,
    heroVideo: row.heroVideoUrl ?? undefined,
    remoteImage: row.remoteImageUrl ?? undefined,
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
    featureCards: Array.isArray(row.featureCards) ? (row.featureCards as DcodeFeatureCard[]) : [],
    remotes: (row.remotes as Record<DcodeLocale, string[]>) ?? EMPTY_REMOTES,
    specs: (row.specs as Record<DcodeLocale, string[]>) ?? EMPTY_SPECS,
    variants,
    copy: {
      en: en ?? { name: '', tagline: '', description: '', highlights: [] },
      fa: fa ?? { name: '', tagline: '', description: '', highlights: [] },
    },
  };
};

export async function getDcodeProducts(): Promise<DcodeProduct[]> {
  if (!prisma) {
    return DCODE_PRODUCTS;
  }
  try {
    const rows = await prisma.dcodeProduct.findMany({
      include: {
        variants: { orderBy: { sortOrder: 'asc' } },
        copies: true,
      },
    });
    if (rows.length === 0) {
      return DCODE_PRODUCTS;
    }
    return rows.map((row) => mapRow(row as unknown as DcodeRow));
  } catch {
    return DCODE_PRODUCTS;
  }
}

export async function getDcodeProductById(id: string): Promise<DcodeProduct | undefined> {
  const products = await getDcodeProducts();
  return products.find((product) => product.id === id);
}
