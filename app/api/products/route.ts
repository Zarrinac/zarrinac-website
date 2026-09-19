import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loadProducts } from '@/lib/api/products/source';
import { categoryFromSlug } from '@/lib/api/products/categories';

const DEFAULT_HEADERS = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
};

export async function GET(request: NextRequest) {
  const category = categoryFromSlug(new URL(request.url).searchParams.get('category'));
  const { products, source } = await loadProducts(category);

  return NextResponse.json(products, {
    status: 200,
    headers: {
      ...DEFAULT_HEADERS,
      'X-Data-Source': source,
    },
  });
}
