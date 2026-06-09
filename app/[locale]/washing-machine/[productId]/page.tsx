import { notFound, permanentRedirect } from 'next/navigation';

type PageParams = {
  locale?: string;
  productId?: string;
};

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export default async function WashingMachineProductRedirect({ params }: PageProps) {
  const resolved = await params;
  const locale = resolved?.locale ?? 'en';
  const productId = resolved?.productId ?? '';
  if (!productId) {
    notFound();
  }
  permanentRedirect(`/${locale}/products/wms/${productId}`);
}
