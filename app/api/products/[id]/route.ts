import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loadProduct } from '@/lib/api/products/source';
import { categoryFromSlug } from '@/lib/api/products/categories';

const DEFAULT_HEADERS = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const idOrSlug = resolved.id;
  const category = categoryFromSlug(new URL(request.url).searchParams.get('category'));
  const { product, source } = await loadProduct(idOrSlug, category);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(product, {
    status: 200,
    headers: {
      ...DEFAULT_HEADERS,
      'X-Data-Source': source,
    },
  });
}
