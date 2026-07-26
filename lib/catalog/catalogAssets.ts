import { mediaUrl } from '@/lib/mediaUrl';
import type { ProductCategorySlug } from '@/lib/api/products/categories';

// Printed-catalog assets. The scanned spreads and the full PDF live outside the
// repo under `<media>/catalog/` (gitignored, promoted with ops/upload-media.ps1),
// so paths always go through `mediaUrl`.
//
// One spread often covers a whole series, so several product pages legitimately
// point at the same file (e.g. every HRH-*TQ split AC → catalog-hrh.jpg, and both
// washing machines → catalog-wm.jpg, which prints them side by side).

const catalogAsset = (file: string) => mediaUrl(`/catalog/${file}`);

// Every spread is exported from the same print layout, so the intrinsic size is
// shared — next/image needs it up front to reserve space without layout shift.
// This is the post-`ops/optimize-media.mjs` size (its 2048px width cap, applied
// to the 3425×2480 print exports). Re-export a spread → re-run the optimizer and
// keep these two numbers in step, or the image renders with the wrong aspect box.
export const CATALOG_PAGE_WIDTH = 2048;
export const CATALOG_PAGE_HEIGHT = 1483;

export const FULL_CATALOG_URL = catalogAsset('catalog-general-full.pdf');
// File name the browser saves under; the on-disk name is not customer-facing.
export const FULL_CATALOG_DOWNLOAD_NAME = 'hisense-iran-catalog.pdf';

// Lookup keys are `series` (or product id) with separators stripped, so series
// values that are punctuated inconsistently in the content files (`RFC500` vs
// `RFC-300`) still resolve with a single map. Keys below are pre-normalized.
const normalizeKey = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

// Spreads without a matching product page yet are intentionally absent:
// `catalog-hid-t3.jpg` (HID-T3 ducted range) and `catalog-whtc.jpg` (WHTC-18P
// window type) ship to the server but have no category on the site. The U7K TV
// has no spread in this print run, so it renders without a catalog section.
const CATALOG_PAGES: Record<ProductCategorySlug, Record<string, string>> = {
  tvs: {
    Q7Q: 'catalog-q7q.jpg',
    Q6Q: 'catalog-q6q.jpg',
    A4AN: 'catalog-a4an-a3q.jpg',
    A3Q: 'catalog-a4an-a3q.jpg',
  },
  wms: {
    '8010': 'catalog-wm.jpg',
    '8012': 'catalog-wm.jpg',
  },
  rac: {
    HRH: 'catalog-hrh.jpg',
    HRTC: 'catalog-hrtc.jpg',
    HIH: 'catalog-hih.jpg',
    HFH: 'catalog-hfh.jpg',
  },
  cac: {
    HID: 'catalog-hid.jpg',
  },
  refrigerator: {
    SBS650: 'catalog-650.jpg',
    RFT560: 'catalog-560.jpg',
    RFC500: 'catalog-500.jpg',
    RFC300: 'catalog-300.jpg',
    RS370: 'catalog-270-370.jpg',
    FS270: 'catalog-270-370.jpg',
    FC310: 'catalog-210-310.jpg',
    FC210: 'catalog-210-310.jpg',
  },
};

type ProductCatalogQuery = {
  categorySlug?: string | null;
  series?: string | null;
  productId?: string | null;
};

// Resolves the catalog spread for a product, or null when this print run has no
// page for it (callers skip the section entirely rather than showing a gap).
export const getProductCatalogUrl = ({
  categorySlug,
  series,
  productId,
}: ProductCatalogQuery): string | null => {
  const pages = CATALOG_PAGES[(categorySlug ?? '').toLowerCase() as ProductCategorySlug];
  if (!pages) return null;

  for (const candidate of [series, productId]) {
    if (!candidate) continue;
    const file = pages[normalizeKey(candidate)];
    if (file) return catalogAsset(file);
  }

  return null;
};
