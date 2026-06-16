import { NextResponse, type NextRequest } from 'next/server';
import { hasAdminSession } from '@/lib/admin/auth';
import { markSubmissionRead, type SubmissionKind } from '@/lib/admin/submissions';

function isSubmissionKind(value: unknown): value is SubmissionKind {
  return value === 'complaint' || value === 'survey';
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { type, id } = (rawBody ?? {}) as { type?: unknown; id?: unknown };
  if (!isSubmissionKind(type) || typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const ok = await markSubmissionRead(type, id);
  if (!ok) {
    return NextResponse.json({ error: 'Unable to mark submission read' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
