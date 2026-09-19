import Document from '@/components/Document';
import { routing } from '@/i18n/routing';
import NotFoundContent from '@/components/NotFoundContent';

// Non-locale errors do not pass through the locale layout.
export default function NotFound() {
  return (
    <Document locale={routing.defaultLocale}>
      <NotFoundContent locale={routing.defaultLocale} />
    </Document>
  );
}
