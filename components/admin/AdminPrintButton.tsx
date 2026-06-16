'use client';

import type { MouseEvent } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

type AdminPrintButtonProps = {
  // 'table' prints just the section's table; 'single' prints just the submission
  // this button lives inside. Both render into a clean popup so no admin chrome
  // (nav, header, buttons) ever ends up in the output.
  mode: 'table' | 'single';
  label: string;
  className?: string;
};

const DEFAULT_CLASS =
  'admin-no-print inline-flex h-9 items-center gap-2 rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 text-sm font-medium text-[#52636f] transition hover:border-[#00a8a3] hover:text-[#008f8a]';

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: 'IRANSansXV', 'Vazirmatn', 'Segoe UI', Tahoma, Arial, sans-serif; color: #172026; margin: 24px; }
  h1 { font-size: 18px; margin: 0 0 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #d4dde3; padding: 8px 10px; text-align: start; vertical-align: top; }
  thead th { background: #f3f6f8; font-weight: 600; }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 28px; margin: 0; }
  dt { font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: #6b7b86; margin-bottom: 2px; }
  dd { margin: 0; font-size: 13px; word-break: break-word; }
  @media print { body { margin: 0; } }
`;

function openPrintWindow(title: string, bodyHtml: string) {
  const docEl = document.documentElement;
  const dir = docEl.getAttribute('dir') ?? 'rtl';
  const lang = docEl.getAttribute('lang') ?? 'fa';
  const win = window.open('', '_blank', 'width=1024,height=768');

  if (!win) {
    // Popup blocked — fall back to printing the current page.
    window.print();
    return;
  }

  win.document.open();
  win.document.write(
    `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8" />` +
      `<title>${title}</title><style>${PRINT_STYLES}</style></head>` +
      `<body><h1>${title}</h1>${bodyHtml}</body></html>`,
  );
  win.document.close();
  win.focus();

  win.onafterprint = () => win.close();
  // Give the new document a tick to lay out (and fonts to swap) before printing.
  window.setTimeout(() => win.print(), 350);
}

export default function AdminPrintButton({ mode, label, className }: AdminPrintButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (mode === 'single') {
      const tbody = event.currentTarget.closest('tbody.admin-submission');
      const detail = tbody?.querySelector('dl');
      if (!detail) {
        return;
      }
      const reference = detail.querySelector('dd')?.textContent?.trim() ?? '';
      openPrintWindow(reference || label, detail.outerHTML);
      return;
    }

    const section = event.currentTarget.closest('section');
    const sourceTable = section?.querySelector('table');
    if (!sourceTable) {
      return;
    }
    const table = sourceTable.cloneNode(true) as HTMLTableElement;
    // Drop the expandable detail rows + any in-table controls from the printout.
    table.querySelectorAll('.admin-detail-row, .admin-no-print').forEach((node) => node.remove());
    const heading = section?.querySelector('h3')?.textContent?.trim() ?? '';
    openPrintWindow(heading || label, table.outerHTML);
  };

  return (
    <button type="button" onClick={handleClick} className={className ?? DEFAULT_CLASS}>
      <PrintOutlinedIcon fontSize="small" />
      {label}
    </button>
  );
}
