import { NextResponse } from 'next/server';
import { createAdminSession, getAdminSessionSecret, setAdminSessionCookie } from '@/lib/admin/auth';
import { authenticateAdmin } from '@/lib/admin/credentials';
import {
  clearLoginFailures,
  getClientIp,
  isLoginRateLimited,
  recordLoginFailure,
} from '@/lib/admin/rateLimit';
import { createAdminRedirectUrl } from '@/lib/admin/url';

function normalizeNextPath(value: FormDataEntryValue | null) {
  const nextPath = typeof value === 'string' ? value : '';

  if (!nextPath || !nextPath.startsWith('/admin') || nextPath.startsWith('/admin/login')) {
    return '/admin';
  }

  return nextPath;
}

function loginRedirect(
  request: Request,
  error: 'invalid' | 'config' | 'rate-limited',
  nextPath: string,
) {
  const url = createAdminRedirectUrl('/admin/login', request);
  url.searchParams.set('error', error);
  url.searchParams.set('next', nextPath);

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  const nextPath = normalizeNextPath(formData.get('next'));

  if (isLoginRateLimited(ip)) {
    return loginRedirect(request, 'rate-limited', nextPath);
  }

  if (!getAdminSessionSecret()) {
    return loginRedirect(request, 'config', nextPath);
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    recordLoginFailure(ip);
    return loginRedirect(request, 'invalid', nextPath);
  }

  const user = await authenticateAdmin(username, password);

  if (!user) {
    recordLoginFailure(ip);
    return loginRedirect(request, 'invalid', nextPath);
  }

  clearLoginFailures(ip);

  const token = await createAdminSession(user);

  if (!token) {
    return loginRedirect(request, 'config', nextPath);
  }

  const response = NextResponse.redirect(createAdminRedirectUrl(nextPath, request), {
    status: 303,
  });
  setAdminSessionCookie(response, token);

  return response;
}
