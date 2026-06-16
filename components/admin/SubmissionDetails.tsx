'use client';

import { useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SubmissionKind } from '@/lib/admin/submissions';

type SubmissionDetailsProps = {
  type: SubmissionKind;
  id: string;
  isRead: boolean;
  summaryLabel: string;
  children: ReactNode;
};

// Wraps the native <details> for a submission row. The first time it is opened it
// stamps the submission as read (server-side), then refreshes so the "new" badge
// and the nav unread counts update.
export default function SubmissionDetails({
  type,
  id,
  isRead,
  summaryLabel,
  children,
}: SubmissionDetailsProps) {
  const router = useRouter();
  const handledRef = useRef(isRead);

  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.open || handledRef.current) {
      return;
    }

    handledRef.current = true;
    fetch('/api/admin/submissions/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id }),
    })
      .then((response) => {
        if (response.ok) {
          router.refresh();
        } else {
          handledRef.current = false;
        }
      })
      .catch(() => {
        handledRef.current = false;
      });
  };

  return (
    <details onToggle={handleToggle}>
      <summary className="cursor-pointer text-sm font-semibold text-[#008f8a]">
        {summaryLabel}
      </summary>
      {children}
    </details>
  );
}
