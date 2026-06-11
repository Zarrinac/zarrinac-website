/* eslint-disable no-console */
import Module from 'module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { DcodeProduct } from '@/types/dcode';

const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// tsx does not resolve the `@/` path alias, and the content module imports
// `@/lib/...`. Patch module resolution so those imports map to repo-root files
// (mirrors scripts/seed-products.ts).
type ResolveFilename = (
  request: string,
  parent: unknown,
  isMain: unknown,
  options: unknown,
) => string;
type ModuleInternals = typeof Module & {
  _resolveFilename?: ResolveFilename;
  _extensions: NodeJS.RequireExtensions;
};
const moduleInternals = Module as ModuleInternals;

const registerModuleStubs = () => {
  const originalResolveFilename = moduleInternals._resolveFilename;
  if (!originalResolveFilename) return;
  moduleInternals._resolveFilename = function patchedResolve(request, parent, isMain, options) {
    if (request.startsWith('@/')) {
      const basePath = path.resolve(process.cwd(), request.replace('@/', ''));
      const tsPath = `${basePath}.ts`;
      if (fs.existsSync(tsPath)) return tsPath;
      const jsPath = `${basePath}.js`;
      if (fs.existsSync(jsPath)) return jsPath;
      return basePath;
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
  };
};

const toJsonField = (value: unknown): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =>
  value ?? Prisma.DbNull;

const asString = (value: unknown): string => (typeof value === 'string' ? value : String(value));

const loadDcodeProducts = async (): Promise<DcodeProduct[]> => {
  const modulePath = path.resolve(process.cwd(), 'content/DcodeProducts.ts');
  const imported: unknown = await import(pathToFileURL(modulePath).href);
  const exported = (imported as Record<string, unknown>).DCODE_PRODUCTS;
  if (!Array.isArray(exported)) {
    throw new Error('DCODE_PRODUCTS content module did not export a product array');
  }
  return exported as DcodeProduct[];
};

async function seed() {
  registerModuleStubs();
  const products = await loadDcodeProducts();
  console.log(`Seeding ${products.length} D'code product(s)...`);

  for (const product of products) {
    const data = {
      slug: product.id.toLowerCase(),
      brand: 'dcode' as const,
      // Content uses lowercase category ('led'); the DB enum is uppercase ('LED').
      category: product.category.toUpperCase() as 'LED',
      series: product.series,
      panel: product.panel,
      resolution: product.resolution,
      os: product.os,
      storage: product.storage,
      viewingAngle: product.viewingAngle,
      tuner: product.tuner,
      sound: product.sound,
      connectivity: product.connectivity,
      warrantyMonths: product.warrantyMonths,
      extras: product.extras,
      heroImageUrl: asString(product.heroImage),
      heroVideoUrl: product.heroVideo ? asString(product.heroVideo) : null,
      remoteImageUrl: product.remoteImage ? asString(product.remoteImage) : null,
      gallery: toJsonField((product.gallery ?? []).map(asString)),
      featureCards: toJsonField(product.featureCards ?? []),
      remotes: toJsonField(product.remotes ?? {}),
      specs: toJsonField(product.specs ?? {}),
    };

    console.log(`- upserting ${product.id}`);
    await prisma.dcodeProduct.upsert({
      where: { id: product.id },
      update: data,
      create: { id: product.id, ...data },
    });

    // Replace variants and copies so the DB always reflects the latest content.
    await prisma.dcodeVariant.deleteMany({ where: { productId: product.id } });
    await prisma.dcodeVariant.createMany({
      data: product.variants.map((variant, index) => ({
        sku: variant.sku,
        productId: product.id,
        size: variant.size,
        diagonalInch: variant.diagonalInch,
        imageUrl: asString(variant.image),
        dimensionsWithoutStand: variant.dimensionsWithoutStand,
        dimensionsWithStand: variant.dimensionsWithStand,
        netWeight: variant.netWeight,
        sortOrder: index,
      })),
    });

    await prisma.dcodeProductCopy.deleteMany({ where: { productId: product.id } });
    await prisma.dcodeProductCopy.createMany({
      data: (['en', 'fa'] as const).map((locale) => {
        const copy = product.copy[locale];
        return {
          productId: product.id,
          locale,
          name: copy.name,
          tagline: copy.tagline,
          description: copy.description ?? null,
          highlights: copy.highlights ?? [],
        };
      }),
    });
  }

  console.log("D'code seed complete.");
}

// Exit synchronously on success rather than awaiting teardown — see
// seed-products.ts (pg-adapter teardown can crash post-commit). The orchestrator
// scripts/seed-all.mjs keys success off the "complete" message, not the exit code.
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("D'code seed failed:", error);
    process.exit(1);
  });
