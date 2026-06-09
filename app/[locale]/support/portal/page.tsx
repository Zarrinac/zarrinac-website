import { permanentRedirect } from 'next/navigation';
import type { Locale } from '@/i18n/routing';

type LegacyPortalPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LegacyPortalPage({ params }: LegacyPortalPageProps) {
  const { locale } = await params;

  permanentRedirect(`/${locale}/portal`);
}
