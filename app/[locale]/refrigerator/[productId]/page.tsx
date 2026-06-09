import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ContentSectionData } from '@/components/tv/ContentSections';
import FeatureIntro from '@/components/tv/product-detail/FeatureIntro';
import FeatureCardsGrid from '@/components/tv/product-detail/FeatureCardsGrid';
import SectionGroupsRenderer, {
  type NormalizedSectionGroup,
} from '@/components/tv/product-detail/SectionGroupsRenderer';
import SpecsSection from '@/components/tv/product-detail/SpecsSection';
import JsonLd from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/components/tv/product-detail/Breadcrumbs';
import type {
  CopyBlock,
  CopyBlockKey,
  ImageSource,
  TvProduct,
  TvSectionConfig,
  TvSectionGroup,
} from '@/types/tv';
import RefrigeratorHero from '@/components/refrigerator/RefrigeratorHero';
import { REF_PRODUCTS } from '@/content/RefProducts';
import { routing, type Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { buildProductJsonLd } from '@/lib/seo/productSchema';
import { buildProductMetaDescription, buildProductMetaTitle } from '@/lib/seo/productMeta';
import { buildProductFaqs, getProductFaqHeading } from '@/lib/seo/productFaq';
import ProductFaqSection from '@/components/seo/ProductFaqSection';

// Builds the refrigerator detail page from bundled content.

type PageParams = {
  locale?: string;
  productId?: string;
};

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

const COPY_BLOCK_KEYS: CopyBlockKey[] = [
  'featureIntro',
  'masterMoment',
  'premiumFlatDoor',
  'myFreshChoice',
  'tripleZone',
  'bigCapacity',
  'metalGlideDrawers',
  'metalCooling',
  'adjustableShelves',
  'waterDispenser',
  'inverterTechnology',
  'preciseTempControl',
  'metalRecessedHandle',
  'bigDoorBalcony',
  'biggerDrawers',
  'superCool',
  'doorAlarm',
  'iceWaterDispenser',
  'independentZones',
  'selfClosingSystem',
  'multiAirFlow',
  'digitalSensors',
  'sleekWaterDispenser',
  'durableInverter',
  'totalNoFrost',
  'largeCrisperPlus',
  'premiumDesign',
  'counterDepth',
  'freshZone',
  'removableTwistIceMaker',
  'electronicTouchControl',
  'softLedLighting',
  'superFreeze',
  'microVentsTechnology',
  'moistureFreshCrisper',
  'temperedGlassShelves',
  'freshBox',
  'preciseElectronicControl',
  'reversibleDoor',
  'lowNoise',
  'easyToUseDrawer',
  'easyOpenDrawer',
  'easyOpenDoorHandle',
  'freshCrisper',
  'fullWidthAirflow',
  'ledLighting',
  'pureAppearance',
  'adjustableLegs',
  'ledDisplay',
  'premiumAppearance',
  'keepFor135H',
  'cooling360',
  'ultrathinHinges',
  'slidingBasket',
  'lessIsMore',
  'premiumBoundlessDoor',
  'hoveringDoor',
  'mechanicalTemperatureControl',
];

const COPY_BLOCK_KEYS_SET = new Set(COPY_BLOCK_KEYS);

// Refrigerator detail pages are built entirely from bundled content, so
// statically generate them for every locale instead of rendering dynamically.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    REF_PRODUCTS.map((product) => ({ locale, productId: product.id.toLowerCase() })),
  );
}

const resolveLocale = (locale?: string): 'fa' | 'en' => (locale === 'fa' ? 'fa' : 'en');

type RefProduct = TvProduct;

type CopyBlocksInput = RefProduct['copy']['en']['blocks'];

type Blocks = Partial<Record<CopyBlockKey, CopyBlock>>;

type AvailableColors = Partial<Record<'fa' | 'en', string[]>>;

const toStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const filtered = value.filter((item): item is string => typeof item === 'string');
  return filtered.length > 0 ? filtered : undefined;
};

const normalizeAvailableColors = (value: unknown): AvailableColors | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const fa = toStringArray(record.fa);
  const en = toStringArray(record.en);
  if (!fa && !en) return undefined;
  return { ...(fa ? { fa } : {}), ...(en ? { en } : {}) };
};

const isImageSource = (value: unknown): value is ImageSource =>
  typeof value === 'string' ||
  (typeof value === 'object' && value !== null && 'src' in value && value.src != null);

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

const buildDefaultSectionGroups = (product: RefProduct): TvSectionGroup[] => {
  const defaults: TvSectionGroup[] = [];

  if (product.contentSections) {
    defaults.push({
      kind: 'content',
      sections: product.contentSections.map((section) => ({
        ...section,
        copyKey: section.copyKey,
      })),
    });
  }
  if (product.stackedSections) {
    defaults.push({
      kind: 'stacked',
      sections: product.stackedSections.map((section) => ({
        ...section,
        copyKey: section.copyKey,
      })),
    });
  }
  if (product.bottomStackedSections) {
    defaults.push({
      kind: 'stacked',
      textFirst: true,
      sections: product.bottomStackedSections.map((section) => ({
        ...section,
        copyKey: section.copyKey,
      })),
    });
  }

  return defaults;
};

const buildSectionGroups = (product: RefProduct, blocks: Blocks): NormalizedSectionGroup[] => {
  const defaultSectionGroups = buildDefaultSectionGroups(product);
  const sectionGroupConfigs: TvSectionGroup[] = Array.isArray(product.sectionGroups)
    ? (product.sectionGroups ?? [])
        .filter(
          (group): group is NonNullable<(typeof REF_PRODUCTS)[number]['sectionGroups']>[number] =>
            Boolean(group) && Array.isArray(group.sections) && typeof group.kind === 'string',
        )
        .map((group) => ({
          ...group,
          sections: group.sections.map((section) => ({
            ...section,
            copyKey: section.copyKey,
          })),
        }))
        .map((group) => group)
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

const resolveSpecs = (
  specs: Record<'en' | 'fa', string[]> | undefined,
  lang: 'fa' | 'en',
): string[] => {
  if (!specs) return [];
  if (lang === 'fa' && Array.isArray(specs.fa)) return specs.fa;
  if (Array.isArray(specs.en)) return specs.en;
  return [];
};

const getSeriesDisplay = (product: RefProduct) => product.seriesLabel ?? product.series;

const buildBreadcrumbItems = (
  locale: string,
  categoryLabel: string,
  productLabel: string,
  productId: string,
): BreadcrumbItem[] => [
  ...createBreadcrumbItems(
    locale === 'fa' ? 'fa' : 'en',
    { label: productLabel, href: `/${locale}/refrigerator/${productId}` },
    [{ label: categoryLabel, href: `/${locale}/refrigerator` }],
  ),
];

const findProduct = (productId: string): RefProduct | null => {
  const normalized = productId.toLowerCase();
  return (
    REF_PRODUCTS.find(
      (product) =>
        product.id.toLowerCase() === normalized || product.sku.toLowerCase() === normalized,
    ) ?? null
  );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const localeParam = resolved?.locale ?? 'en';
  const productId = resolved?.productId ?? '';
  if (!productId) return {};

  const product = findProduct(productId);
  if (!product) return {};

  const lang = resolveLocale(localeParam);
  const copy = product.copy[lang];
  const imageUrl =
    typeof product.posterImage === 'string'
      ? product.posterImage
      : (product.posterImage?.src ??
        (typeof product.image === 'string' ? product.image : product.image.src));
  const languageAlternates = getLanguageAlternates(`/refrigerator/${productId}`);

  const metaDescription = buildProductMetaDescription(lang, copy.name);
  return {
    title: buildProductMetaTitle(lang, copy.name),
    description: metaDescription,
    keywords: [product.id, product.series, 'Hisense', 'Refrigerator'],
    openGraph: {
      title: copy.name,
      description: metaDescription,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      url: `/${localeParam}/refrigerator/${productId}`,
      type: 'website',
    },
    alternates: {
      canonical: `/${localeParam}/refrigerator/${productId}`,
      languages: languageAlternates,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.name,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function RefrigeratorProductPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolved?.locale ?? 'en';
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  setRequestLocale(resolvedLocale);
  const productId = resolved?.productId ?? '';
  const lang = resolveLocale(locale);

  if (!productId) {
    notFound();
  }

  const product = findProduct(productId);

  if (!product) {
    notFound();
  }

  const routeTranslations = await getTranslations('Routes.refrigerator');
  const copy = product.copy[lang];
  const blocks = filterBlocks(copy.blocks);
  const featureIntroTitle = blocks.featureIntro?.title;
  const featureIntroText = blocks.featureIntro?.text;
  const masterMomentTitle = blocks.masterMoment?.title;
  const sectionGroups = buildSectionGroups(product, blocks);
  const specDetails: string[] = resolveSpecs(product.specs, lang);
  const seriesDisplay = getSeriesDisplay(product);
  const featureCards = product.featureCards ?? [];
  const compactFeatureTitles = new Set<string>();
  const productMeta = product as unknown as { availableColors?: unknown; topBanner?: unknown };
  const normalizedColors = normalizeAvailableColors(productMeta.availableColors);
  const availableColors =
    lang === 'fa' ? (normalizedColors?.fa ?? []) : (normalizedColors?.en ?? []);
  const topBanner = isImageSource(productMeta.topBanner) ? productMeta.topBanner : undefined;
  const breadcrumbItems = buildBreadcrumbItems(
    locale,
    routeTranslations('title'),
    copy.name || product.id,
    productId,
  );
  const schemaImage =
    typeof product.posterImage === 'string'
      ? product.posterImage
      : (product.posterImage?.src ??
        (typeof product.image === 'string' ? product.image : product.image.src));
  const productPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.name,
    description: copy.tagline,
    url: `${SITE_URL}/${resolvedLocale}/refrigerator/${productId}`,
    inLanguage: getLocaleLanguage(resolvedLocale),
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(schemaImage),
    },
    about: {
      '@type': 'Thing',
      name: copy.name,
      description: copy.tagline,
      identifier: product.sku ?? product.id,
      url: `${SITE_URL}/${resolvedLocale}/refrigerator/${productId}`,
      additionalType: routeTranslations('title'),
    },
  };
  const productJsonLd = buildProductJsonLd({
    locale: resolvedLocale,
    name: copy.name,
    description: copy.tagline,
    url: `${SITE_URL}/${resolvedLocale}/refrigerator/${productId}`,
    image: typeof schemaImage === 'string' ? schemaImage : '',
    sku: product.sku ?? product.id,
    mpn: product.id,
    category: routeTranslations('title'),
  });

  return (
    <div
      className="pb-12 space-y-10 sm:space-y-12 lg:space-y-20 lg:pb-24"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    >
      <JsonLd data={productPageSchema} />
      <JsonLd data={productJsonLd} />
      <RefrigeratorHero
        locale={locale}
        lang={lang}
        breadcrumbItems={breadcrumbItems}
        productName={copy.name || product.id}
        seriesDisplay={seriesDisplay}
        tagline={copy.tagline}
        availableColors={availableColors}
        gallery={
          Array.isArray(product.gallery) && product.gallery.length > 0
            ? product.gallery
            : [product.image]
        }
      />

      <FeatureIntro title={featureIntroTitle} text={featureIntroText} />

      {topBanner && (
        <div className="w-full mx-auto max-w-360">
          <div className="relative w-full overflow-hidden rounded-3xl shadow-(--panel-shadow)">
            <div className="relative w-full aspect-2/1">
              <Image
                src={topBanner}
                alt={copy.name}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <FeatureCardsGrid featureCards={featureCards} compactFeatureTitles={compactFeatureTitles} />

      {masterMomentTitle && (
        <div className="w-full mx-auto max-w-360">
          <div className="text-center">
            <p
              className="text-xl font-black text-transparent sm:text-2xl md:text-4xl bg-clip-text"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              {masterMomentTitle}
            </p>
          </div>
        </div>
      )}

      <SectionGroupsRenderer sectionGroups={sectionGroups} lang={lang} overlayTone="dark" />

      <SpecsSection items={specDetails} lang={lang} />

      <ProductFaqSection
        faqs={buildProductFaqs({
          locale: resolvedLocale,
          category: 'refrigerator',
          productName: copy.name || product.id,
        })}
        heading={getProductFaqHeading(resolvedLocale, copy.name || product.id)}
        locale={resolvedLocale}
      />
    </div>
  );
}
