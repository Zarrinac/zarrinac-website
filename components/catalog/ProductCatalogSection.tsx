import Image from 'next/image';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import {
  CATALOG_PAGE_HEIGHT,
  CATALOG_PAGE_WIDTH,
  FULL_CATALOG_DOWNLOAD_NAME,
  FULL_CATALOG_URL,
} from '@/lib/catalog/catalogAssets';

// Catalog spread for a single product, plus the full-catalog download. Copy is
// inlined per locale like the sibling detail sections (SpecsSection etc.).
type ProductCatalogSectionProps = {
  src: string;
  productId: string;
  productName: string;
  lang: 'fa' | 'en';
  id?: string;
};

const COPY = {
  fa: {
    heading: 'کاتالوگ محصول',
    description: (name: string) =>
      `صفحه رسمی کاتالوگ هایسنس ایران برای ${name} با جدول کامل مشخصات فنی. برای دیدن در اندازه واقعی روی تصویر بزنید.`,
    alt: (name: string) => `کاتالوگ و مشخصات فنی ${name} — هایسنس ایران`,
    openFull: 'مشاهده در اندازه کامل',
    downloadPage: 'دانلود کاتالوگ این محصول',
    downloadFull: 'دانلود کاتالوگ کامل محصولات (PDF)',
  },
  en: {
    heading: 'Product catalog',
    description: (name: string) =>
      `Official Hisense Iran catalog page for ${name}, including the full specification table. Tap the image to view it at full size.`,
    alt: (name: string) => `${name} catalog page with technical specifications — Hisense Iran`,
    openFull: 'View full size',
    downloadPage: 'Download this catalog page',
    downloadFull: 'Download the full product catalog (PDF)',
  },
} as const;

const ProductCatalogSection = ({
  src,
  productId,
  productName,
  lang,
  id = 'product-catalog',
}: ProductCatalogSectionProps) => {
  const copy = COPY[lang];

  return (
    <div
      id={id}
      // scroll-mt offsets the sticky desktop header when jumped to via anchor.
      className="w-full mx-auto space-y-8 scroll-mt-24 sm:space-y-10 md:space-y-12 max-w-360"
    >
      <div className="space-y-4 rounded-3xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm sm:p-6 md:p-8">
        <h2 className="text-xl font-bold text-center sm:text-2xl md:text-3xl">{copy.heading}</h2>
        <p className="mx-auto max-w-3xl text-sm leading-7 text-center text-(--text-muted-color)">
          {copy.description(productName)}
        </p>

        <figure className="space-y-3">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label={copy.openFull}
            className="group block overflow-hidden rounded-2xl border border-(--border-color) bg-(--surface-muted-color) transition hover:border-(--brand-color)"
          >
            <Image
              src={src}
              alt={copy.alt(productName)}
              width={CATALOG_PAGE_WIDTH}
              height={CATALOG_PAGE_HEIGHT}
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="w-full h-auto"
            />
          </a>
          <figcaption className="flex items-center justify-center gap-1.5 text-xs text-(--text-subtle-color)">
            <OpenInNewOutlinedIcon fontSize="inherit" />
            <span>{copy.openFull}</span>
          </figcaption>
        </figure>

        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <a
            href={src}
            download={`hisense-${productId}-catalog.jpg`}
            className="inline-flex items-center gap-2 rounded-full bg-(--brand-color) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark)"
          >
            <DownloadOutlinedIcon fontSize="small" />
            <span>{copy.downloadPage}</span>
          </a>
          <a
            href={FULL_CATALOG_URL}
            download={FULL_CATALOG_DOWNLOAD_NAME}
            className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--surface-color) px-5 py-2.5 text-sm font-semibold text-(--default-black-font) transition hover:border-(--brand-color) hover:text-(--brand-color)"
          >
            <PictureAsPdfOutlinedIcon fontSize="small" />
            <span>{copy.downloadFull}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogSection;
