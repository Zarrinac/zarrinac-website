const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

type Entry = { failCount: number; windowStart: number };
const store = new Map<string, Entry>();

function getActiveEntry(ip: string): Entry | null {
  const entry = store.get(ip);
  if (!entry) return null;
  if (Date.now() - entry.windowStart > WINDOW_MS) {
    store.delete(ip);
    return null;
  }
  return entry;
}

export function isLoginRateLimited(ip: string): boolean {
  const entry = getActiveEntry(ip);
  return entry !== null && entry.failCount >= MAX_FAILED_ATTEMPTS;
}

export function recordLoginFailure(ip: string): void {
  const entry = getActiveEntry(ip);
  if (!entry) {
    store.set(ip, { failCount: 1, windowStart: Date.now() });
  } else {
    entry.failCount++;
  }
}

export function clearLoginFailures(ip: string): void {
  store.delete(ip);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
