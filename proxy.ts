import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSession } from './lib/admin/auth';
import { canAccessSection, sectionForPath } from './lib/admin/access';
import { createAdminRedirectUrl } from './lib/admin/url';

// Middleware keeps all non-asset routes locale-scoped for next-intl.
const intlMiddleware = createMiddleware(routing);

function isAdminRoute(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

function isAdminApiRoute(pathname: string) {
  return pathname === '/api/admin' || pathname.startsWith('/api/admin/');
}

function isPublicAdminRoute(pathname: string) {
  return (
    pathname === '/admin/login' ||
    pathname === '/api/admin/auth/login' ||
    pathname === '/api/admin/auth/logout' ||
    pathname === '/api/admin/locale'
  );
}

function missingAdminConfigResponse() {
  return new NextResponse('Admin credentials are not configured.', {
    status: 503,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function forbiddenResponse() {
  return new NextResponse('Forbidden.', {
    status: 403,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}

function adminLoginRedirect(request: NextRequest) {
  const loginUrl = createAdminRedirectUrl('/admin/login', request);
  loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

function addAdminSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function isMutatingRequest(method: string) {
  return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
}

function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) {
    return true;
  }

  const allowedOrigins = new Set([request.nextUrl.origin]);
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');

  if (publicSiteUrl) {
    allowedOrigins.add(new URL(publicSiteUrl).origin);
  }

  if (forwardedProto && forwardedHost) {
    allowedOrigins.add(`${forwardedProto}://${forwardedHost}`);
  }

  return allowedOrigins.has(origin);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminRoute(pathname) || isAdminApiRoute(pathname)) {
    if (isMutatingRequest(request.method) && !isSameOriginRequest(request)) {
      return addAdminSecurityHeaders(forbiddenResponse());
    }

    if (isPublicAdminRoute(pathname)) {
      return addAdminSecurityHeaders(NextResponse.next());
    }

    if (!getAdminSessionSecret()) {
      return missingAdminConfigResponse();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSession(token);

    if (!session) {
      if (isAdminApiRoute(pathname)) {
        return addAdminSecurityHeaders(
          NextResponse.json({ error: 'Authentication required.' }, { status: 401 }),
        );
      }

      return addAdminSecurityHeaders(adminLoginRedirect(request));
    }

    // Role-based section guard. sectionForPath only matches /admin page routes;
    // /api/admin routes return null and stay auth-only.
    const section = sectionForPath(pathname);

    if (section && !canAccessSection(session.role, section)) {
      if (isAdminApiRoute(pathname)) {
        return addAdminSecurityHeaders(forbiddenResponse());
      }

      // Bounce to the dashboard, which every authenticated role can see.
      return addAdminSecurityHeaders(
        NextResponse.redirect(createAdminRedirectUrl('/admin', request)),
      );
    }

    const response = NextResponse.next();
    return addAdminSecurityHeaders(response);
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
};
