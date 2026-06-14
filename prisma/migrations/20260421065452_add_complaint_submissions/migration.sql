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

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintSubmission_referenceCode_key" ON "ComplaintSubmission"("referenceCode");
