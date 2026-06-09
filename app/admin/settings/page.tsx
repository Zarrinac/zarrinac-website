import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';

export default async function AdminSettingsPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const hasAdminCredentials = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.settings.eyebrow}
        title={dictionary.settings.title}
        description={dictionary.settings.description}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatusCard title={dictionary.settings.access}>
          <div className="flex items-center justify-between gap-4">
            <span>{dictionary.settings.credentials}</span>
            <span className="font-medium text-[#172026]">
              {hasAdminCredentials ? dictionary.common.configured : dictionary.common.missing}
            </span>
          </div>
        </AdminStatusCard>

        <AdminStatusCard title={dictionary.settings.data}>
          <div className="flex items-center justify-between gap-4">
            <span>{dictionary.settings.databaseUrl}</span>
            <span className="font-medium text-[#172026]">
              {hasDatabaseUrl ? dictionary.common.configured : dictionary.common.missing}
            </span>
          </div>
        </AdminStatusCard>
      </div>
    </>
  );
}
