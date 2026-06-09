import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { getAdminDashboardData } from '@/lib/admin/dashboard';
import { adminCategoryLabels, formatAdminNumber, getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';

export default async function AdminProductsPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const dashboard = await getAdminDashboardData();
  const productMetric = dashboard.metrics.find((metric) => metric.key === 'products');

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.products.eyebrow}
        title={dictionary.products.title}
        description={dictionary.products.description}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminStatusCard title={dictionary.products.currentCatalog}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span>{dictionary.metrics.products}</span>
              <span className="font-medium text-[#172026]">
                {formatAdminNumber(productMetric?.value ?? null, locale)}
              </span>
            </div>
            {dashboard.categoryMetrics.map((category) => (
              <div key={category.label} className="flex items-center justify-between gap-4">
                <span>{adminCategoryLabels[locale][category.label] ?? category.label}</span>
                <span className="font-medium text-[#172026]">
                  {formatAdminNumber(category.value, locale)}
                </span>
              </div>
            ))}
          </div>
        </AdminStatusCard>

        <AdminStatusCard title={dictionary.products.nextBuildTarget}>
          <p>{dictionary.products.nextBuildCopy}</p>
        </AdminStatusCard>
      </div>
    </>
  );
}
