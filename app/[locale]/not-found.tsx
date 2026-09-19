import { getLocale } from 'next-intl/server';
import NotFoundContent from '@/components/NotFoundContent';
import type { Locale } from '@/i18n/routing';

export default async function NotFoundPage() {
  const locale = (await getLocale()) as Locale;
  return <NotFoundContent locale={locale} />;
}
