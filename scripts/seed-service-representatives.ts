/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { serviceCenters } from '../content/service-centers/serviceCenters';

const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to seed service representatives.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CHUNK_SIZE = 250;

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function seedServiceRepresentatives() {
  const rows = serviceCenters.map((center, index) => ({
    id: center.id,
    provinceId: center.provinceId,
    cityId: center.cityId,
    provinceNameFa: center.provinceName.fa,
    provinceNameEn: center.provinceName.en,
    cityNameFa: center.cityName.fa,
    cityNameEn: center.cityName.en,
    serviceKind: center.serviceKind,
    representativeNameFa: center.representativeName.fa,
    representativeNameEn: center.representativeName.en,
    representativeCode: center.representativeCode,
    primaryPhone: center.primaryPhone,
    mobilePhone: center.mobilePhone,
    addressFa: center.address.fa,
    addressEn: center.address.en,
    sortOrder: index,
  }));

  console.log(`Seeding ${rows.length} service representatives...`);

  await prisma.$transaction(async (tx) => {
    await tx.serviceRepresentative.deleteMany();

    for (const part of chunk(rows, CHUNK_SIZE)) {
      await tx.serviceRepresentative.createMany({
        data: part,
        skipDuplicates: false,
      });
    }
  });

  console.log('Service representatives seed complete.');
}

seedServiceRepresentatives()
  .catch((error) => {
    console.error('Service representatives seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
