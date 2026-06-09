import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { ComplaintTable, SubmissionSection } from '@/components/admin/AdminSubmissionTables';
import { formatAdminNumber, getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';
import { getAdminComplaintsData } from '@/lib/admin/submissions';

export default async function AdminComplaintsPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const complaints = await getAdminComplaintsData();

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.complaints.eyebrow}
        title={dictionary.complaints.title}
        description={dictionary.complaints.description}
      />

      {!complaints.databaseReady ? (
        <div className="mb-6 rounded-lg border border-[#f0d7a1] bg-[#fff8e7] px-4 py-3 text-sm text-[#76520b]">
          {dictionary.submissions.databaseUnavailable}
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <AdminStatusCard title={dictionary.metrics.complaints}>
          <span className="text-3xl font-semibold text-[#172026]">
            {formatAdminNumber(complaints.complaintCount, locale)}
          </span>
        </AdminStatusCard>
      </div>

      <SubmissionSection
        title={dictionary.submissions.recentComplaints}
        count={complaints.complaintCount}
        limit={complaints.limit}
        locale={locale}
        dictionary={dictionary}
        emptyMessage={dictionary.submissions.emptyComplaints}
      >
        <ComplaintTable
          complaints={complaints.complaints}
          locale={locale}
          dictionary={dictionary}
        />
      </SubmissionSection>
    </>
  );
}
