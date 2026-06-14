-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_category_position_idx" ON "Product"("category", "position");

-- RenameIndex
ALTER INDEX "ServiceRepresentative_provinceId_cityId_serviceKind_sortOrder_i" RENAME TO "ServiceRepresentative_provinceId_cityId_serviceKind_sortOrd_idx";
