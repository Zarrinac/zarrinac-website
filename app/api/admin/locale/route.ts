import { NextResponse } from 'next/server';
import { ADMIN_LOCALE_COOKIE, resolveAdminLocale } from '@/lib/admin/i18n';
import { createAdminRedirectUrl } from '@/lib/admin/url';

function normalizeNextPath(value: FormDataEntryValue | null) {
  const nextPath = typeof value === 'string' ? value : '';

  if (!nextPath.startsWith('/admin')) {
    return '/admin';
  }

  return nextPath;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const localeValue = formData.get('locale');
  const locale = resolveAdminLocale(typeof localeValue === 'string' ? localeValue : null);
  const nextPath = normalizeNextPath(formData.get('next'));
  const response = NextResponse.redirect(createAdminRedirectUrl(nextPath, request), {
    status: 303,
  });

  response.cookies.set({
    name: ADMIN_LOCALE_COOKIE,
    value: locale,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
