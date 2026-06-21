import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin/auth';

// Reads + verifies the admin session from the request cookies. For use in
// server components and server actions (anything with access to next/headers).
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifyAdminSession(token);
}
