export const PRODUCT_CATEGORY = {
  tvs: 'TVS',
  wms: 'WMS',
  rac: 'RAC',
  cac: 'CAC',
  refrigerator: 'REFRIGERATOR',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
export type ProductCategorySlug = keyof typeof PRODUCT_CATEGORY;

export const categoryFromSlug = (slug?: string | null): ProductCategory | undefined => {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase();
  const bySlug = PRODUCT_CATEGORY[normalized as ProductCategorySlug];
  if (bySlug) return bySlug;
  return Object.values(PRODUCT_CATEGORY).find((value) => value.toLowerCase() === normalized);
};

export const categoryToSlug = (
  category?: ProductCategory | null,
): ProductCategorySlug | undefined => {
  if (!category) return undefined;
  const entry = Object.entries(PRODUCT_CATEGORY).find(([, value]) => value === category);
  return entry?.[0] as ProductCategorySlug | undefined;
};
