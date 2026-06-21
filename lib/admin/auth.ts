import type { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'hisense_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  sub: string;
  uid: string;
  role: string;
  iat: number;
  exp: number;
};

export type AdminSessionUser = {
  id: string;
  username: string;
  role: string;
};

export type AdminAuthConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

const textEncoder = new TextEncoder();

function base64UrlEncode(value: string | Uint8Array) {
  const bytes = typeof value === 'string' ? textEncoder.encode(value) : value;
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value));

  return base64UrlEncode(new Uint8Array(signature));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));

  return base64UrlEncode(new Uint8Array(digest));
}

async function constantTimeEqual(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([sha256(left), sha256(right)]);

  return leftHash === rightHash;
}

// Session signing only needs the secret. Kept separate from credential
// config so a DB-only setup (no ADMIN_USERNAME/ADMIN_PASSWORD) still works.
export function getAdminSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? null;
}

// Env-based credentials are now only a bootstrap/outage fallback (see
// lib/admin/credentials.ts). Returns null unless all three vars are present.
export function getAdminAuthConfig(): AdminAuthConfig | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !sessionSecret) {
    return null;
  }

  return {
    username,
    password,
    sessionSecret,
  };
}

export async function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminAuthConfig();

  if (!config) {
    return false;
  }

  const [usernameMatches, passwordMatches] = await Promise.all([
    constantTimeEqual(username, config.username),
    constantTimeEqual(password, config.password),
  ]);

  return usernameMatches && passwordMatches;
}

export async function createAdminSession(user: AdminSessionUser) {
  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: user.username,
    uid: user.id,
    role: user.role,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload, sessionSecret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined) {
  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload, sessionSecret);

  if (!(await constantTimeEqual(signature, expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.sub || !payload.role || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function hasAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token);

  return Boolean(session);
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
