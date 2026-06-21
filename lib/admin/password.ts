import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Password hashing for admin users. Uses Node's built-in scrypt (no extra
// dependency) — runs only in Node contexts (login route, seed/CLI scripts),
// never in the edge middleware, which deals exclusively with signed sessions.

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
const HASH_PREFIX = 'scrypt';

export function hashPassword(plain: string): string {
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(plain, salt, SCRYPT_KEYLEN);

  return `${HASH_PREFIX}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split('$');

  if (parts.length !== 3 || parts[0] !== HASH_PREFIX) {
    return false;
  }

  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');

  if (salt.length === 0 || expected.length === 0) {
    return false;
  }

  const derived = scryptSync(plain, salt, expected.length);

  // timingSafeEqual throws on length mismatch — guard first.
  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}
