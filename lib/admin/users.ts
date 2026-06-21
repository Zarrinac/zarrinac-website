import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/admin/password';
import type { AdminRole } from '@/lib/admin/access';

// Node-only Prisma CRUD for admin users. Never import from the edge middleware.

export type AdminUserRecord = {
  id: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

function serialize(user: {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}): AdminUserRecord {
  return {
    id: user.id,
    username: user.username,
    role: user.role as AdminRole,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  if (!prisma) {
    return [];
  }

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } });

  return users.map(serialize);
}

export async function getAdminUserById(id: string): Promise<AdminUserRecord | null> {
  if (!prisma) {
    return null;
  }

  const user = await prisma.adminUser.findUnique({ where: { id } });

  return user ? serialize(user) : null;
}

export async function adminUsernameExists(username: string): Promise<boolean> {
  if (!prisma) {
    return false;
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });

  return Boolean(existing);
}

export async function createAdminUser(input: {
  username: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUserRecord> {
  if (!prisma) {
    throw new Error('Database is unavailable.');
  }

  const user = await prisma.adminUser.create({
    data: {
      username: input.username,
      passwordHash: hashPassword(input.password),
      role: input.role,
      isActive: true,
    },
  });

  return serialize(user);
}

export async function setAdminUserRole(id: string, role: AdminRole): Promise<void> {
  if (!prisma) {
    throw new Error('Database is unavailable.');
  }

  await prisma.adminUser.update({ where: { id }, data: { role } });
}

export async function setAdminUserActive(id: string, isActive: boolean): Promise<void> {
  if (!prisma) {
    throw new Error('Database is unavailable.');
  }

  await prisma.adminUser.update({ where: { id }, data: { isActive } });
}

export async function setAdminUserPassword(id: string, password: string): Promise<void> {
  if (!prisma) {
    throw new Error('Database is unavailable.');
  }

  await prisma.adminUser.update({ where: { id }, data: { passwordHash: hashPassword(password) } });
}

export async function deleteAdminUser(id: string): Promise<void> {
  if (!prisma) {
    throw new Error('Database is unavailable.');
  }

  await prisma.adminUser.delete({ where: { id } });
}

// Number of SUPER_ADMIN accounts still active — used to prevent locking the
// portal out of its last super admin.
export async function countActiveSuperAdmins(): Promise<number> {
  if (!prisma) {
    return 0;
  }

  return prisma.adminUser.count({ where: { role: 'SUPER_ADMIN', isActive: true } });
}
