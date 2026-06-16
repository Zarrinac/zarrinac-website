import type { ReactNode } from 'react';
import type { AdminComplaintSubmission, AdminSurveySubmission } from '@/lib/admin/submissions';
import {
  type AdminLocale,
  type getAdminDictionary,
  adminCategoryLabels,
  formatAdminDate,
  formatAdminDateTime,
  formatAdminNumber,
  getAdminValueLabel,
} from '@/lib/admin/i18n';
import AdminPrintButton from '@/components/admin/AdminPrintButton';
import SubmissionDetails from '@/components/admin/SubmissionDetails';

type Dictionary = ReturnType<typeof getAdminDictionary>;

type DetailField = {
  label: string;
  value: ReactNode;
};

function fallback(value: string | null | undefined, dictionary: Dictionary) {
  return value && value.trim().length > 0 ? value : dictionary.common.notAvailable;
}

function recentCopy(dictionary: Dictionary, count: number, locale: AdminLocale) {
  return dictionary.submissions.showingRecent.replace('{count}', formatAdminNumber(count, locale));
}

function StatusBadge({ status, locale }: { status: string; locale: AdminLocale }) {
  return (
    <span className="inline-flex rounded-md bg-[#e5fbf8] px-2.5 py-1 text-xs font-semibold text-[#007f7b]">
      {getAdminValueLabel(locale, 'status', status)}
    </span>
  );
}

function SiteBadge({ site, locale }: { site: string; locale: AdminLocale }) {
  const isZarrinac = site === 'zarrinac';
  return (
    <span
      className={[
        'inline-flex rounded-md px-2.5 py-1 text-xs font-semibold',
        isZarrinac ? 'bg-[#fdeef0] text-[#b4232c]' : 'bg-[#eaf2ff] text-[#1f5fbf]',
      ].join(' ')}
    >
      {getAdminValueLabel(locale, 'site', site)}
    </span>
  );
}

function ReferenceCell({
  referenceCode,
  isUnread,
  newLabel,
}: {
  referenceCode: string;
  isUnread: boolean;
  newLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {isUnread ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fdecec] px-2 py-0.5 text-[10px] font-bold text-[#e5484d]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" />
          {newLabel}
        </span>
      ) : null}
      {referenceCode}
    </span>
  );
}

function DetailGrid({ fields }: { fields: DetailField[] }) {
  return (
    <dl className="mt-3 grid w-full gap-3 rounded-md border border-[#dbe3e8] bg-[#f8fafb] p-4 sm:grid-cols-2 xl:grid-cols-4">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7b86]">
            {field.label}
          </dt>
          <dd className="mt-1 wrap-break-word text-sm text-[#172026]">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SubmissionSection({
  title,
  count,
  limit,
  locale,
  dictionary,
  emptyMessage,
  children,
}: {
  title: string;
  count: number | null;
  limit: number;
  locale: AdminLocale;
  dictionary: Dictionary;
  emptyMessage: string;
  children: ReactNode;
}) {
  const visibleCount = count === null ? 0 : Math.min(count, limit);

  return (
    <section className="rounded-lg border border-[#dbe3e8] bg-white shadow-[0_10px_28px_rgba(23,32,38,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4ebef] px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold text-[#172026]">{title}</h3>
          <p className="mt-1 text-sm text-[#60717c]">
            {count === null
              ? dictionary.common.notAvailable
              : recentCopy(dictionary, visibleCount, locale)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {visibleCount > 0 ? (
            <AdminPrintButton mode="table" label={dictionary.submissions.printTable} />
          ) : null}
          <span className="rounded-md border border-[#d4dde3] bg-[#f8fafb] px-3 py-2 text-sm font-semibold text-[#172026]">
            {formatAdminNumber(count, locale)}
          </span>
        </div>
      </div>
      {visibleCount > 0 ? (
        children
      ) : (
        <p className="px-5 py-6 text-sm text-[#60717c]">{emptyMessage}</p>
      )}
    </section>
  );
}

export function ComplaintTable({
  complaints,
  locale,
  dictionary,
}: {
  complaints: AdminComplaintSubmission[];
  locale: AdminLocale;
  dictionary: Dictionary;
}) {
  const fields = dictionary.submissions.fields;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-256 border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#e4ebef] bg-[#f8fafb] text-[#52636f]">
            <th className="px-5 py-3 text-start font-semibold">{fields.referenceCode}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.status}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.source}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.fullName}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.phone}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.productCategory}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.complaintTopic}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.submittedAt}</th>
          </tr>
        </thead>
        {complaints.map((complaint) => (
          <tbody
            key={complaint.id}
            data-submission-id={complaint.id}
            className="admin-submission border-b border-[#eef2f4] last:border-0"
          >
            <tr className="align-top">
              <td className="px-5 py-4 font-semibold text-[#172026]">
                <ReferenceCell
                  referenceCode={complaint.referenceCode}
                  isUnread={complaint.readAt === null}
                  newLabel={dictionary.submissions.newBadge}
                />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={complaint.status} locale={locale} />
              </td>
              <td className="px-5 py-4">
                <SiteBadge site={complaint.site} locale={locale} />
              </td>
              <td className="px-5 py-4 text-[#172026]">{complaint.fullName}</td>
              <td className="px-5 py-4 text-[#52636f]">{complaint.phone}</td>
              <td className="px-5 py-4 text-[#52636f]">
                {adminCategoryLabels[locale][complaint.productCategory] ??
                  complaint.productCategory}
              </td>
              <td className="px-5 py-4 text-[#52636f]">
                {getAdminValueLabel(locale, 'complaintTopic', complaint.complaintTopic)}
              </td>
              <td className="px-5 py-4 text-[#52636f]">
                {formatAdminDateTime(complaint.createdAt, locale)}
              </td>
            </tr>
            <tr>
              <td colSpan={8} className="px-5 pb-5">
                <SubmissionDetails
                  type="complaint"
                  id={complaint.id}
                  isRead={complaint.readAt !== null}
                  summaryLabel={dictionary.submissions.openDetails}
                >
                  <div className="admin-no-print mt-3 flex justify-end">
                    <AdminPrintButton mode="single" label={dictionary.submissions.print} />
                  </div>
                  <DetailGrid
                    fields={[
                      { label: fields.referenceCode, value: complaint.referenceCode },
                      {
                        label: fields.source,
                        value: getAdminValueLabel(locale, 'site', complaint.site),
                      },
                      {
                        label: fields.status,
                        value: getAdminValueLabel(locale, 'status', complaint.status),
                      },
                      { label: fields.language, value: complaint.locale },
                      { label: fields.fullName, value: complaint.fullName },
                      { label: fields.phone, value: complaint.phone },
                      { label: fields.email, value: fallback(complaint.email, dictionary) },
                      {
                        label: fields.productCategory,
                        value:
                          adminCategoryLabels[locale][complaint.productCategory] ??
                          complaint.productCategory,
                      },
                      { label: fields.productModel, value: complaint.productModel },
                      {
                        label: fields.invoiceNumber,
                        value: fallback(complaint.invoiceNumber, dictionary),
                      },
                      {
                        label: fields.referenceNumber,
                        value: fallback(complaint.referenceNumber, dictionary),
                      },
                      {
                        label: fields.purchaseDate,
                        value: formatAdminDate(complaint.purchaseDate, locale),
                      },
                      {
                        label: fields.complaintTopic,
                        value: getAdminValueLabel(
                          locale,
                          'complaintTopic',
                          complaint.complaintTopic,
                        ),
                      },
                      {
                        label: fields.preferredContactMethod,
                        value: getAdminValueLabel(
                          locale,
                          'preferredContactMethod',
                          complaint.preferredContactMethod,
                        ),
                      },
                      { label: fields.city, value: complaint.city },
                      { label: fields.address, value: fallback(complaint.address, dictionary) },
                      { label: fields.description, value: complaint.description },
                      {
                        label: fields.submittedAt,
                        value: formatAdminDateTime(complaint.createdAt, locale),
                      },
                      {
                        label: fields.updatedAt,
                        value: formatAdminDateTime(complaint.updatedAt, locale),
                      },
                    ]}
                  />
                </SubmissionDetails>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export function SurveyTable({
  surveys,
  locale,
  dictionary,
}: {
  surveys: AdminSurveySubmission[];
  locale: AdminLocale;
  dictionary: Dictionary;
}) {
  const fields = dictionary.submissions.fields;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-256 border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#e4ebef] bg-[#f8fafb] text-[#52636f]">
            <th className="px-5 py-3 text-start font-semibold">{fields.referenceCode}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.status}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.source}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.fullName}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.mobile}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.serviceChannel}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.overallSatisfaction}</th>
            <th className="px-5 py-3 text-start font-semibold">{fields.submittedAt}</th>
          </tr>
        </thead>
        {surveys.map((survey) => (
          <tbody
            key={survey.id}
            data-submission-id={survey.id}
            className="admin-submission border-b border-[#eef2f4] last:border-0"
          >
            <tr className="align-top">
              <td className="px-5 py-4 font-semibold text-[#172026]">
                <ReferenceCell
                  referenceCode={survey.referenceCode}
                  isUnread={survey.readAt === null}
                  newLabel={dictionary.submissions.newBadge}
                />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={survey.status} locale={locale} />
              </td>
              <td className="px-5 py-4">
                <SiteBadge site={survey.site} locale={locale} />
              </td>
              <td className="px-5 py-4 text-[#172026]">{survey.fullName}</td>
              <td className="px-5 py-4 text-[#52636f]">{survey.mobile}</td>
              <td className="px-5 py-4 text-[#52636f]">
                {getAdminValueLabel(locale, 'serviceChannel', survey.serviceChannel)}
              </td>
              <td className="px-5 py-4 text-[#52636f]">
                {getAdminValueLabel(locale, 'satisfaction', survey.overallSatisfaction)}
              </td>
              <td className="px-5 py-4 text-[#52636f]">
                {formatAdminDateTime(survey.createdAt, locale)}
              </td>
            </tr>
            <tr>
              <td colSpan={8} className="px-5 pb-5">
                <SubmissionDetails
                  type="survey"
                  id={survey.id}
                  isRead={survey.readAt !== null}
                  summaryLabel={dictionary.submissions.openDetails}
                >
                  <div className="admin-no-print mt-3 flex justify-end">
                    <AdminPrintButton mode="single" label={dictionary.submissions.print} />
                  </div>
                  <DetailGrid
                    fields={[
                      { label: fields.referenceCode, value: survey.referenceCode },
                      {
                        label: fields.source,
                        value: getAdminValueLabel(locale, 'site', survey.site),
                      },
                      {
                        label: fields.status,
                        value: getAdminValueLabel(locale, 'status', survey.status),
                      },
                      { label: fields.language, value: survey.locale },
                      { label: fields.fullName, value: survey.fullName },
                      { label: fields.mobile, value: survey.mobile },
                      { label: fields.phone, value: fallback(survey.phone, dictionary) },
                      { label: fields.email, value: fallback(survey.email, dictionary) },
                      {
                        label: fields.productCategory,
                        value:
                          adminCategoryLabels[locale][survey.productCategory] ??
                          survey.productCategory,
                      },
                      {
                        label: fields.productModel,
                        value: fallback(survey.productModel, dictionary),
                      },
                      {
                        label: fields.referenceNumber,
                        value: fallback(survey.referenceNumber, dictionary),
                      },
                      {
                        label: fields.serviceChannel,
                        value: getAdminValueLabel(locale, 'serviceChannel', survey.serviceChannel),
                      },
                      {
                        label: fields.serviceDate,
                        value: formatAdminDate(survey.serviceDate, locale),
                      },
                      {
                        label: fields.communicationClarity,
                        value: getAdminValueLabel(
                          locale,
                          'yesNoPartial',
                          survey.communicationClarity,
                        ),
                      },
                      {
                        label: fields.staffBehavior,
                        value: getAdminValueLabel(locale, 'staffBehavior', survey.staffBehavior),
                      },
                      {
                        label: fields.timeliness,
                        value: getAdminValueLabel(locale, 'yesNoPartial', survey.timeliness),
                      },
                      {
                        label: fields.overallSatisfaction,
                        value: getAdminValueLabel(
                          locale,
                          'satisfaction',
                          survey.overallSatisfaction,
                        ),
                      },
                      {
                        label: fields.followUpConsent,
                        value: getAdminValueLabel(locale, 'yesNoPartial', survey.followUpConsent),
                      },
                      { label: fields.overallFeedback, value: survey.overallFeedback },
                      {
                        label: fields.improvementSuggestions,
                        value: fallback(survey.improvementSuggestions, dictionary),
                      },
                      {
                        label: fields.submittedAt,
                        value: formatAdminDateTime(survey.createdAt, locale),
                      },
                      {
                        label: fields.updatedAt,
                        value: formatAdminDateTime(survey.updatedAt, locale),
                      },
                    ]}
                  />
                </SubmissionDetails>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
