import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { getAdminDictionary, getAdminDirection, getAdminFontFamily } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';

export const metadata: Metadata = {
  title: 'Admin Login | Hisense Iran',
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

function normalizeNextPath(value: string | undefined) {
  if (!value || !value.startsWith('/admin') || value.startsWith('/admin/login')) {
    return '/admin';
  }

  return value;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const direction = getAdminDirection(locale);
  const inactiveLocale = locale === 'fa' ? 'en' : 'fa';
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeNextPath(resolvedSearchParams?.next);
  const localeSwitchNextPath = `/admin/login?next=${encodeURIComponent(nextPath)}`;

  if (session) {
    redirect(nextPath);
  }

  const hasInvalidCredentials = resolvedSearchParams?.error === 'invalid';
  const hasConfigError = resolvedSearchParams?.error === 'config';
  const isRateLimited = resolvedSearchParams?.error === 'rate-limited';

  return (
    <main
      dir={direction}
      className="flex min-h-screen items-center justify-center bg-[#f3f6f8] px-4 py-10 text-[#172026]"
      style={{ fontFamily: getAdminFontFamily(locale) }}
    >
      <section className="w-full max-w-md rounded-lg border border-[#dbe3e8] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,38,0.1)]">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-[#e5fbf8] text-[#008f8a]">
              <LockOutlinedIcon />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00a8a3]">
                {dictionary.common.brand}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-[#172026]">
                {dictionary.login.title}
              </h1>
            </div>
          </div>
          <form action="/api/admin/locale" method="post">
            <input type="hidden" name="next" value={localeSwitchNextPath} />
            <button
              type="submit"
              name="locale"
              value={inactiveLocale}
              className="h-10 rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 text-sm font-medium text-[#52636f] transition hover:border-[#00a8a3] hover:text-[#008f8a]"
            >
              {inactiveLocale === 'fa' ? 'فارسی' : 'English'}
            </button>
          </form>
        </div>

        {hasInvalidCredentials ? (
          <div className="mb-4 rounded-md border border-[#f2b8b5] bg-[#fff1f0] px-3 py-2 text-sm text-[#9f2d26]">
            {dictionary.login.invalidCredentials}
          </div>
        ) : null}

        {hasConfigError ? (
          <div className="mb-4 rounded-md border border-[#f0d7a1] bg-[#fff8e7] px-3 py-2 text-sm text-[#76520b]">
            {dictionary.login.configError}
          </div>
        ) : null}

        {isRateLimited ? (
          <div className="mb-4 rounded-md border border-[#f0d7a1] bg-[#fff8e7] px-3 py-2 text-sm text-[#76520b]">
            {dictionary.login.rateLimited}
          </div>
        ) : null}

        <form action="/api/admin/auth/login" method="post" className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#41515c]">
              {dictionary.common.username}
            </span>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="h-11 w-full rounded-md border border-[#cfd9df] bg-white px-3 text-sm text-[#172026] outline-none transition focus:border-[#00a8a3] focus:ring-2 focus:ring-[#c5f5f1]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#41515c]">
              {dictionary.common.password}
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 w-full rounded-md border border-[#cfd9df] bg-white px-3 text-sm text-[#172026] outline-none transition focus:border-[#00a8a3] focus:ring-2 focus:ring-[#c5f5f1]"
            />
          </label>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-md bg-[#00a8a3] px-4 text-sm font-semibold text-white transition hover:bg-[#008f8a]"
          >
            {dictionary.common.signIn}
          </button>
        </form>
      </section>
    </main>
  );
}
