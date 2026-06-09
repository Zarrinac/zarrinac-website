import { z } from 'zod';
import { routing } from '@/i18n/routing';

export const complaintCategoryValues = [
  'tv',
  'refrigerator',
  'washing-machine',
  'rac',
  'cac',
  'other',
] as const;

export const complaintTopicValues = [
  'after-sales-service',
  'installation',
  'repair-delay',
  'warranty',
  'product-quality',
  'other',
] as const;

export const preferredContactMethodValues = ['phone', 'email', 'whatsapp'] as const;

type ChoiceValue<T extends readonly string[]> = T[number];

export type ComplaintValidationCopy = {
  fullNameRequired: string;
  fullNameMin: string;
  phoneRequired: string;
  phoneInvalid: string;
  emailInvalid: string;
  productCategoryRequired: string;
  productModelRequired: string;
  productModelMin: string;
  purchaseDateInvalid: string;
  complaintTopicRequired: string;
  preferredContactRequired: string;
  provinceRequired: string;
  cityRequired: string;
  descriptionRequired: string;
};

const DEFAULT_VALIDATION_COPY: ComplaintValidationCopy = {
  fullNameRequired: 'Full name is required.',
  fullNameMin: 'Enter at least 3 characters.',
  phoneRequired: 'Phone number is required.',
  phoneInvalid: 'Enter a valid phone number.',
  emailInvalid: 'Enter a valid email address.',
  productCategoryRequired: 'Select a product category.',
  productModelRequired: 'Product model is required.',
  productModelMin: 'Enter at least 2 characters for the model.',
  purchaseDateInvalid: 'Enter a valid date.',
  complaintTopicRequired: 'Select a complaint topic.',
  preferredContactRequired: 'Select a preferred follow-up method.',
  provinceRequired: 'Select a province.',
  cityRequired: 'Select a city.',
  descriptionRequired: 'Complaint details are required.',
};

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const PHONE_PATTERN = /^09\d{9}$/;

function normalizeDigits(value: string) {
  return value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

function normalizeOptionalString(maxLength: number) {
  return z
    .union([z.string().trim().max(maxLength), z.literal(''), z.null(), z.undefined()])
    .transform((value) => {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      return trimmed.length > 0 ? trimmed : null;
    });
}

function choiceField<T extends readonly string[]>(
  values: T,
  requiredMessage: string,
): z.ZodPipe<z.ZodString, z.ZodTransform<ChoiceValue<T>, string>> {
  return z
    .string()
    .trim()
    .min(1, { message: requiredMessage })
    .refine((value) => values.includes(value as ChoiceValue<T>), {
      message: requiredMessage,
    })
    .transform((value) => value as ChoiceValue<T>);
}

export function createComplaintSchema(copy: ComplaintValidationCopy = DEFAULT_VALIDATION_COPY) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: copy.fullNameRequired })
      .min(3, { message: copy.fullNameMin })
      .max(120),
    phone: z
      .string()
      .trim()
      .min(1, { message: copy.phoneRequired })
      .transform((value) => normalizeDigits(value.trim()))
      .refine((value) => PHONE_PATTERN.test(value), {
        message: copy.phoneInvalid,
      }),
    email: z
      .union([
        z.string().trim().email({ message: copy.emailInvalid }),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        return trimmed.length > 0 ? trimmed.toLowerCase() : null;
      }),
    productCategory: choiceField(complaintCategoryValues, copy.productCategoryRequired),
    productModel: z
      .string()
      .trim()
      .min(1, { message: copy.productModelRequired })
      .min(2, { message: copy.productModelMin })
      .max(120),
    invoiceNumber: normalizeOptionalString(60),
    referenceNumber: normalizeOptionalString(80),
    purchaseDate: z
      .union([
        z.string().regex(DATE_PATTERN, { message: copy.purchaseDateInvalid }),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        return trimmed.length > 0 ? trimmed : null;
      }),
    complaintTopic: choiceField(complaintTopicValues, copy.complaintTopicRequired),
    preferredContactMethod: choiceField(
      preferredContactMethodValues,
      copy.preferredContactRequired,
    ),
    province: z.string().trim().min(1, { message: copy.provinceRequired }).max(80),
    city: z.string().trim().min(1, { message: copy.cityRequired }).max(80),
    address: normalizeOptionalString(240),
    description: z.string().trim().min(1, { message: copy.descriptionRequired }).max(2000),
  });
}

export const complaintSchema = createComplaintSchema();
export const complaintSubmissionSchema = complaintSchema.extend({
  locale: z.enum(routing.locales),
});

export type ComplaintFormValues = z.input<typeof complaintSchema>;
export type ComplaintParsedValues = z.output<typeof complaintSchema>;
export type ComplaintSubmissionValues = z.output<typeof complaintSubmissionSchema>;
