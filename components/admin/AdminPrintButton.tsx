'use client';

import type { MouseEvent } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

type AdminPrintButtonProps = {
  // 'table' prints the whole page (nav/header are hidden by print CSS).
  // 'single' prints only the submission this button lives inside.
  mode: 'table' | 'single';
  label: string;
  className?: string;
};

const DEFAULT_CLASS =
  'admin-no-print inline-flex h-9 items-center gap-2 rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 text-sm font-medium text-[#52636f] transition hover:border-[#00a8a3] hover:text-[#008f8a]';

export default function AdminPrintButton({ mode, label, className }: AdminPrintButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (mode === 'table') {
      window.print();
      return;
    }

    const tbody = event.currentTarget.closest('tbody.admin-submission');
    const details = tbody?.querySelector('details');
    const wasOpen = details?.open ?? false;

    if (details) {
      details.open = true;
    }
    tbody?.classList.add('admin-print-target');
    document.body.classList.add('admin-printing-single');

    const cleanup = () => {
      document.body.classList.remove('admin-printing-single');
      tbody?.classList.remove('admin-print-target');
      if (details && !wasOpen) {
        details.open = false;
      }
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  return (
    <button type="button" onClick={handleClick} className={className ?? DEFAULT_CLASS}>
      <PrintOutlinedIcon fontSize="small" />
      {label}
    </button>
  );
}
