import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ContentSections, { type ContentSectionData } from '@/components/tv/ContentSections';
import BannerSection from '@/components/tv/product-detail/BannerSection';
import MobileHeader from '@/components/tv/product-detail/MobileHeader';
import FeatureIntro from '@/components/tv/product-detail/FeatureIntro';
import HeroMedia from '@/components/tv/product-detail/HeroMedia';
import FeatureCardsGrid from '@/components/tv/product-detail/FeatureCardsGrid';
import SectionGroupsRenderer, {
  type NormalizedSectionGroup,
} from '@/components/tv/product-detail/SectionGroupsRenderer';
import ComparisonSections, {
  type ComparisonSection,
} from '@/components/tv/product-detail/ComparisonSections';
import SpecsSection from '@/components/tv/product-detail/SpecsSection';
import SpecsJumpButton from '@/components/tv/product-detail/SpecsJumpButton';
import JsonLd from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/components/tv/product-detail/Breadcrumbs';
import type {
  CopyBlock,
  CopyBlockKey,
  TvBanner,
  TvSectionConfig,
  TvSectionGroup,
} from '@/types/tv';
import type { ApiProduct } from '@/lib/api/products/types';
import { categoryFromSlug, type ProductCategorySlug } from '@/lib/api/products/categories';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { createInternalApiUrl } from '@/lib/api/internalUrl';
import { buildProductJsonLd, buildVideoObjectJsonLd } from '@/lib/seo/productSchema';
import { buildProductMetaDescription, buildProductMetaTitle } from '@/lib/seo/productMeta';
import { buildProductFaqs, getProductFaqHeading } from '@/lib/seo/productFaq';
import { buildFeatureCardSectionLinks } from '@/lib/products/featureCardSectionLinks';
import ProductFaqSection from '@/components/seo/ProductFaqSection';
import ProductCatalogSection from '@/components/catalog/ProductCatalogSection';
import { getProductCatalogUrl } from '@/lib/catalog/catalogAssets';

// Builds product detail pages from the API (DB-first) with bundled content as fallback via the API layer.

type PageParams = {
  locale?: string;
  category?: string;
  productId?: string;
};

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

const COPY_BLOCK_KEYS: CopyBlockKey[] = [
  'featureIntro',
  'masterMoment',
  'intelligentProcessor',
  'detail',
  'details',
  'dolby',
  'imax',
  'filmMaker',
  'gamePlay',
  'autoLight',
  'sportsMode',
  'optimization',
  'stayConnected',
  'experience',
  'vrr',
  'screenTear',
  'vividColor',
  'gaming',
  'enhancement',
  'noBlur',
  'fuzzyImage',
  'brightness',
  'gameManagement',
  'movies',
  'biggerScreen',
  'sizes',
  'voiceCommand',
  'nature',
  'depth',
  'entertainment',
  'audio',
  'leaderboard',
  'easyFastSecure',
  'cast',
  'connect',
  'visual',
  'quickWash',
  'allergySteam',
  'stains',
  'selfDiagnostic',
  'durableInverter',
  'quickWashDry',
  'lintClean',
  'fourInOneFilter',
  'slimDesign',
  'innerHighLiftPump',
  'floatSwitch',
  'filter',
  'onePaAdjustment',
  'accurateTemperatureControl',
  'iFeel',
  'autoSwing4d',
  'antiCorrosionGoldenFin',
  'easyCleaning',
  'easyInstallations',
  'easyMaintenance',
  'anionSterilization',
  'highEnergyEfficiency',
];

const COPY_BLOCK_KEYS_SET = new Set(COPY_BLOCK_KEYS);

// ISR: cache the rendered page (and its DB-backed product fetch) and refresh
// hourly instead of re-querying the database on every request/crawl.
export const revalidate = 3600;

const resolveLocale = (locale?: string): 'fa' | 'en' => (locale === 'fa' ? 'fa' : 'en');

const toSrc = (image: string | { src: string }) => (typeof image === 'string' ? image : image.src);

type CopyBlocksInput = ApiProduct['copy']['en']['blocks'];

type Blocks = Partial<Record<CopyBlockKey, CopyBlock>>;

const filterBlocks = (copyBlocks: CopyBlocksInput): Blocks => {
  const filtered: Blocks = {};
  if (!copyBlocks) return filtered;
  Object.entries(copyBlocks).forEach(([key, value]) => {
    if (!COPY_BLOCK_KEYS_SET.has(key as CopyBlockKey)) return;
    if (!value || typeof value !== 'object') return;
    const title =
      typeof (value as { title?: unknown }).title === 'string'
        ? (value as { title: string }).title
        : undefined;
    const text =
      typeof (value as { text?: unknown }).text === 'string'
        ? (value as { text: string }).text
        : undefined;
    if (title || text) {
      filtered[key as CopyBlockKey] = { ...(title ? { title } : {}), ...(text ? { text } : {}) };
    }
  });
  return filtered;
};

const getBlock = (blocks: Blocks, key: string): CopyBlock | undefined => {
  if (!COPY_BLOCK_KEYS_SET.has(key as CopyBlockKey)) return undefined;
  return blocks[key as CopyBlockKey];
};

type NormalizedProduct = ApiProduct;

const buildBanners = (product: NormalizedProduct, copyName: string): TvBanner[] =>
  product.banners && product.banners.length > 0
    ? product.banners
    : [{ id: 'default-banner', desktop: product.imageUrl, alt: copyName }];

const resolveSections = (
  sections: TvSectionConfig[] | undefined,
  blocks: Blocks,
): ContentSectionData[] => {
  if (!sections) return [];

  return sections.reduce<ContentSectionData[]>((acc, section) => {
    const block = blocks[section.copyKey];
    if (!block?.title || !block?.text) return acc;

    const resolved: ContentSectionData = {
      image: section.image,
      title: block.title,
      text: block.text,
      ...(section.textPosition ? { textPosition: section.textPosition } : {}),
    };

    acc.push(resolved);
    return acc;
  }, []);
};

const buildDefaultSectionGroups = (product: NormalizedProduct): TvSectionGroup[] => {
  const defaults: TvSectionGroup[] = [];

  if (product.contentSections) {
    defaults.push({
      kind: 'content',
      sections: product.contentSections.map((section) => ({
        ...section,
        copyKey: section.copyKey as CopyBlockKey,
      })),
    });
  }
  if (product.stackedSections) {
    defaults.push({
      kind: 'stacked',
      sections: product.stackedSections.map((section) => ({
        ...section,
        copyKey: section.copyKey as CopyBlockKey,
      })),
    });
  }
  if (product.bottomStackedSections) {
    defaults.push({
      kind: 'stacked',
      textFirst: true,
      sections: product.bottomStackedSections.map((section) => ({
        ...section,
        copyKey: section.copyKey as CopyBlockKey,
      })),
    });
  }

  return defaults;
};

const buildSectionGroups = (
  product: NormalizedProduct,
  blocks: Blocks,
): NormalizedSectionGroup[] => {
  const defaultSectionGroups = buildDefaultSectionGroups(product);
  const sectionGroupConfigs: TvSectionGroup[] = Array.isArray(product.sectionGroups)
    ? (product.sectionGroups ?? [])
        .filter(
          (group): group is NonNullable<ApiProduct['sectionGroups']>[number] =>
            Boolean(group) && Array.isArray(group.sections) && typeof group.kind === 'string',
        )
        .map((group) => ({
          ...group,
          sections: group.sections.map((section) => ({
            ...section,
            copyKey: section.copyKey as CopyBlockKey,
          })),
        }))
        .map((group) => group as unknown as TvSectionGroup)
    : defaultSectionGroups;

  return sectionGroupConfigs.flatMap((group) => {
    const sections = resolveSections(group?.sections ?? [], blocks);
    if (sections.length === 0) return [];

    const normalized: NormalizedSectionGroup = {
      kind: group.kind,
      sections,
      ...(group.kind === 'stacked' ? { textFirst: Boolean(group.textFirst) } : {}),
    };
    return [normalized];
  });
};

const buildExperienceSection = (
  product: NormalizedProduct,
  blocks: Blocks,
): ContentSectionData | null => {
  const key = product.experienceSection?.copyKey;
  const experienceBlock = key ? getBlock(blocks, key) : undefined;

  if (!product.experienceSection || !experienceBlock?.title || !experienceBlock?.text) {
    return null;
  }

  return {
    image: product.experienceSection.image,
    title: experienceBlock.title,
    text: experienceBlock.text,
  };
};

const buildComparisonSections = (
  product: NormalizedProduct,
  blocks: Blocks,
): ComparisonSection[] => {
  if (!Array.isArray(product.comparisonSections)) {
    return [];
  }
  const items: ComparisonSection[] = [];
  product.comparisonSections.forEach((section) => {
    const block = getBlock(blocks, section.copyKey);
    if (!block?.title || !block?.text) return;
    items.push({
      title: block.title,
      text: block.text,
      before: section.before,
      after: section.after,
    });
  });
  return items;
};

const resolveSpecs = (
  specs: Record<'en' | 'fa', string[]> | undefined,
  lang: 'fa' | 'en',
): string[] => {
  if (!specs) return [];
  if (lang === 'fa' && Array.isArray(specs.fa)) return specs.fa;
  if (Array.isArray(specs.en)) return specs.en;
  return [];
};

const getAvailableSizes = (product: NormalizedProduct): string[] =>
  product.sizes?.length && product.sizes.length > 0
    ? product.sizes
    : product.size
      ? [product.size]
      : [];

const getSeriesDisplay = (product: NormalizedProduct) =>
  product.seriesLabel ?? [product.series, product.panel].filter(Boolean).join(' ');

const buildBreadcrumbItems = (
  locale: string,
  categoryLabel: string,
  productLabel: string,
  productId: string,
  categorySlug: ProductCategorySlug,
): BreadcrumbItem[] => [
  ...createBreadcrumbItems(
    locale === 'fa' ? 'fa' : 'en',
    { label: productLabel, href: `/${locale}/products/${categorySlug}/${productId}` },
    [{ label: categoryLabel, href: `/${locale}/products/${categorySlug}` }],
  ),
];

const productApiUrl = (categorySlug: ProductCategorySlug, id: string) =>
  createInternalApiUrl(`/api/products/${id}?category=${categorySlug}`);

const fetchProduct = async (
  categorySlug: ProductCategorySlug,
  productId: string,
): Promise<NormalizedProduct | null> => {
  try {
    const response = await fetch(productApiUrl(categorySlug, productId), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return null;
    }
    const product = (await response.json()) as NormalizedProduct;
    return product;
  } catch {
    return null;
  }
};

const getCategoryCopy = async (categorySlug: ProductCategorySlug) => {
  if (categorySlug === 'tvs') {
    const routeTranslations = await getTranslations('Routes.tvHisense');
    return {
      label: routeTranslations('title'),
      keywords: (product: NormalizedProduct) => [
        product.id,
        product.series,
        product.panel,
        product.resolution,
        product.refreshRate,
        'Hisense',
        'Mini-LED',
        'ULED',
      ],
    };
  }
  if (categorySlug === 'wms') {
    const routeTranslations = await getTranslations('Routes.washingMachine');
    return {
      label: routeTranslations('title'),
      keywords: (product: NormalizedProduct) => [
        product.id,
        product.series,
        'Hisense',
        'Washing machine',
        'Laundry',
      ],
    };
  }
  if (categorySlug === 'rac') {
    const routeTranslations = await getTranslations('Routes.rac');
    return {
      label: routeTranslations('title'),
      keywords: (product: NormalizedProduct) => [
        product.id,
        product.series,
        product.seriesLabel ?? '',
        'Hisense',
        'Air Conditioner',
        'RAC',
      ],
    };
  }
  if (categorySlug === 'cac') {
    const routeTranslations = await getTranslations('Routes.cac');
    return {
      label: routeTranslations('title'),
      keywords: (product: NormalizedProduct) => [
        product.id,
        product.series,
        product.seriesLabel ?? '',
        'Hisense',
        'Commercial Air Conditioner',
        'Ducted HVAC',
        'CAC',
      ],
    };
  }
  return {
    label: '',
    keywords: () => [],
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const localeParam = resolved?.locale ?? 'en';
  setRequestLocale(resolveLocale(localeParam));
  const categorySlug = (resolved?.category ?? '').toLowerCase() as ProductCategorySlug;
  const productId = resolved?.productId ?? '';
  if (!productId) return {};
  if (!categoryFromSlug(categorySlug)) return {};

  const product = await fetchProduct(categorySlug, productId);
  if (!product) return {};

  const lang = resolveLocale(localeParam);
  const copy = product.copy[lang];
  const imageUrl = toSrc(product.posterImageUrl ?? product.imageUrl);
  const languageAlternates = getLanguageAlternates(`/products/${categorySlug}/${productId}`);
  const categoryCopy = await getCategoryCopy(categorySlug);

  const metaDescription = buildProductMetaDescription(lang, copy.name);
  return {
    title: buildProductMetaTitle(lang, copy.name),
    description: metaDescription,
    keywords: categoryCopy.keywords(product).filter(Boolean),
    openGraph: {
      title: copy.name,
      description: metaDescription,
      images: [{ url: imageUrl }],
      url: `/${localeParam}/products/${categorySlug}/${productId}`,
      type: 'website',
    },
    alternates: {
      canonical: `/${localeParam}/products/${categorySlug}/${productId}`,
      languages: languageAlternates,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.name,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolved?.locale ?? 'en';
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  setRequestLocale(resolvedLocale);
  const categorySlug = (resolved?.category ?? '').toLowerCase() as ProductCategorySlug;
  const productId = resolved?.productId ?? '';
  const lang = resolveLocale(locale);

  if (!productId || !categoryFromSlug(categorySlug)) {
    notFound();
  }

  const product = await fetchProduct(categorySlug, productId);

  if (!product) {
    notFound();
  }

  const copy = product.copy[lang];
  const blocks = filterBlocks(copy.blocks);
  const featureIntroTitle = blocks.featureIntro?.title;
  const featureIntroText = blocks.featureIntro?.text;
  const masterMomentTitle = blocks.masterMoment?.title;
  const banners = buildBanners(product, copy.name);
  const sectionGroups = buildSectionGroups(product, blocks);
  const experienceSection = buildExperienceSection(product, blocks);
  const comparisonSections = buildComparisonSections(product, blocks);
  const specDetails: string[] = resolveSpecs(product.specs, lang);
  // CAC feature cards reuse section photos (no dedicated logos), so the badge
  // grid is redundant for them — skip it.
  const featureCards = categorySlug === 'cac' ? [] : (product.featureCards ?? []);
  // Link each feature card to the content section it best describes, so clicking
  // a card smooth-scrolls there.
  const featureCardLinks = buildFeatureCardSectionLinks(
    featureCards,
    sectionGroups.flatMap((group) => group.sections),
  );
  const availableSizes = getAvailableSizes(product);
  const seriesDisplay = getSeriesDisplay(product);
  // Printed catalog spread for this series (null when this print run has none).
  const catalogUrl = getProductCatalogUrl({
    categorySlug,
    series: product.series,
    productId: product.id,
  });
  const categoryCopy = await getCategoryCopy(categorySlug);
  const breadcrumbItems = buildBreadcrumbItems(
    locale,
    categoryCopy.label,
    copy.name || product.id,
    productId,
    categorySlug,
  );
  const comparisonLabels = { before: 'Before', after: 'After' };
  const productPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.name,
    description: copy.tagline,
    url: `${SITE_URL}/${resolvedLocale}/products/${categorySlug}/${productId}`,
    inLanguage: getLocaleLanguage(resolvedLocale),
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(toSrc(product.posterImageUrl ?? product.imageUrl)),
    },
    about: {
      '@type': 'Thing',
      name: copy.name,
      description: copy.tagline,
      identifier: product.sku ?? product.id,
      url: `${SITE_URL}/${resolvedLocale}/products/${categorySlug}/${productId}`,
      additionalType: categoryCopy.label,
    },
  };
  const productJsonLd = buildProductJsonLd({
    locale: resolvedLocale,
    name: copy.name,
    description: copy.tagline,
    url: `${SITE_URL}/${resolvedLocale}/products/${categorySlug}/${productId}`,
    image: toSrc(product.posterImageUrl ?? product.imageUrl),
    sku: product.sku ?? product.id,
    mpn: product.id,
    category: categoryCopy.label,
    additionalImages: Array.isArray(product.gallery) ? product.gallery.map(toSrc) : [],
  });

  // Self-hosted hero clip → VideoObject so the loop is eligible for Google video
  // rich results (a third-party hotlink can't be claimed as first-party content).
  const heroVideoUrl = product.heroVideoUrl ?? undefined;
  const videoJsonLd = heroVideoUrl
    ? buildVideoObjectJsonLd({
        name: lang === 'fa' ? `ویدیو معرفی ${copy.name}` : `${copy.name} overview video`,
        description: copy.tagline || copy.name,
        contentUrl: heroVideoUrl,
        thumbnailUrl: toSrc(product.posterImageUrl ?? product.imageUrl),
      })
    : null;

  return (
    <div
      className="pb-12 space-y-10 sm:space-y-12 lg:space-y-20 lg:pb-24"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    >
      <JsonLd data={productPageSchema} />
      {productJsonLd && <JsonLd data={productJsonLd} />}
      {videoJsonLd && <JsonLd data={videoJsonLd} />}
      <BannerSection
        banner={banners[0]}
        breadcrumbItems={breadcrumbItems}
        lang={lang}
        seriesDisplay={seriesDisplay}
        availableSizes={availableSizes}
        copyName={copy.name}
      />

      <MobileHeader
        breadcrumbItems={breadcrumbItems}
        lang={lang}
        seriesDisplay={seriesDisplay}
        copyName={copy.name}
        availableSizes={availableSizes}
      />

      {specDetails.length > 0 && <SpecsJumpButton targetId="product-specs" lang={lang} />}

      <FeatureIntro title={featureIntroTitle} text={featureIntroText} />

      <HeroMedia
        image={product.imageUrl}
        posterImage={product.posterImageUrl ?? undefined}
        heroVideo={heroVideoUrl}
        alt={copy.name}
      />

      {masterMomentTitle && (
        <div className="w-full mx-auto max-w-360">
          <div className="text-center ">
            <p
              className="text-xl font-black text-transparent sm:text-2xl md:text-4xl bg-clip-text"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              {masterMomentTitle}
            </p>
          </div>
        </div>
      )}

      <FeatureCardsGrid featureCards={featureCards} linkTargets={featureCardLinks} />

      <SectionGroupsRenderer
        sectionGroups={sectionGroups}
        lang={lang}
        sectionIdPrefix="feature-section"
      />

      <ComparisonSections
        sections={comparisonSections}
        comparisonLabels={comparisonLabels}
        lang={lang}
      />

      {experienceSection && (
        <ContentSections sections={[experienceSection]} isRTL={lang === 'fa'} isImageLeft={true} />
      )}

      <SpecsSection items={specDetails} lang={lang} id="product-specs" />

      {catalogUrl && (
        <ProductCatalogSection
          src={catalogUrl}
          productId={product.id}
          productName={copy.name || product.id}
          lang={lang}
        />
      )}

      <ProductFaqSection
        faqs={buildProductFaqs({
          locale: resolvedLocale,
          category: categorySlug,
          productName: copy.name,
          tvSizes: categorySlug === 'tvs' ? availableSizes : [],
          tvOs: categorySlug === 'tvs' ? product.os : '',
        })}
        heading={getProductFaqHeading(resolvedLocale, copy.name)}
        locale={resolvedLocale}
      />
    </div>
  );
}
