import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/assets/styles/globals.css';

// Global metadata/styles are shared; locale and admin layouts render Document
// with an explicit language so public routes do not need request headers.

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

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
