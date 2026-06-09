'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Controller, useForm } from 'react-hook-form';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import gregorian from 'react-date-object/calendars/gregorian';
import persian from 'react-date-object/calendars/persian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import persian_en from 'react-date-object/locales/persian_en';
import persian_fa from 'react-date-object/locales/persian_fa';
import {
  createSurveySchema,
  surveyClarityValues,
  surveyFollowUpConsentValues,
  surveyProductCategoryValues,
  surveySatisfactionValues,
  surveyServiceChannelValues,
  surveyStaffBehaviorValues,
  surveyTimelinessValues,
  type SurveyFormValues,
  type SurveyParsedValues,
  type SurveyValidationCopy,
} from '@/lib/surveys/schema';
import { type Locale } from '@/i18n/routing';

type FieldCopy = {
  label: string;
  placeholder: string;
};

type ChoiceFieldCopy = {
  label: string;
};

type OptionMap<T extends string> = Record<T, string>;

export type SurveyFormCopy = {
  badge: string;
  title: string;
  description: string;
  helperText: string;
  requiredHint: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  referenceCodeLabel: string;
  errorMessage: string;
  serverUnavailable: string;
  fields: {
    fullName: FieldCopy;
    mobile: FieldCopy;
    phone: FieldCopy;
    email: FieldCopy;
    productCategory: FieldCopy;
    productModel: FieldCopy;
    referenceNumber: FieldCopy;
    serviceChannel: FieldCopy;
    serviceDate: FieldCopy;
    communicationClarity: ChoiceFieldCopy;
    staffBehavior: ChoiceFieldCopy;
    timeliness: ChoiceFieldCopy;
    overallSatisfaction: ChoiceFieldCopy;
    followUpConsent: ChoiceFieldCopy;
    overallFeedback: FieldCopy;
    improvementSuggestions: FieldCopy;
  };
  options: {
    productCategory: OptionMap<(typeof surveyProductCategoryValues)[number]>;
    serviceChannel: OptionMap<(typeof surveyServiceChannelValues)[number]>;
    communicationClarity: OptionMap<(typeof surveyClarityValues)[number]>;
    staffBehavior: OptionMap<(typeof surveyStaffBehaviorValues)[number]>;
    timeliness: OptionMap<(typeof surveyTimelinessValues)[number]>;
    overallSatisfaction: OptionMap<(typeof surveySatisfactionValues)[number]>;
    followUpConsent: OptionMap<(typeof surveyFollowUpConsentValues)[number]>;
  };
  validation: SurveyValidationCopy;
};

type SurveyFormProps = {
  copy: SurveyFormCopy;
  locale: Locale;
};

const baseInputClassName =
  'w-full rounded-2xl border bg-(--surface-muted-color) px-4 py-3 text-sm text-(--default-black-font) shadow-sm outline-none transition placeholder:text-(--text-subtle-color) focus:border-(--brand-color) focus:bg-(--surface-color) focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand-color)_18%,transparent)]';

function inputClassName(hasError: boolean) {
  return `${baseInputClassName} ${
    hasError
      ? 'border-red-400/80 ring-2 ring-red-400/15 focus:border-red-500 focus:ring-red-500/15'
      : 'border-(--border-color)'
  }`;
}

function toSolarDateObject(value: string, locale: Locale) {
  return new DateObject({
    date: value,
    format: 'YYYY-MM-DD',
    calendar: gregorian,
    locale: gregorian_en,
  }).convert(persian, locale === 'fa' ? persian_fa : persian_en);
}

type FormFieldProps = {
  id: keyof SurveyFormValues;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

function FormField({ id, label, error, required, children }: FormFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="flex items-center gap-1 text-sm font-semibold text-(--default-black-font)">
        {label}
        {required ? <span className="text-(--brand-color)">*</span> : null}
      </span>
      {children}
      <span className="min-h-5 text-xs text-red-500">{error ?? ' '}</span>
    </label>
  );
}

type RadioGroupFieldProps<T extends string> = {
  id: keyof SurveyFormValues;
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  error?: string;
  required?: boolean;
  onChange: (value: T) => void;
};

function RadioGroupField<T extends string>({
  id,
  label,
  value,
  options,
  labels,
  error,
  required,
  onChange,
}: RadioGroupFieldProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="flex items-center gap-1 text-sm font-semibold text-(--default-black-font)">
        {label}
        {required ? <span className="text-(--brand-color)">*</span> : null}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => {
          const checked = value === option;

          return (
            <label
              key={option}
              htmlFor={`${id}-${option}`}
              className={`flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-center text-sm transition ${
                checked
                  ? 'border-(--brand-color) bg-(--brand-color)/10 text-(--brand-color)'
                  : 'border-(--border-color) bg-(--surface-muted-color) text-(--default-black-font) hover:border-(--brand-color)'
              }`}
            >
              <input
                id={`${id}-${option}`}
                type="radio"
                name={String(id)}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span className="w-full text-center">{labels[option]}</span>
            </label>
          );
        })}
      </div>
      <span className="min-h-5 block text-xs text-red-500">{error ?? ' '}</span>
    </fieldset>
  );
}

export default function SurveyForm({ copy, locale }: SurveyFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SurveyFormValues, undefined, SurveyParsedValues>({
    resolver: zodResolver(createSurveySchema(copy.validation)),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      mobile: '',
      phone: '',
      email: '',
      productCategory: '',
      productModel: '',
      referenceNumber: '',
      serviceChannel: '',
      serviceDate: '',
      communicationClarity: '',
      staffBehavior: '',
      timeliness: '',
      overallSatisfaction: '',
      followUpConsent: '',
      overallFeedback: '',
      improvementSuggestions: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setReferenceCode(null);

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          locale,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        referenceCode?: string;
      } | null;

      if (!response.ok) {
        setServerError(
          response.status === 503
            ? copy.serverUnavailable
            : (payload?.message ?? copy.errorMessage),
        );
        return;
      }

      setReferenceCode(payload?.referenceCode ?? null);
      reset();
    } catch {
      setServerError(copy.errorMessage);
    }
  });

  return (
    <section className="rounded-4xl border border-(--border-color) bg-(--surface-color) p-6 shadow-(--panel-shadow) sm:p-8">
      <div className="flex flex-col gap-3 border-b border-(--border-color) pb-6">
        <span className="inline-flex w-fit rounded-full bg-(--brand-color)/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-(--brand-color) uppercase">
          {copy.badge}
        </span>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-(--default-black-font) sm:text-3xl">
            {copy.title}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-(--text-muted-color) sm:text-base">
            {copy.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-color) bg-(--surface-muted-color) px-4 py-3 text-xs text-(--text-muted-color)">
        <p>{copy.helperText}</p>
        <span className="font-semibold text-(--default-black-font)">{copy.requiredHint}</span>
      </div>

      {referenceCode ? (
        <div className="mt-5 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          <p className="font-semibold">{copy.successMessage}</p>
          <p className="mt-1">
            {copy.referenceCodeLabel}: <span className="font-bold">{referenceCode}</span>
          </p>
        </div>
      ) : null}

      {serverError ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          <ErrorOutlineOutlinedIcon fontSize="small" className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      ) : null}

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            id="fullName"
            label={copy.fields.fullName.label}
            error={errors.fullName?.message}
            required
          >
            <input
              id="fullName"
              type="text"
              className={inputClassName(Boolean(errors.fullName))}
              placeholder={copy.fields.fullName.placeholder}
              autoComplete="name"
              {...register('fullName')}
            />
          </FormField>

          <FormField
            id="mobile"
            label={copy.fields.mobile.label}
            error={errors.mobile?.message}
            required
          >
            <input
              id="mobile"
              type="tel"
              dir="ltr"
              className={inputClassName(Boolean(errors.mobile))}
              placeholder={copy.fields.mobile.placeholder}
              autoComplete="tel"
              {...register('mobile')}
            />
          </FormField>

          <FormField id="phone" label={copy.fields.phone.label} error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              className={inputClassName(Boolean(errors.phone))}
              placeholder={copy.fields.phone.placeholder}
              autoComplete="tel-national"
              {...register('phone')}
            />
          </FormField>

          <FormField id="email" label={copy.fields.email.label} error={errors.email?.message}>
            <input
              id="email"
              type="email"
              dir="ltr"
              className={inputClassName(Boolean(errors.email))}
              placeholder={copy.fields.email.placeholder}
              autoComplete="email"
              {...register('email')}
            />
          </FormField>

          <FormField
            id="productCategory"
            label={copy.fields.productCategory.label}
            error={errors.productCategory?.message}
            required
          >
            <select
              id="productCategory"
              className={inputClassName(Boolean(errors.productCategory))}
              defaultValue=""
              {...register('productCategory')}
            >
              <option value="">{copy.fields.productCategory.placeholder}</option>
              {surveyProductCategoryValues.map((value) => (
                <option key={value} value={value}>
                  {copy.options.productCategory[value]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="serviceChannel"
            label={copy.fields.serviceChannel.label}
            error={errors.serviceChannel?.message}
            required
          >
            <select
              id="serviceChannel"
              className={inputClassName(Boolean(errors.serviceChannel))}
              defaultValue=""
              {...register('serviceChannel')}
            >
              <option value="">{copy.fields.serviceChannel.placeholder}</option>
              {surveyServiceChannelValues.map((value) => (
                <option key={value} value={value}>
                  {copy.options.serviceChannel[value]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="productModel"
            label={copy.fields.productModel.label}
            error={errors.productModel?.message}
          >
            <input
              id="productModel"
              type="text"
              className={inputClassName(Boolean(errors.productModel))}
              placeholder={copy.fields.productModel.placeholder}
              {...register('productModel')}
            />
          </FormField>

          <FormField
            id="referenceNumber"
            label={copy.fields.referenceNumber.label}
            error={errors.referenceNumber?.message}
          >
            <input
              id="referenceNumber"
              type="text"
              dir="ltr"
              className={inputClassName(Boolean(errors.referenceNumber))}
              placeholder={copy.fields.referenceNumber.placeholder}
              {...register('referenceNumber')}
            />
          </FormField>

          <FormField
            id="serviceDate"
            label={copy.fields.serviceDate.label}
            error={errors.serviceDate?.message}
          >
            <Controller
              control={control}
              name="serviceDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? toSolarDateObject(field.value, locale) : null}
                  onChange={(value) => {
                    if (!value || Array.isArray(value)) {
                      field.onChange('');
                      return;
                    }

                    field.onChange(value.convert(gregorian, gregorian_en).format('YYYY-MM-DD'));
                  }}
                  calendar={persian}
                  locale={locale === 'fa' ? persian_fa : persian_en}
                  format="YYYY/MM/DD"
                  editable={false}
                  inputClass={inputClassName(Boolean(errors.serviceDate))}
                  containerClassName="w-full"
                  calendarPosition={locale === 'fa' ? 'bottom-right' : 'bottom-left'}
                  placeholder={copy.fields.serviceDate.placeholder}
                />
              )}
            />
          </FormField>
        </div>

        <div className="space-y-4 rounded-3xl border border-(--border-color) bg-(--surface-muted-color) p-5 sm:p-6">
          <Controller
            control={control}
            name="communicationClarity"
            render={({ field }) => (
              <RadioGroupField
                id="communicationClarity"
                label={copy.fields.communicationClarity.label}
                value={field.value}
                options={surveyClarityValues}
                labels={copy.options.communicationClarity}
                error={errors.communicationClarity?.message}
                required
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="staffBehavior"
            render={({ field }) => (
              <RadioGroupField
                id="staffBehavior"
                label={copy.fields.staffBehavior.label}
                value={field.value}
                options={surveyStaffBehaviorValues}
                labels={copy.options.staffBehavior}
                error={errors.staffBehavior?.message}
                required
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="timeliness"
            render={({ field }) => (
              <RadioGroupField
                id="timeliness"
                label={copy.fields.timeliness.label}
                value={field.value}
                options={surveyTimelinessValues}
                labels={copy.options.timeliness}
                error={errors.timeliness?.message}
                required
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="overallSatisfaction"
            render={({ field }) => (
              <RadioGroupField
                id="overallSatisfaction"
                label={copy.fields.overallSatisfaction.label}
                value={field.value}
                options={surveySatisfactionValues}
                labels={copy.options.overallSatisfaction}
                error={errors.overallSatisfaction?.message}
                required
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="followUpConsent"
            render={({ field }) => (
              <RadioGroupField
                id="followUpConsent"
                label={copy.fields.followUpConsent.label}
                value={field.value}
                options={surveyFollowUpConsentValues}
                labels={copy.options.followUpConsent}
                error={errors.followUpConsent?.message}
                required
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid gap-5">
          <FormField
            id="overallFeedback"
            label={copy.fields.overallFeedback.label}
            error={errors.overallFeedback?.message}
            required
          >
            <textarea
              id="overallFeedback"
              rows={5}
              className={`${inputClassName(Boolean(errors.overallFeedback))} resize-y`}
              placeholder={copy.fields.overallFeedback.placeholder}
              {...register('overallFeedback')}
            />
          </FormField>

          <FormField
            id="improvementSuggestions"
            label={copy.fields.improvementSuggestions.label}
            error={errors.improvementSuggestions?.message}
          >
            <textarea
              id="improvementSuggestions"
              rows={4}
              className={`${inputClassName(Boolean(errors.improvementSuggestions))} resize-y`}
              placeholder={copy.fields.improvementSuggestions.placeholder}
              {...register('improvementSuggestions')}
            />
          </FormField>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-(--brand-color) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--brand-color-dark) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isSubmitting ? copy.submittingLabel : copy.submitLabel}
        </button>
      </form>
    </section>
  );
}
