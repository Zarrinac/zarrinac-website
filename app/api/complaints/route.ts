import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { complaintSubmissionSchema } from '@/lib/complaints/schema';
import { getIranLocationDisplayName } from '@/lib/iranLocationSource';
import { SITE_ID } from '@/lib/siteId';

function parseDateOnly(value: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function createReferenceCode() {
  return `CMP-${crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsedPayload = complaintSubmissionSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        message: 'Invalid complaint payload.',
        errors: parsedPayload.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (!prisma) {
    return NextResponse.json(
      {
        message: 'Complaint intake is currently unavailable.',
      },
      { status: 503 },
    );
  }

  try {
    const { province, city, purchaseDate, ...complaintData } = parsedPayload.data;
    const locationLabel =
      (await getIranLocationDisplayName(parsedPayload.data.locale, province, city)) ??
      `${province} / ${city}`;

    const complaint = await prisma.complaintSubmission.create({
      data: {
        ...complaintData,
        site: SITE_ID,
        referenceCode: createReferenceCode(),
        purchaseDate: parseDateOnly(purchaseDate),
        city: locationLabel,
      },
    });

    return NextResponse.json(
      {
        referenceCode: complaint.referenceCode,
        trackingCode: complaint.referenceCode,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[api/complaints] complaint submission failed', error);

    return NextResponse.json(
      {
        message: 'Unable to save complaint right now.',
      },
      { status: 500 },
    );
  }
}
