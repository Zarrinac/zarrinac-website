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

-- CreateIndex
CREATE UNIQUE INDEX "DownloadAsset_pageKey_locale_fileLocale_key" ON "DownloadAsset"("pageKey", "locale", "fileLocale");

-- CreateIndex
CREATE INDEX "DownloadAsset_pageKey_locale_isActive_sortOrder_idx" ON "DownloadAsset"("pageKey", "locale", "isActive", "sortOrder");
