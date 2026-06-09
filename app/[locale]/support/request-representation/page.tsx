import { permanentRedirect } from 'next/navigation';
import type { Locale } from '@/i18n/routing';

type LegacyRequestRepresentationPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LegacyRequestRepresentationPage({
  params,
}: LegacyRequestRepresentationPageProps) {
  const { locale } = await params;

  permanentRedirect(`/${locale}/request-representation`);
}
