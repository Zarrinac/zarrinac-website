import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { getAdminDashboardData } from '@/lib/admin/dashboard';
import {
  adminCategoryLabels,
  formatAdminDateTime,
  formatAdminNumber,
  getAdminDictionary,
} from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';

export default async function AdminDashboardPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const dashboard = await getAdminDashboardData();

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.dashboard.eyebrow}
        title={dictionary.dashboard.title}
        description={dictionary.dashboard.description}
      />

      {!dashboard.databaseReady ? (
        <div className="mb-6 rounded-lg border border-[#f0d7a1] bg-[#fff8e7] px-4 py-3 text-sm text-[#76520b]">
          {dictionary.dashboard.databaseUnavailable}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <Link
            key={metric.key}
            href={metric.href}
            className="rounded-lg border border-[#dbe3e8] bg-white p-5 shadow-[0_10px_28px_rgba(23,32,38,0.06)] transition hover:border-[#00a8a3]"
          >
            <span className="text-sm font-medium text-[#5d6d78]">
              {dictionary.metrics[metric.key]}
            </span>
            <strong className="mt-3 block text-3xl font-semibold text-[#172026]">
              {formatAdminNumber(metric.value, locale)}
            </strong>
          </Link>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AdminStatusCard title={dictionary.dashboard.productCategories}>
          {dashboard.categoryMetrics.length > 0 ? (
            <div className="space-y-3">
              {dashboard.categoryMetrics.map((category) => (
                <div key={category.label} className="flex items-center justify-between gap-4">
                  <span className="font-medium text-[#172026]">
                    {adminCategoryLabels[locale][category.label] ?? category.label}
                  </span>
                  <span>{formatAdminNumber(category.value, locale)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>{dictionary.dashboard.noCategoryData}</p>
          )}
        </AdminStatusCard>

        <AdminStatusCard title={dictionary.dashboard.foundation}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span>{dictionary.common.route}</span>
              <span className="font-medium text-[#172026]">/admin</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>{dictionary.common.indexing}</span>
              <span className="font-medium text-[#172026]">noindex</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>{dictionary.common.lastCheck}</span>
              <span className="font-medium text-[#172026]">
                {formatAdminDateTime(dashboard.lastCheckedAt, locale)}
              </span>
            </div>
          </div>
        </AdminStatusCard>
      </div>
    </>
  );
}
