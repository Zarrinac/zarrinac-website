/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { hashPassword } from '../lib/admin/password';

const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to create an admin user.');
}

const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;
type Role = (typeof VALID_ROLES)[number];

// Usage: tsx scripts/create-admin.ts <username> <password> [role]
//   role defaults to ADMIN; one of SUPER_ADMIN | ADMIN | EDITOR.
// Creates the user, or updates the password/role if the username exists.
const [, , username, password, roleArg] = process.argv;
const role = (roleArg ?? 'ADMIN').toUpperCase();

if (!username || !password) {
  console.error('Usage: tsx scripts/create-admin.ts <username> <password> [role]');
  console.error(`  role: ${VALID_ROLES.join(' | ')} (default ADMIN)`);
  process.exit(1);
}

if (!VALID_ROLES.includes(role as Role)) {
  console.error(`Invalid role "${role}". Expected one of: ${VALID_ROLES.join(', ')}`);
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const user = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hashPassword(password), role: role as Role, isActive: true },
    create: {
      username,
      passwordHash: hashPassword(password),
      role: role as Role,
      isActive: true,
    },
  });

  console.log(`Admin user "${user.username}" saved with role ${user.role} (id: ${user.id}).`);
}

createAdmin()
  .catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
