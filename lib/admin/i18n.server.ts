import { cookies } from 'next/headers';
import { ADMIN_LOCALE_COOKIE, resolveAdminLocale } from '@/lib/admin/i18n';

export async function getAdminLocale() {
  const cookieStore = await cookies();

  return resolveAdminLocale(cookieStore.get(ADMIN_LOCALE_COOKIE)?.value);
}
