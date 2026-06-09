import { permanentRedirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// Permanently redirect root requests to the default locale homepage so search
// engines consolidate "/" and "/{defaultLocale}" instead of indexing both.

export default function IndexPage() {
  permanentRedirect(`/${routing.defaultLocale}`);
}
