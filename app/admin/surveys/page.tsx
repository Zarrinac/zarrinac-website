import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatusCard from '@/components/admin/AdminStatusCard';
import { SubmissionSection, SurveyTable } from '@/components/admin/AdminSubmissionTables';
import { formatAdminNumber, getAdminDictionary } from '@/lib/admin/i18n';
import { getAdminLocale } from '@/lib/admin/i18n.server';
import { getAdminSurveysData } from '@/lib/admin/submissions';

export default async function AdminSurveysPage() {
  const locale = await getAdminLocale();
  const dictionary = getAdminDictionary(locale);
  const surveys = await getAdminSurveysData();

  return (
    <>
      <AdminPageHeader
        eyebrow={dictionary.surveys.eyebrow}
        title={dictionary.surveys.title}
        description={dictionary.surveys.description}
      />

      {!surveys.databaseReady ? (
        <div className="mb-6 rounded-lg border border-[#f0d7a1] bg-[#fff8e7] px-4 py-3 text-sm text-[#76520b]">
          {dictionary.submissions.databaseUnavailable}
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <AdminStatusCard title={dictionary.metrics.surveys}>
          <span className="text-3xl font-semibold text-[#172026]">
            {formatAdminNumber(surveys.surveyCount, locale)}
          </span>
        </AdminStatusCard>
      </div>

      <SubmissionSection
        title={dictionary.submissions.recentSurveys}
        count={surveys.surveyCount}
        limit={surveys.limit}
        locale={locale}
        dictionary={dictionary}
        emptyMessage={dictionary.submissions.emptySurveys}
      >
        <SurveyTable surveys={surveys.surveys} locale={locale} dictionary={dictionary} />
      </SubmissionSection>
    </>
  );
}
