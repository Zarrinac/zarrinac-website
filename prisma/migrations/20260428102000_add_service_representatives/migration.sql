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
CREATE INDEX "ServiceRepresentative_provinceId_cityId_serviceKind_sortOrder_idx" ON "ServiceRepresentative"("provinceId", "cityId", "serviceKind", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceRepresentative_serviceKind_sortOrder_idx" ON "ServiceRepresentative"("serviceKind", "sortOrder");
