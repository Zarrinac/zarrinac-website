import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { surveySubmissionSchema } from '@/lib/surveys/schema';

function parseDateOnly(value: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function createReferenceCode() {
  return `SRV-${crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsedPayload = surveySubmissionSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        message: 'Invalid survey payload.',
        errors: parsedPayload.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (!prisma) {
    return NextResponse.json(
      {
        message: 'Survey intake is currently unavailable.',
      },
      { status: 503 },
    );
  }

  try {
    const { serviceDate, ...surveyData } = parsedPayload.data;
    const survey = await prisma.surveySubmission.create({
      data: {
        ...surveyData,
        referenceCode: createReferenceCode(),
        serviceDate: parseDateOnly(serviceDate),
      },
    });

    return NextResponse.json(
      {
        referenceCode: survey.referenceCode,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[api/surveys] survey submission failed', error);

    return NextResponse.json(
      {
        message: 'Unable to save survey right now.',
      },
      { status: 500 },
    );
  }
}
