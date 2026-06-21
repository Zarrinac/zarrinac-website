'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ADMIN_ROLES, canManageUsers } from '@/lib/admin/access';
import { getAdminSession } from '@/lib/admin/session';
import {
  adminUsernameExists,
  countActiveSuperAdmins,
  createAdminUser,
  deleteAdminUser,
  getAdminUserById,
  setAdminUserActive,
  setAdminUserPassword,
  setAdminUserRole,
} from '@/lib/admin/users';

export type ActionResult = { ok: true } | { ok: false; error: string };

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'usernameLength')
  .max(50, 'usernameLength')
  .regex(/^[a-zA-Z0-9._-]+$/, 'usernameChars');

const passwordSchema = z.string().min(8, 'passwordLength').max(200, 'passwordLength');
const roleSchema = z.enum(ADMIN_ROLES);
const idSchema = z.string().min(1);

const createSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  role: roleSchema,
});

// Every action re-checks the caller is a super admin. Middleware already gates
// the /admin/users route, but server actions are independently invocable, so
// they must guard themselves too.
async function requireSuperAdmin(): Promise<ActionResult> {
  const session = await getAdminSession();

  if (!session || !canManageUsers(session.role)) {
    return { ok: false, error: 'forbidden' };
  }

  return { ok: true };
}

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'invalid';
}

export async function createAdminUserAction(input: {
  username: string;
  password: string;
  role: string;
}): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error) };
  }

  if (await adminUsernameExists(parsed.data.username)) {
    return { ok: false, error: 'usernameTaken' };
  }

  await createAdminUser(parsed.data);
  revalidatePath('/admin/users');

  return { ok: true };
}

export async function updateRoleAction(input: { id: string; role: string }): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  const id = idSchema.safeParse(input.id);
  const role = roleSchema.safeParse(input.role);
  if (!id.success || !role.success) {
    return { ok: false, error: 'invalid' };
  }

  const target = await getAdminUserById(id.data);
  if (!target) {
    return { ok: false, error: 'notFound' };
  }

  // Block demoting the last active super admin.
  if (
    target.role === 'SUPER_ADMIN' &&
    role.data !== 'SUPER_ADMIN' &&
    target.isActive &&
    (await countActiveSuperAdmins()) <= 1
  ) {
    return { ok: false, error: 'lastSuperAdmin' };
  }

  await setAdminUserRole(id.data, role.data);
  revalidatePath('/admin/users');

  return { ok: true };
}

export async function toggleActiveAction(input: {
  id: string;
  isActive: boolean;
}): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  const id = idSchema.safeParse(input.id);
  if (!id.success || typeof input.isActive !== 'boolean') {
    return { ok: false, error: 'invalid' };
  }

  const target = await getAdminUserById(id.data);
  if (!target) {
    return { ok: false, error: 'notFound' };
  }

  if (
    target.role === 'SUPER_ADMIN' &&
    target.isActive &&
    !input.isActive &&
    (await countActiveSuperAdmins()) <= 1
  ) {
    return { ok: false, error: 'lastSuperAdmin' };
  }

  await setAdminUserActive(id.data, input.isActive);
  revalidatePath('/admin/users');

  return { ok: true };
}

export async function resetPasswordAction(input: {
  id: string;
  password: string;
}): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  const id = idSchema.safeParse(input.id);
  const password = passwordSchema.safeParse(input.password);
  if (!id.success || !password.success) {
    return { ok: false, error: password.success ? 'invalid' : 'passwordLength' };
  }

  const target = await getAdminUserById(id.data);
  if (!target) {
    return { ok: false, error: 'notFound' };
  }

  await setAdminUserPassword(id.data, password.data);
  revalidatePath('/admin/users');

  return { ok: true };
}

export async function deleteAdminUserAction(input: { id: string }): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  const id = idSchema.safeParse(input.id);
  if (!id.success) {
    return { ok: false, error: 'invalid' };
  }

  const session = await getAdminSession();
  if (session?.uid === id.data) {
    return { ok: false, error: 'cannotDeleteSelf' };
  }

  const target = await getAdminUserById(id.data);
  if (!target) {
    return { ok: false, error: 'notFound' };
  }

  if (target.role === 'SUPER_ADMIN' && target.isActive && (await countActiveSuperAdmins()) <= 1) {
    return { ok: false, error: 'lastSuperAdmin' };
  }

  await deleteAdminUser(id.data);
  revalidatePath('/admin/users');

  return { ok: true };
}
