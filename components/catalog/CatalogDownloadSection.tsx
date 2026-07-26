import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { FULL_CATALOG_DOWNLOAD_NAME, FULL_CATALOG_URL } from '@/lib/catalog/catalogAssets';

// Full-catalog download CTA. Copy is passed in so each host page keeps its own
// localized wording (the homepage keeps all of its copy in one place).
type CatalogDownloadSectionProps = {
  eyebrow: string;
  heading: string;
  description: string;
  cta: string;
  note: string;
  isRTL: boolean;
};

const CatalogDownloadSection = ({
  eyebrow,
  heading,
  description,
  cta,
  note,
  isRTL,
}: CatalogDownloadSectionProps) => (
  <section className="bg-(--surface-color) py-12 lg:py-16" dir={isRTL ? 'rtl' : 'ltr'}>
    <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-(--border-color) bg-(--surface-muted-color) p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-(--brand-color)">
            <MenuBookOutlinedIcon fontSize="small" />
            <span>{eyebrow}</span>
          </p>
          <h2 className="text-2xl font-bold text-(--default-black-font) sm:text-3xl">{heading}</h2>
          <p className="max-w-2xl text-sm leading-7 text-(--text-muted-color) sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 shrink-0 lg:items-center">
          <a
            href={FULL_CATALOG_URL}
            download={FULL_CATALOG_DOWNLOAD_NAME}
            className="inline-flex items-center gap-2 rounded-full bg-(--brand-color) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark)"
          >
            <DownloadOutlinedIcon fontSize="small" />
            <span>{cta}</span>
          </a>
          <span className="text-xs text-(--text-subtle-color)">{note}</span>
        </div>
      </div>
    </div>
  </section>
);

export default CatalogDownloadSection;
