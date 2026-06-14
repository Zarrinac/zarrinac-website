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

-- CreateIndex
CREATE INDEX "IranProvince_sortOrder_idx" ON "IranProvince"("sortOrder");

-- CreateIndex
CREATE INDEX "IranCity_provinceId_sortOrder_idx" ON "IranCity"("provinceId", "sortOrder");

-- AddForeignKey
ALTER TABLE "IranCity" ADD CONSTRAINT "IranCity_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "IranProvince"("id") ON DELETE CASCADE ON UPDATE CASCADE;
