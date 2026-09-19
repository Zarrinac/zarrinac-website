import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from './routing';

export type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

// Seed next-intl from route params in both metadata and page rendering. Reading
// the locale from request headers instead opts otherwise static routes out of ISR.
export async function resolvePageLocale(
  params: { locale?: string } | Promise<{ locale?: string }>,
): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
