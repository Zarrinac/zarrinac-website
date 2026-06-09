import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { useLocalContent } from '@/lib/contentSource';
import { FALLBACK_PRODUCTS, normalizeDbProducts } from '@/lib/api/products/normalizers';
import type { ApiProduct } from '@/lib/api/products/types';
import { mapProductMedia } from '@/lib/api/products/mediaPaths';
import { categoryFromSlug, type ProductCategory } from '@/lib/api/products/categories';

// Returns the product catalog; prefers the database but falls back to bundled static content.

const DEFAULT_HEADERS = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
};

type DataSource = 'database' | 'fallback';

const loadProducts = async (
  category?: ProductCategory,
): Promise<{ products: ApiProduct[]; source: DataSource }> => {
  if (!useLocalContent && prisma) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { series: 'asc' },
        where: category ? { category } : undefined,
        include: { copies: true, tvSpec: true },
      });
      if (products.length > 0) {
        return { products: normalizeDbProducts(products), source: 'database' };
      }
    } catch (error) {
      console.error('[api/products] database fetch failed', error);
    }
  }

  const fallback = category
    ? FALLBACK_PRODUCTS.filter((product) => product.category === category)
    : FALLBACK_PRODUCTS;
  return { products: fallback, source: 'fallback' };
};

export async function GET(request: NextRequest) {
  const category = categoryFromSlug(new URL(request.url).searchParams.get('category'));
  const { products, source } = await loadProducts(category);

  return NextResponse.json(products.map(mapProductMedia), {
    status: 200,
    headers: {
      ...DEFAULT_HEADERS,
      'X-Data-Source': source,
    },
  });
}
