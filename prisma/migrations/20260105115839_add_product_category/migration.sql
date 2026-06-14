-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('TVS', 'WMS', 'RAC', 'CAC', 'REFRIGERATOR', 'TV_DCODE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'TVS';
