-- CreateTable
CREATE TABLE "TvSpec" (
    "productId" TEXT NOT NULL,
    "panel" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "refreshRate" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "sound" TEXT NOT NULL,
    "connectivity" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "tuner" TEXT NOT NULL,

    CONSTRAINT "TvSpec_pkey" PRIMARY KEY ("productId")
);

-- Backfill TV specs before dropping columns.
INSERT INTO "TvSpec" (
    "productId",
    "panel",
    "resolution",
    "refreshRate",
    "os",
    "sound",
    "connectivity",
    "tuner"
)
SELECT
    "id",
    "panel",
    "resolution",
    "refreshRate",
    "os",
    "sound",
    "connectivity",
    "tuner"
FROM "Product"
WHERE "category" = 'TVS';

-- Drop removed TV-only columns from Product.
ALTER TABLE "Product"
  DROP COLUMN "panel",
  DROP COLUMN "resolution",
  DROP COLUMN "refreshRate",
  DROP COLUMN "os",
  DROP COLUMN "sound",
  DROP COLUMN "connectivity",
  DROP COLUMN "tuner";

-- AddForeignKey
ALTER TABLE "TvSpec" ADD CONSTRAINT "TvSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
