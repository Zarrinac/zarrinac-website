'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Controller, useForm, useWatch } from 'react-hook-form';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import gregorian from 'react-date-object/calendars/gregorian';
import persian from 'react-date-object/calendars/persian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import persian_en from 'react-date-object/locales/persian_en';
import persian_fa from 'react-date-object/locales/persian_fa';
import {
  complaintCategoryValues,
  complaintTopicValues,
  createComplaintSchema,
  preferredContactMethodValues,
  type ComplaintFormValues,
  type ComplaintParsedValues,
  type ComplaintValidationCopy,
} from '@/lib/complaints/schema';
import { type Locale } from '@/i18n/routing';
import { normalizeSearchText, getLocalizedLabel, type IranProvince } from '@/lib/iranLocations';

type FieldCopy = {
  label: string;
  placeholder: string;
};

type SearchFieldCopy = FieldCopy & {
  noOptionsText: string;
};

type OptionMap<T extends string> = Record<T, string>;

export type ComplaintFormCopy = {
  badge: string;
  title: string;
  description: string;
  helperText: string;
  requiredHint: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  trackingCodeLabel: string;
  errorMessage: string;
  serverUnavailable: string;
  fields: {
    fullName: FieldCopy;
    phone: FieldCopy;
    email: FieldCopy;
    productCategory: FieldCopy;
    productModel: FieldCopy;
    invoiceNumber: FieldCopy;
    referenceNumber: FieldCopy;
    purchaseDate: FieldCopy;
    complaintTopic: FieldCopy;
    preferredContactMethod: FieldCopy;
    province: SearchFieldCopy;
    city: SearchFieldCopy;
    address: FieldCopy;
    description: FieldCopy;
  };
  options: {
    complaintCategory: OptionMap<(typeof complaintCategoryValues)[number]>;
    complaintTopic: OptionMap<(typeof complaintTopicValues)[number]>;
    preferredContactMethod: OptionMap<(typeof preferredContactMethodValues)[number]>;
  };
  validation: ComplaintValidationCopy;
};

type ComplaintFormProps = {
  copy: ComplaintFormCopy;
  locale: Locale;
  provinces: IranProvince[];
};

const baseInputClassName =
  'w-full rounded-2xl border bg-(--surface-muted-color) px-4 py-3 text-sm text-(--default-black-font) shadow-sm outline-none transition placeholder:text-(--text-subtle-color) focus:border-(--brand-color) focus:bg-(--surface-color) focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand-color)_18%,transparent)]';

type SearchOption = {
  id: string;
  label: string;
  searchValue: string;
};

function inputClassName(hasError: boolean) {
  return `${baseInputClassName} ${
    hasError
      ? 'border-red-400/80 ring-2 ring-red-400/15 focus:border-red-500 focus:ring-red-500/15'
      : 'border-(--border-color)'
  }`;
}

type FormFieldProps = {
  id: keyof ComplaintFormValues;
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

function createSearchOptions(locale: Locale, provinces: IranProvince[]) {
  return provinces.map((province) => ({
    id: province.id,
    label: getLocalizedLabel(province.labels, locale),
    searchValue: normalizeSearchText(
      `${province.labels.fa} ${getLocalizedLabel(province.labels, 'en')} ${province.id.replace(/-/g, ' ')}`,
    ),
  }));
}

function createCityOptions(locale: Locale, provinceId: string, provinces: IranProvince[]) {
  const province = provinces.find((item) => item.id === provinceId);

  if (!province) {
    return [];
  }

  return province.cities.map((city) => ({
    id: city.id,
    label: getLocalizedLabel(city.labels, locale),
    searchValue: normalizeSearchText(
      `${city.labels.fa} ${getLocalizedLabel(city.labels, 'en')} ${city.id.replace(/-/g, ' ')}`,
    ),
  }));
}

function filterSearchOptions(options: SearchOption[], inputValue: string) {
  const query = normalizeSearchText(inputValue);

  if (!query) {
    return options;
  }

  return options.filter((option) => option.searchValue.includes(query));
}

function autocompleteSx(hasError: boolean) {
  return {
    width: '100%',
    fontFamily: 'inherit',
    '& .MuiOutlinedInput-root': {
      minHeight: 52,
      borderRadius: '1rem',
      backgroundColor: 'var(--surface-muted-color)',
      color: 'var(--default-black-font)',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
      paddingInlineEnd: '12px !important',
      fontFamily: 'inherit',
      '& fieldset': {
        borderColor: hasError ? 'rgba(248, 113, 113, 0.8)' : 'var(--border-color)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--brand-color)',
      },
      '&.Mui-focused': {
        backgroundColor: 'var(--surface-color)',
      },
      '&.Mui-focused fieldset': {
        borderColor: hasError ? 'rgb(239, 68, 68)' : 'var(--brand-color)',
        boxShadow: hasError
          ? '0 0 0 4px rgba(239, 68, 68, 0.15)'
          : '0 0 0 4px color-mix(in srgb, var(--brand-color) 18%, transparent)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'var(--default-black-font)',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      padding: '0 !important',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'var(--text-subtle-color)',
      opacity: 1,
    },
    '& .MuiSvgIcon-root': {
      color: 'var(--text-muted-color)',
    },
  } as const;
}

const autocompleteDropdownSx = {
  border: '1px solid var(--border-color)',
  borderRadius: '1rem',
  backgroundColor: 'var(--surface-color)',
  color: 'var(--default-black-font)',
  boxShadow: 'var(--panel-shadow)',
  fontFamily: 'inherit',
  '& .MuiAutocomplete-listbox': {
    paddingBlock: '0.5rem',
    fontFamily: 'inherit',
  },
  '& .MuiAutocomplete-option': {
    minHeight: 42,
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },
  '& .MuiAutocomplete-noOptions': {
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },
} as const;

function toSolarDateObject(value: string, locale: Locale) {
  return new DateObject({
    date: value,
    format: 'YYYY-MM-DD',
    calendar: gregorian,
    locale: gregorian_en,
  }).convert(persian, locale === 'fa' ? persian_fa : persian_en);
}

export default function ComplaintForm({ copy, locale, provinces }: ComplaintFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormValues, undefined, ComplaintParsedValues>({
    resolver: zodResolver(createComplaintSchema(copy.validation)),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      productCategory: '',
      productModel: '',
      invoiceNumber: '',
      referenceNumber: '',
      purchaseDate: '',
      province: '',
      complaintTopic: '',
      preferredContactMethod: '',
      city: '',
      address: '',
      description: '',
    },
  });

  const provinceOptions = createSearchOptions(locale, provinces);
  const selectedProvinceId = useWatch({ control, name: 'province' });
  const cityOptions = createCityOptions(locale, selectedProvinceId, provinces);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setTrackingCode(null);

    try {
      const response = await fetch('/api/complaints', {
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
        trackingCode?: string;
      } | null;

      if (!response.ok) {
        setServerError(
          response.status === 503
            ? copy.serverUnavailable
            : (payload?.message ?? copy.errorMessage),
        );
        return;
      }

      const nextTrackingCode = payload?.trackingCode ?? payload?.referenceCode ?? null;
      setTrackingCode(nextTrackingCode);
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
        <p className="font-semibold text-(--default-black-font)">{copy.requiredHint}</p>
      </div>

      {trackingCode ? (
        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-700 dark:text-emerald-200">
          <p className="font-semibold">{copy.successMessage}</p>
          <p className="mt-1">
            {copy.trackingCodeLabel}: <span dir="ltr">{trackingCode}</span>
          </p>
        </div>
      ) : null}

      {serverError ? (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-700 dark:text-red-200">
          <div className="flex items-start gap-3">
            <ErrorOutlineOutlinedIcon fontSize="small" />
            <p>{serverError}</p>
          </div>
        </div>
      ) : null}

      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
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
            id="phone"
            label={copy.fields.phone.label}
            error={errors.phone?.message}
            required
          >
            <input
              id="phone"
              type="tel"
              dir="ltr"
              className={inputClassName(Boolean(errors.phone))}
              placeholder={copy.fields.phone.placeholder}
              autoComplete="tel"
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

          <Controller
            control={control}
            name="province"
            render={({ field }) => (
              <FormField
                id="province"
                label={copy.fields.province.label}
                error={errors.province?.message}
                required
              >
                <Autocomplete<SearchOption, false, false, false>
                  options={provinceOptions}
                  value={provinceOptions.find((option) => option.id === field.value) ?? null}
                  onChange={(_, option) => {
                    field.onChange(option?.id ?? '');
                    setValue('city', '', { shouldValidate: true });
                  }}
                  autoHighlight
                  openOnFocus
                  disablePortal
                  noOptionsText={copy.fields.province.noOptionsText}
                  filterOptions={(options, state) => filterSearchOptions(options, state.inputValue)}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="province"
                      placeholder={copy.fields.province.placeholder}
                      error={Boolean(errors.province)}
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: autocompleteDropdownSx,
                    },
                  }}
                  sx={autocompleteSx(Boolean(errors.province))}
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <FormField
                id="city"
                label={copy.fields.city.label}
                error={errors.city?.message}
                required
              >
                <Autocomplete<SearchOption, false, false, false>
                  options={cityOptions}
                  value={cityOptions.find((option) => option.id === field.value) ?? null}
                  onChange={(_, option) => field.onChange(option?.id ?? '')}
                  autoHighlight
                  openOnFocus
                  disablePortal
                  disabled={!selectedProvinceId}
                  noOptionsText={copy.fields.city.noOptionsText}
                  filterOptions={(options, state) => filterSearchOptions(options, state.inputValue)}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="city"
                      placeholder={copy.fields.city.placeholder}
                      error={Boolean(errors.city)}
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: autocompleteDropdownSx,
                    },
                  }}
                  sx={autocompleteSx(Boolean(errors.city))}
                />
              </FormField>
            )}
          />

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
              {complaintCategoryValues.map((value) => (
                <option key={value} value={value}>
                  {copy.options.complaintCategory[value]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="productModel"
            label={copy.fields.productModel.label}
            error={errors.productModel?.message}
            required
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
            id="invoiceNumber"
            label={copy.fields.invoiceNumber.label}
            error={errors.invoiceNumber?.message}
          >
            <input
              id="invoiceNumber"
              type="text"
              dir="ltr"
              className={inputClassName(Boolean(errors.invoiceNumber))}
              placeholder={copy.fields.invoiceNumber.placeholder}
              {...register('invoiceNumber')}
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
            id="purchaseDate"
            label={copy.fields.purchaseDate.label}
            error={errors.purchaseDate?.message}
          >
            <Controller
              control={control}
              name="purchaseDate"
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
                  inputClass={inputClassName(Boolean(errors.purchaseDate))}
                  containerClassName="w-full"
                  calendarPosition={locale === 'fa' ? 'bottom-right' : 'bottom-left'}
                  placeholder={copy.fields.purchaseDate.placeholder}
                />
              )}
            />
          </FormField>

          <FormField
            id="complaintTopic"
            label={copy.fields.complaintTopic.label}
            error={errors.complaintTopic?.message}
            required
          >
            <select
              id="complaintTopic"
              className={inputClassName(Boolean(errors.complaintTopic))}
              defaultValue=""
              {...register('complaintTopic')}
            >
              <option value="">{copy.fields.complaintTopic.placeholder}</option>
              {complaintTopicValues.map((value) => (
                <option key={value} value={value}>
                  {copy.options.complaintTopic[value]}
                </option>
              ))}
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              id="preferredContactMethod"
              label={copy.fields.preferredContactMethod.label}
              error={errors.preferredContactMethod?.message}
              required
            >
              <select
                id="preferredContactMethod"
                className={inputClassName(Boolean(errors.preferredContactMethod))}
                defaultValue=""
                {...register('preferredContactMethod')}
              >
                <option value="">{copy.fields.preferredContactMethod.placeholder}</option>
                {preferredContactMethodValues.map((value) => (
                  <option key={value} value={value}>
                    {copy.options.preferredContactMethod[value]}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              id="address"
              label={copy.fields.address.label}
              error={errors.address?.message}
            >
              <input
                id="address"
                type="text"
                className={inputClassName(Boolean(errors.address))}
                placeholder={copy.fields.address.placeholder}
                autoComplete="street-address"
                {...register('address')}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              id="description"
              label={copy.fields.description.label}
              error={errors.description?.message}
              required
            >
              <textarea
                id="description"
                rows={6}
                className={`${inputClassName(Boolean(errors.description))} resize-y`}
                placeholder={copy.fields.description.placeholder}
                {...register('description')}
              />
            </FormField>
          </div>
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
