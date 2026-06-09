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

-- CreateIndex
CREATE UNIQUE INDEX "SurveySubmission_referenceCode_key" ON "SurveySubmission"("referenceCode");
