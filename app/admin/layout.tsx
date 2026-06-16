import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';
import { getAdminUnreadCounts } from '@/lib/admin/submissions';

export const metadata: Metadata = {
  title: 'Admin | Hisense Iran',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const unread = await getAdminUnreadCounts();

  return (
    <AdminShell locale={locale} dictionary={dictionary} unread={unread}>
      {children}
    </AdminShell>
  );
}
