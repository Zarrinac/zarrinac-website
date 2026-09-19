import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';
import Analytics from '@/components/seo/Analytics';
import GtmNoScript from '@/components/seo/GtmNoScript';

// Resolve the language at the route boundary, where it is available without
// reading request headers and opting every public page out of static rendering.
export default function Document({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      data-theme="light"
    >
      <body className="bg-(--background-color) text-(--default-black-font) transition-colors duration-300">
        <Analytics />
        <GtmNoScript />
        {children}
      </body>
    </html>
  );
}
