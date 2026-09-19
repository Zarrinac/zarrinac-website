import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import {
  getMessages,
  getTranslations as getServerTranslations,
  setRequestLocale,
} from 'next-intl/server';
import Header from '@/components/Header';
import Document from '@/components/Document';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import StructuredData from '@/components/seo/StructuredData';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { routing, type Locale } from '@/i18n/routing';
import { getSeoKeywords } from '@/lib/seo/keywords';
import { SITE_URL, toAbsoluteUrl } from '@/lib/seo/site';
import { mediaUrl } from '@/lib/mediaUrl';

// Locale layout validates the locale, wires translations/theme, and applies shared page chrome.

// Build the share image through mediaUrl so it picks up NEXT_PUBLIC_MEDIA_BASE_URL;
// hardcoding `${SITE_URL}/banner/...` drops the /media prefix and 404s.
const OG_IMAGE_URL = toAbsoluteUrl(mediaUrl('/banner/Fix-Banner-07.webp'));
const OG_LOCALE_MAP: Record<Locale, string> = {
  fa: 'fa_IR',
  en: 'en_US',
};

type LocaleLayoutParams = {
  locale: string;
};

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<LocaleLayoutParams>;
};

function ensureLocale(locale: string): Locale {
  const match = routing.locales.find((value): value is Locale => value === locale);
  if (!match) {
    notFound();
  }
  return match;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LocaleLayoutProps, 'children'>,
): Promise<Metadata> {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const typedLocale = ensureLocale(locale);
  const t = await getServerTranslations({
    locale: typedLocale,
    namespace: 'Metadata',
  });
  const keywords = t.raw('keywords') as string[] | undefined;
  const keywordSeed = Array.isArray(keywords) ? keywords : [];
  const seoKeywords = getSeoKeywords(typedLocale, 12);
  const combinedKeywords = Array.from(new Set([...keywordSeed, ...seoKeywords])).slice(0, 20);
  const metadataBase = new URL(SITE_URL);
  const localizedPath = `/${typedLocale}`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;
  const languageAlternates = routing.locales.reduce<Record<string, string>>((acc, lang) => {
    acc[lang] = `${SITE_URL}/${lang}`;
    return acc;
  }, {});
  languageAlternates['x-default'] = `${SITE_URL}/${routing.defaultLocale}`;
  const openGraphLocale = OG_LOCALE_MAP[typedLocale];
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const verificationOther = {
    ...(bingVerification ? { 'msvalidate.01': bingVerification } : {}),
  };

  return {
    metadataBase,
    title: t('title'),
    description: t('description'),
    keywords: combinedKeywords.length > 0 ? combinedKeywords : undefined,
    applicationName: 'Hisense Iran',
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification:
      googleVerification || Object.keys(verificationOther).length > 0
        ? {
            google: googleVerification,
            other: verificationOther,
          }
        : undefined,
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
      siteName: 'Zarrin Namaye caspian | Hisense Iran',
      locale: openGraphLocale,
      type: 'website',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1920,
          height: 650,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [OG_IMAGE_URL],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const typedLocale = ensureLocale(locale);

  setRequestLocale(typedLocale);

  const messages = await getMessages();
  const pageContainerClass = 'mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-10';

  return (
    <Document locale={typedLocale}>
      <ThemeProvider>
        <StructuredData locale={typedLocale} />
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <Header />
          <div className={pageContainerClass}>
            <main>{children}</main>
            <Footer />
          </div>
          <ScrollToTopButton />
        </NextIntlClientProvider>
      </ThemeProvider>
    </Document>
  );
}
