-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('TVS', 'WMS', 'RAC', 'CAC', 'REFRIGERATOR', 'TV_DCODE');

-- CreateEnum
CREATE TYPE "DcodeCategory" AS ENUM ('LED');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL DEFAULT 'TVS',
    "sku" TEXT,
    "series" TEXT NOT NULL,
    "seriesLabel" TEXT,
    "size" TEXT,
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
CREATE TABLE "TvSpec" (
    "productId" TEXT NOT NULL,
    "panel" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "refreshRate" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "sound" TEXT NOT NULL,
    "connectivity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tuner" TEXT NOT NULL,

    CONSTRAINT "TvSpec_pkey" PRIMARY KEY ("productId")
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

-- CreateTable
CREATE TABLE "IranProvince" (
    "id" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IranProvince_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IranCity" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IranCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintSubmission" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "productCategory" TEXT NOT NULL,
    "productModel" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "referenceNumber" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "complaintTopic" TEXT NOT NULL,
    "preferredContactMethod" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplaintSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "productCategory" TEXT NOT NULL,
    "productModel" TEXT,
    "referenceNumber" TEXT,
    "serviceChannel" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3),
    "communicationClarity" TEXT NOT NULL,
    "staffBehavior" TEXT NOT NULL,
    "timeliness" TEXT NOT NULL,
    "overallSatisfaction" TEXT NOT NULL,
    "followUpConsent" TEXT NOT NULL,
    "overallFeedback" TEXT NOT NULL,
    "improvementSuggestions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadAsset" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "fileLocale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRepresentative" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "provinceNameFa" TEXT NOT NULL,
    "provinceNameEn" TEXT NOT NULL,
    "cityNameFa" TEXT NOT NULL,
    "cityNameEn" TEXT NOT NULL,
    "serviceKind" TEXT NOT NULL,
    "representativeNameFa" TEXT NOT NULL,
    "representativeNameEn" TEXT NOT NULL,
    "representativeCode" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "addressFa" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCopy_productId_locale_key" ON "ProductCopy"("productId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProduct_slug_key" ON "DcodeProduct"("slug");

-- CreateIndex
CREATE INDEX "DcodeProduct_category_idx" ON "DcodeProduct"("category");

-- CreateIndex
CREATE INDEX "DcodeVariant_productId_sortOrder_idx" ON "DcodeVariant"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProductCopy_productId_locale_key" ON "DcodeProductCopy"("productId", "locale");

-- CreateIndex
CREATE INDEX "IranProvince_sortOrder_idx" ON "IranProvince"("sortOrder");

-- CreateIndex
CREATE INDEX "IranCity_provinceId_sortOrder_idx" ON "IranCity"("provinceId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintSubmission_referenceCode_key" ON "ComplaintSubmission"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "SurveySubmission_referenceCode_key" ON "SurveySubmission"("referenceCode");

-- CreateIndex
CREATE INDEX "DownloadAsset_pageKey_locale_isActive_sortOrder_idx" ON "DownloadAsset"("pageKey", "locale", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadAsset_pageKey_locale_fileLocale_key" ON "DownloadAsset"("pageKey", "locale", "fileLocale");

-- CreateIndex
CREATE INDEX "ServiceRepresentative_provinceId_cityId_serviceKind_sortOrd_idx" ON "ServiceRepresentative"("provinceId", "cityId", "serviceKind", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceRepresentative_serviceKind_sortOrder_idx" ON "ServiceRepresentative"("serviceKind", "sortOrder");

-- AddForeignKey
ALTER TABLE "TvSpec" ADD CONSTRAINT "TvSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCopy" ADD CONSTRAINT "ProductCopy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DcodeVariant" ADD CONSTRAINT "DcodeVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DcodeProductCopy" ADD CONSTRAINT "DcodeProductCopy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IranCity" ADD CONSTRAINT "IranCity_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "IranProvince"("id") ON DELETE CASCADE ON UPDATE CASCADE;
