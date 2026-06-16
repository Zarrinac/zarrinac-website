-- AlterTable
ALTER TABLE "ComplaintSubmission" ADD COLUMN     "site" TEXT NOT NULL DEFAULT 'hisense';

-- AlterTable
ALTER TABLE "SurveySubmission" ADD COLUMN     "site" TEXT NOT NULL DEFAULT 'hisense';
