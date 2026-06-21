import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import { canManageUsers } from '@/lib/admin/access';
import { getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';
import { getAdminSession } from '@/lib/admin/session';
import { listAdminUsers } from '@/lib/admin/users';

export default async function AdminUsersPage() {
  const session = await getAdminSession();

  // Defence in depth — middleware already gates this route to super admins.
  if (!session || !canManageUsers(session.role)) {
    redirect('/admin');
  }

  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const users = await listAdminUsers();

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.users.eyebrow}
        title={dictionary.users.title}
        description={dictionary.users.description}
      />

      <AdminUsersManager
        users={users}
        currentUserId={session.uid}
        locale={locale}
        dictionary={dictionary.users}
      />
    </>
  );
}
