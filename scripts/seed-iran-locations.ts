/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { iranProvinces } from '../lib/iranLocations';

const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to seed Iran locations.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedIranLocations() {
  const provinceRows = iranProvinces.map((province, index) => ({
    id: province.id,
    nameFa: province.labels.fa,
    nameEn: province.labels.en,
    sortOrder: index,
  }));

  const cityRows = iranProvinces.flatMap((province) =>
    province.cities.map((city, index) => ({
      id: city.id,
      provinceId: province.id,
      nameFa: city.labels.fa,
      nameEn: city.labels.en,
      sortOrder: index,
    })),
  );

  console.log(
    `Seeding ${provinceRows.length} provinces and ${cityRows.length} cities into Iran locations...`,
  );

  await prisma.$transaction(async (tx) => {
    for (const province of provinceRows) {
      await tx.iranProvince.upsert({
        where: { id: province.id },
        update: {
          nameFa: province.nameFa,
          nameEn: province.nameEn,
          sortOrder: province.sortOrder,
        },
        create: province,
      });
    }

    await tx.iranCity.deleteMany();

    await tx.iranCity.createMany({
      data: cityRows,
      skipDuplicates: false,
    });

    await tx.iranProvince.deleteMany({
      where: {
        id: {
          notIn: provinceRows.map((province) => province.id),
        },
      },
    });
  });

  console.log('Iran locations seed complete.');
}

seedIranLocations()
  .catch((error) => {
    console.error('Iran locations seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
