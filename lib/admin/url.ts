function getForwardedOrigin(request: Request) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');

  if (!forwardedProto || !forwardedHost) {
    return null;
  }

  return `${forwardedProto}://${forwardedHost}`;
}

export function getAdminBaseUrl(request: Request) {
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (publicSiteUrl) {
    return new URL(publicSiteUrl).origin;
  }

  return getForwardedOrigin(request) ?? new URL(request.url).origin;
}

export function createAdminRedirectUrl(path: string, request: Request) {
  return new URL(path, getAdminBaseUrl(request));
}
