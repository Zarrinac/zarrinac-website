-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "series" TEXT NOT NULL,
    "seriesLabel" TEXT,
    "size" TEXT,
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "panel" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "refreshRate" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "sound" TEXT NOT NULL,
    "connectivity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tuner" TEXT NOT NULL,
    "extras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT NOT NULL,
    "posterImageUrl" TEXT,
    "heroVideoUrl" TEXT,
    "gallery" JSONB,
    "banners" JSONB,
    "featureCards" JSONB,
    "sectionGroups" JSONB,
    "contentSections" JSONB,
    "stackedSections" JSONB,
    "bottomStackedSections" JSONB,
    "comparisonSections" JSONB,
    "experienceSection" JSONB,
    "badges" JSONB,
    "specs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCopy" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blocks" JSONB,

    CONSTRAINT "ProductCopy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCopy_productId_locale_key" ON "ProductCopy"("productId", "locale");

-- AddForeignKey
ALTER TABLE "ProductCopy" ADD CONSTRAINT "ProductCopy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
