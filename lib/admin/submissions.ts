import { prisma } from '@/lib/db';

const SUBMISSION_LIST_LIMIT = 25;

export type AdminComplaintSubmission = {
  id: string;
  referenceCode: string;
  locale: string;
  fullName: string;
  phone: string;
  email: string | null;
  productCategory: string;
  productModel: string;
  invoiceNumber: string | null;
  referenceNumber: string | null;
  purchaseDate: Date | null;
  complaintTopic: string;
  preferredContactMethod: string;
  city: string;
  address: string | null;
  description: string;
  status: string;
  site: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminSurveySubmission = {
  id: string;
  referenceCode: string;
  locale: string;
  fullName: string;
  mobile: string;
  phone: string | null;
  email: string | null;
  productCategory: string;
  productModel: string | null;
  referenceNumber: string | null;
  serviceChannel: string;
  serviceDate: Date | null;
  communicationClarity: string;
  staffBehavior: string;
  timeliness: string;
  overallSatisfaction: string;
  followUpConsent: string;
  overallFeedback: string;
  improvementSuggestions: string | null;
  status: string;
  site: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminSubmissionsData = {
  databaseReady: boolean;
  limit: number;
  complaintCount: number | null;
  surveyCount: number | null;
  complaints: AdminComplaintSubmission[];
  surveys: AdminSurveySubmission[];
};

export type AdminComplaintsData = {
  databaseReady: boolean;
  limit: number;
  complaintCount: number | null;
  complaints: AdminComplaintSubmission[];
};

export type AdminSurveysData = {
  databaseReady: boolean;
  limit: number;
  surveyCount: number | null;
  surveys: AdminSurveySubmission[];
};

const complaintSelect = {
  id: true,
  referenceCode: true,
  locale: true,
  fullName: true,
  phone: true,
  email: true,
  productCategory: true,
  productModel: true,
  invoiceNumber: true,
  referenceNumber: true,
  purchaseDate: true,
  complaintTopic: true,
  preferredContactMethod: true,
  city: true,
  address: true,
  description: true,
  status: true,
  site: true,
  readAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const surveySelect = {
  id: true,
  referenceCode: true,
  locale: true,
  fullName: true,
  mobile: true,
  phone: true,
  email: true,
  productCategory: true,
  productModel: true,
  referenceNumber: true,
  serviceChannel: true,
  serviceDate: true,
  communicationClarity: true,
  staffBehavior: true,
  timeliness: true,
  overallSatisfaction: true,
  followUpConsent: true,
  overallFeedback: true,
  improvementSuggestions: true,
  status: true,
  site: true,
  readAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAdminComplaintsData(): Promise<AdminComplaintsData> {
  if (!prisma) {
    console.error(
      '[admin/complaints] Prisma client is unavailable. Check DATABASE_URL at runtime.',
    );

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount: null,
      complaints: [],
    };
  }

  try {
    const [complaintCount, complaints] = await Promise.all([
      prisma.complaintSubmission.count(),
      prisma.complaintSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: SUBMISSION_LIST_LIMIT,
        select: complaintSelect,
      }),
    ]);

    return {
      databaseReady: true,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount,
      complaints,
    };
  } catch (error) {
    console.error('[admin/complaints] Unable to load complaint submissions.', error);

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount: null,
      complaints: [],
    };
  }
}

export async function getAdminSurveysData(): Promise<AdminSurveysData> {
  if (!prisma) {
    console.error('[admin/surveys] Prisma client is unavailable. Check DATABASE_URL at runtime.');

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      surveyCount: null,
      surveys: [],
    };
  }

  try {
    const [surveyCount, surveys] = await Promise.all([
      prisma.surveySubmission.count(),
      prisma.surveySubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: SUBMISSION_LIST_LIMIT,
        select: surveySelect,
      }),
    ]);

    return {
      databaseReady: true,
      limit: SUBMISSION_LIST_LIMIT,
      surveyCount,
      surveys,
    };
  } catch (error) {
    console.error('[admin/surveys] Unable to load survey submissions.', error);

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      surveyCount: null,
      surveys: [],
    };
  }
}

export async function getAdminSubmissionsData(): Promise<AdminSubmissionsData> {
  if (!prisma) {
    console.error(
      '[admin/submissions] Prisma client is unavailable. Check DATABASE_URL at runtime.',
    );

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount: null,
      surveyCount: null,
      complaints: [],
      surveys: [],
    };
  }

  try {
    const [complaintCount, surveyCount, complaints, surveys] = await Promise.all([
      prisma.complaintSubmission.count(),
      prisma.surveySubmission.count(),
      prisma.complaintSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: SUBMISSION_LIST_LIMIT,
        select: complaintSelect,
      }),
      prisma.surveySubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: SUBMISSION_LIST_LIMIT,
        select: surveySelect,
      }),
    ]);

    return {
      databaseReady: true,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount,
      surveyCount,
      complaints,
      surveys,
    };
  } catch (error) {
    console.error('[admin/submissions] Unable to load submissions.', error);

    return {
      databaseReady: false,
      limit: SUBMISSION_LIST_LIMIT,
      complaintCount: null,
      surveyCount: null,
      complaints: [],
      surveys: [],
    };
  }
}

export type AdminUnreadCounts = {
  complaints: number;
  surveys: number;
};

export type SubmissionKind = 'complaint' | 'survey';

// Counts of not-yet-opened submissions, used for the red badges on the admin nav.
// Not filtered by site — both brands' support is handled by the same team.
export async function getAdminUnreadCounts(): Promise<AdminUnreadCounts> {
  if (!prisma) {
    return { complaints: 0, surveys: 0 };
  }

  try {
    const [complaints, surveys] = await Promise.all([
      prisma.complaintSubmission.count({ where: { readAt: null } }),
      prisma.surveySubmission.count({ where: { readAt: null } }),
    ]);

    return { complaints, surveys };
  } catch (error) {
    console.error('[admin] Unable to load unread submission counts.', error);
    return { complaints: 0, surveys: 0 };
  }
}

// Stamps `readAt` once (idempotent — the `readAt: null` guard preserves the first
// time it was opened). Returns false only on a real DB error.
export async function markSubmissionRead(type: SubmissionKind, id: string): Promise<boolean> {
  if (!prisma) {
    return false;
  }

  try {
    if (type === 'complaint') {
      await prisma.complaintSubmission.updateMany({
        where: { id, readAt: null },
        data: { readAt: new Date() },
      });
    } else {
      await prisma.surveySubmission.updateMany({
        where: { id, readAt: null },
        data: { readAt: new Date() },
      });
    }

    return true;
  } catch (error) {
    console.error('[admin] Unable to mark submission read.', error);
    return false;
  }
}
