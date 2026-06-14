-- CreateEnum
CREATE TYPE "DcodeCategory" AS ENUM ('LED');

-- CreateTable
CREATE TABLE "DcodeProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'dcode',
    "category" "DcodeCategory" NOT NULL DEFAULT 'LED',
    "series" TEXT NOT NULL,
    "panel" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "viewingAngle" TEXT NOT NULL,
    "tuner" TEXT NOT NULL,
    "sound" TEXT NOT NULL,
    "connectivity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "warrantyMonths" INTEGER NOT NULL,
    "extras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "heroImageUrl" TEXT NOT NULL,
    "heroVideoUrl" TEXT,
    "remoteImageUrl" TEXT,
    "gallery" JSONB,
    "featureCards" JSONB,
    "remotes" JSONB,
    "specs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DcodeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DcodeVariant" (
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "diagonalInch" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "dimensionsWithoutStand" TEXT NOT NULL,
    "dimensionsWithStand" TEXT NOT NULL,
    "netWeight" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DcodeVariant_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "DcodeProductCopy" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "DcodeProductCopy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProduct_slug_key" ON "DcodeProduct"("slug");

-- CreateIndex
CREATE INDEX "DcodeProduct_category_idx" ON "DcodeProduct"("category");

-- CreateIndex
CREATE INDEX "DcodeVariant_productId_sortOrder_idx" ON "DcodeVariant"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProductCopy_productId_locale_key" ON "DcodeProductCopy"("productId", "locale");

-- AddForeignKey
ALTER TABLE "DcodeVariant" ADD CONSTRAINT "DcodeVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DcodeProductCopy" ADD CONSTRAINT "DcodeProductCopy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
