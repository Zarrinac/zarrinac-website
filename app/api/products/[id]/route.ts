import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { findFallbackProduct, normalizeDbProduct } from '@/lib/api/products/normalizers';
import { mapProductMedia } from '@/lib/api/products/mediaPaths';
import { categoryFromSlug, type ProductCategory } from '@/lib/api/products/categories';

type DataSource = 'database' | 'fallback';

const DEFAULT_HEADERS = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
};

const loadProduct = async (idOrSlug: string, category?: ProductCategory) => {
  // DB-first: use the database whenever it is configured; content is the fallback.
  if (prisma) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          ...(category ? { category } : {}),
        },
        include: { copies: true, tvSpec: true },
      });

      if (product) {
        return { product: normalizeDbProduct(product), source: 'database' as DataSource };
      }
    } catch (error) {
      console.error('[api/products/:id] database fetch failed', error);
    }
  }

  const fallback = findFallbackProduct(idOrSlug, category);
  if (fallback) {
    return { product: fallback, source: 'fallback' as DataSource };
  }

  return { product: null, source: 'fallback' as DataSource };
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const idOrSlug = resolved.id;
  const category = categoryFromSlug(new URL(request.url).searchParams.get('category'));
  const { product, source } = await loadProduct(idOrSlug, category);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(mapProductMedia(product), {
    status: 200,
    headers: {
      ...DEFAULT_HEADERS,
      'X-Data-Source': source,
    },
  });
}
