import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/admin/auth';
import { createAdminRedirectUrl } from '@/lib/admin/url';

export function POST(request: Request) {
  const response = NextResponse.redirect(createAdminRedirectUrl('/admin/login', request), {
    status: 303,
  });
  clearAdminSessionCookie(response);

  return response;
}
