import { prisma } from '@/lib/db';
import { PRODUCT_CATEGORY, type ProductCategory } from './categories';
import { mapProductMedia } from './mediaPaths';
import { FALLBACK_PRODUCTS, normalizeDbProduct } from './normalizers';
import type { ApiProduct } from './types';

type DataSource = 'database' | 'fallback';

// Server pages and API routes share the same catalog. Reading directly avoids
// self-HTTP requests during builds (when no Next server is listening) and ISR.
export async function loadProducts(
  category?: ProductCategory,
): Promise<{ products: ApiProduct[]; source: DataSource }> {
  if (prisma) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { position: 'asc' },
        where: { category: category ?? { in: Object.values(PRODUCT_CATEGORY) } },
        include: { copies: true, tvSpec: true },
      });
      if (products.length > 0) {
        return {
          products: products.map((product) =>
            mapProductMedia({
              ...normalizeDbProduct(product),
              updatedAt: product.updatedAt.toISOString(),
            }),
          ),
          source: 'database',
        };
      }
    } catch (error) {
      console.error('[products] database fetch failed', error);
    }
  }

  const products = category
    ? FALLBACK_PRODUCTS.filter((product) => product.category === category)
    : FALLBACK_PRODUCTS;
  return {
    products: products.map((product) => mapProductMedia({ ...product })),
    source: 'fallback',
  };
}

export async function loadProduct(
  idOrSlug: string,
  category?: ProductCategory,
): Promise<{ product: ApiProduct | null; source: DataSource }> {
  // Resolve details from the same effective catalog as listings and sitemap.
  // A successful DB catalog must not resurrect a removed bundled model.
  const { products, source } = await loadProducts(category);
  const key = idOrSlug.toLowerCase();
  const product = products.find(
    (entry) => entry.id.toLowerCase() === key || entry.slug?.toLowerCase() === key,
  );
  return { product: product ?? null, source };
}
