import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { getAdminDashboardData } from '@/lib/admin/dashboard';
import { formatAdminNumber, getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';

export default async function AdminServiceCentersPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const dashboard = await getAdminDashboardData();
  const serviceCenters = dashboard.metrics.find((metric) => metric.key === 'serviceCenters');

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.serviceCenters.eyebrow}
        title={dictionary.serviceCenters.title}
        description={dictionary.serviceCenters.description}
      />

      <AdminStatusCard title={dictionary.serviceCenters.currentRecords}>
        <span className="text-3xl font-semibold text-[#172026]">
          {formatAdminNumber(serviceCenters?.value ?? null, locale)}
        </span>
      </AdminStatusCard>
    </>
  );
}
