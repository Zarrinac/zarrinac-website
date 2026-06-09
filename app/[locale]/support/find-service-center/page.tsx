import { permanentRedirect } from 'next/navigation';
import type { Locale } from '@/i18n/routing';

type LegacyFindServiceCenterPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LegacyFindServiceCenterPage({
  params,
}: LegacyFindServiceCenterPageProps) {
  const { locale } = await params;

  permanentRedirect(`/${locale}/find-service-center`);
}
