'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import type { AdminLocale, getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminDirection, getAdminFontFamily } from '@/lib/admin/i18n';

type AdminShellProps = {
  children: ReactNode;
  locale: AdminLocale;
  dictionary: ReturnType<typeof getAdminDictionary>;
  unread: { complaints: number; surveys: number };
};

const navItems = [
  {
    href: '/admin',
    labelKey: 'dashboard',
    icon: DashboardOutlinedIcon,
  },
  {
    href: '/admin/products',
    labelKey: 'products',
    icon: Inventory2OutlinedIcon,
  },
  {
    href: '/admin/complaints',
    labelKey: 'complaints',
    icon: RateReviewOutlinedIcon,
  },
  {
    href: '/admin/surveys',
    labelKey: 'surveys',
    icon: FactCheckOutlinedIcon,
  },
  {
    href: '/admin/service-centers',
    labelKey: 'serviceCenters',
    icon: StorefrontOutlinedIcon,
  },
  {
    href: '/admin/settings',
    labelKey: 'settings',
    icon: SettingsOutlinedIcon,
  },
] as const;

export default function AdminShell({ children, locale, dictionary, unread }: AdminShellProps) {
  const pathname = usePathname();
  const unreadFor = (labelKey: string) =>
    labelKey === 'complaints' ? unread.complaints : labelKey === 'surveys' ? unread.surveys : 0;
  const direction = getAdminDirection(locale);
  const inactiveLocale = locale === 'fa' ? 'en' : 'fa';

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div
      dir={direction}
      className="admin-root min-h-screen bg-[#f3f6f8] text-[#172026]"
      style={{ fontFamily: getAdminFontFamily(locale) }}
    >
      <div className="grid min-h-screen lg:grid-cols-[17.5rem_1fr]">
        <aside className="admin-no-print border-b border-[#dbe3e8] bg-white px-4 py-4 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/admin" className="block">
              <span className="block text-sm font-semibold tracking-[0.18em] text-[#00a8a3]">
                {dictionary.common.brand}
              </span>
              <span className="mt-1 block text-xl font-semibold text-[#172026]">
                {dictionary.common.admin}
              </span>
            </Link>

            <Link
              href="/fa"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d4dde3] bg-white px-3 text-sm font-medium text-[#41515c] transition hover:border-[#00a8a3] hover:text-[#008f8a]"
            >
              <OpenInNewOutlinedIcon fontSize="small" />
              {dictionary.common.site}
            </Link>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const badgeCount = unreadFor(item.labelKey);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex h-11 min-w-max items-center gap-3 rounded-md px-3 text-sm font-medium transition lg:w-full',
                    isActive
                      ? 'bg-[#e5fbf8] text-[#007f7b]'
                      : 'text-[#52636f] hover:bg-[#f1f5f7] hover:text-[#172026]',
                  ].join(' ')}
                >
                  <Icon fontSize="small" />
                  {dictionary.shell.nav[item.labelKey]}
                  {badgeCount > 0 ? (
                    <span
                      aria-label={`${badgeCount}`}
                      className="ms-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e5484d] px-1.5 text-xs font-bold text-white"
                    >
                      {badgeCount.toLocaleString(locale)}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="admin-no-print border-b border-[#dbe3e8] bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#667782]">
                  {dictionary.shell.pathLabel}
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#172026]">
                  {dictionary.common.adminPanel}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form action="/api/admin/locale" method="post">
                  <input type="hidden" name="next" value={pathname} />
                  <button
                    type="submit"
                    name="locale"
                    value={inactiveLocale}
                    className="inline-flex h-10 items-center rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 text-sm font-medium text-[#52636f] transition hover:border-[#00a8a3] hover:text-[#008f8a]"
                  >
                    {inactiveLocale === 'fa' ? 'فارسی' : 'English'}
                  </button>
                </form>
                <form action="/api/admin/auth/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 text-sm font-medium text-[#52636f] transition hover:border-[#00a8a3] hover:text-[#008f8a]"
                  >
                    <LogoutOutlinedIcon fontSize="small" />
                    {dictionary.common.logout}
                  </button>
                </form>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-368 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
