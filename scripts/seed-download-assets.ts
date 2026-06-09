/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to seed download assets.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const warrantyDownloads = [
  {
    pageKey: 'warranty-and-guarantee',
    locale: 'fa',
    fileLocale: 'fa',
    label: 'دانلود نسخه فارسی PDF',
    description: 'شرایط و ضوابط گارانتی و وارانتی محصولات به زبان فارسی.',
    path: '/media/downloads/warranty-and-guarantee-fa.pdf',
    sortOrder: 0,
  },
  {
    pageKey: 'warranty-and-guarantee',
    locale: 'fa',
    fileLocale: 'en',
    label: 'دانلود نسخه انگلیسی PDF',
    description: 'English warranty, guarantee, and after-sales service terms.',
    path: '/media/downloads/warranty-and-guarantee-en.pdf',
    sortOrder: 1,
  },
  {
    pageKey: 'warranty-and-guarantee',
    locale: 'en',
    fileLocale: 'en',
    label: 'Download English PDF',
    description: 'English warranty, guarantee, and after-sales service terms.',
    path: '/media/downloads/warranty-and-guarantee-en.pdf',
    sortOrder: 0,
  },
  {
    pageKey: 'warranty-and-guarantee',
    locale: 'en',
    fileLocale: 'fa',
    label: 'Download Persian PDF',
    description: 'Persian warranty and guarantee terms for Hisense Iran customers.',
    path: '/media/downloads/warranty-and-guarantee-fa.pdf',
    sortOrder: 1,
  },
] as const;

async function seedDownloadAssets() {
  console.log(`Seeding ${warrantyDownloads.length} warranty download assets...`);

  for (const item of warrantyDownloads) {
    await prisma.downloadAsset.upsert({
      where: {
        pageKey_locale_fileLocale: {
          pageKey: item.pageKey,
          locale: item.locale,
          fileLocale: item.fileLocale,
        },
      },
      update: {
        label: item.label,
        description: item.description,
        path: item.path,
        mimeType: 'application/pdf',
        sortOrder: item.sortOrder,
        isActive: true,
      },
      create: {
        ...item,
        mimeType: 'application/pdf',
      },
    });
  }

  console.log('Download assets seed complete.');
}

seedDownloadAssets()
  .catch((error) => {
    console.error('Download assets seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
