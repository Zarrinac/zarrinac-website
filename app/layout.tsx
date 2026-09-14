import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import '@/assets/styles/globals.css';
import Analytics from '@/components/seo/Analytics';
import GtmNoScript from '@/components/seo/GtmNoScript';

// Root layout sets the html lang/dir attributes based on resolved locale and applies global styles.

// Google only picks up a favicon that is declared with a <link rel="icon"> in the
// home page <head>; files sitting in public/ are served but never declared, which is
// why Search Console showed the generic globe instead of the brand mark. Declaring it
// here (root layout) propagates to every route, admin included.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = (await getLocale()) ?? 'fa';
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning data-theme="light">
      <body className="bg-(--background-color) text-(--default-black-font) transition-colors duration-300">
        <Analytics />
        <GtmNoScript />
        {children}
      </body>
    </html>
  );
}
