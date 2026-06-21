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
  throw new Error('DATABASE_URL is required to seed admin users.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Bootstraps the env ADMIN_USERNAME/ADMIN_PASSWORD pair into the DB as the
// first SUPER_ADMIN so existing login keeps working after the cutover to
// DB-backed credentials. Idempotent: re-running refreshes the password hash
// but never demotes an already-promoted account.
async function seedAdminUsers() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn(
      'ADMIN_USERNAME / ADMIN_PASSWORD not set — skipping bootstrap admin. ' +
        'Add users with `npm run admin:create <username> <password> [role]`.',
    );
    return;
  }

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hashPassword(password), isActive: true },
    create: {
      username,
      passwordHash: hashPassword(password),
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  const count = await prisma.adminUser.count();
  console.log(`Bootstrap admin "${username}" ensured. Total admin users: ${count}.`);
}

seedAdminUsers()
  .catch((error) => {
    console.error('Admin users seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
