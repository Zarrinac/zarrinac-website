import { permanentRedirect } from 'next/navigation';

type PageParams = {
  locale?: string;
};

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export default async function WashingMachineRedirectPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolved?.locale ?? 'en';
  permanentRedirect(`/${locale}/products/wms`);
}
