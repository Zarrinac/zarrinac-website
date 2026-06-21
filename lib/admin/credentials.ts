import { prisma } from '@/lib/db';
import {
  getAdminAuthConfig,
  verifyAdminCredentials,
  type AdminSessionUser,
} from '@/lib/admin/auth';
import { verifyPassword } from '@/lib/admin/password';

// Authenticates an admin login attempt. Node-only (touches Prisma + scrypt) —
// must never be imported from the edge middleware.
//
// Resolution order:
//   1. DB is the source of truth. If the username exists, the DB row decides
//      the outcome — a bad password or inactive account fails outright and we
//      do NOT fall back to env creds.
//   2. The env ADMIN_USERNAME/ADMIN_PASSWORD pair is only honoured as a
//      bootstrap (no AdminUser rows seeded yet) or outage (DB unreachable)
//      fallback, so the first admin can still get in before seeding.
export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<AdminSessionUser | null> {
  if (prisma) {
    try {
      const user = await prisma.adminUser.findUnique({ where: { username } });

      if (user) {
        if (!user.isActive || !verifyPassword(password, user.passwordHash)) {
          return null;
        }

        // Best-effort; never block login on the bookkeeping write.
        void prisma.adminUser
          .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
          .catch(() => undefined);

        return { id: user.id, username: user.username, role: user.role };
      }

      // Unknown username: if any admin users exist, the DB is authoritative and
      // env creds are disabled. Only fall through to env when the table is empty.
      const count = await prisma.adminUser.count();

      if (count > 0) {
        return null;
      }
    } catch {
      // DB unreachable — fall through to the env fallback below.
    }
  }

  const config = getAdminAuthConfig();

  if (config && (await verifyAdminCredentials(username, password))) {
    return { id: 'env', username: config.username, role: 'SUPER_ADMIN' };
  }

  return null;
}
