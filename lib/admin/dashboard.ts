import { prisma } from '@/lib/db';
import type { AdminMetricKey } from '@/lib/admin/i18n';

export type AdminMetric = {
  key: AdminMetricKey;
  value: number | null;
  href: string;
};

export type AdminCategoryMetric = {
  label: string;
  value: number;
};

export type AdminDashboardData = {
  databaseReady: boolean;
  metrics: AdminMetric[];
  categoryMetrics: AdminCategoryMetric[];
  lastCheckedAt: string;
};

const emptyMetrics: AdminMetric[] = [
  { key: 'products', value: null, href: '/admin/products' },
  { key: 'complaints', value: null, href: '/admin/complaints' },
  { key: 'surveys', value: null, href: '/admin/surveys' },
  { key: 'serviceCenters', value: null, href: '/admin/service-centers' },
];

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const lastCheckedAt = new Date().toISOString();

  if (!prisma) {
    console.error('[admin/dashboard] Prisma client is unavailable. Check DATABASE_URL at runtime.');

    return {
      databaseReady: false,
      metrics: emptyMetrics,
      categoryMetrics: [],
      lastCheckedAt,
    };
  }

  try {
    const [
      productCount,
      complaintCount,
      surveyCount,
      serviceRepresentativeCount,
      productCategoryCounts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.complaintSubmission.count(),
      prisma.surveySubmission.count(),
      prisma.serviceRepresentative.count(),
      prisma.product.groupBy({
        by: ['category'],
        _count: {
          _all: true,
        },
        orderBy: {
          category: 'asc',
        },
      }),
    ]);

    return {
      databaseReady: true,
      metrics: [
        { key: 'products', value: productCount, href: '/admin/products' },
        { key: 'complaints', value: complaintCount, href: '/admin/complaints' },
        { key: 'surveys', value: surveyCount, href: '/admin/surveys' },
        {
          key: 'serviceCenters',
          value: serviceRepresentativeCount,
          href: '/admin/service-centers',
        },
      ],
      categoryMetrics: productCategoryCounts.map((item) => ({
        label: item.category,
        value: item._count._all,
      })),
      lastCheckedAt,
    };
  } catch (error) {
    console.error('[admin/dashboard] Unable to load dashboard data.', error);

    return {
      databaseReady: false,
      metrics: emptyMetrics,
      categoryMetrics: [],
      lastCheckedAt,
    };
  }
}
