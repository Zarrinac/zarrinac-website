import { z } from 'zod';
import { routing } from '@/i18n/routing';

export const surveyProductCategoryValues = [
  'tv',
  'refrigerator',
  'washing-machine',
  'rac',
  'cac',
  'other',
] as const;

export const surveyServiceChannelValues = [
  'repair',
  'installation',
  'warranty',
  'call-center',
  'sales',
  'dealer',
  'website',
  'other',
] as const;

export const surveyClarityValues = ['yes', 'partly', 'no'] as const;
export const surveyStaffBehaviorValues = ['excellent', 'good', 'fair', 'poor'] as const;
export const surveyTimelinessValues = ['yes', 'partly', 'no'] as const;
export const surveySatisfactionValues = [
  'very-satisfied',
  'satisfied',
  'neutral',
  'dissatisfied',
] as const;
export const surveyFollowUpConsentValues = ['yes', 'no'] as const;

type ChoiceValue<T extends readonly string[]> = T[number];

export type SurveyValidationCopy = {
  fullNameRequired: string;
  fullNameMin: string;
  mobileRequired: string;
  mobileInvalid: string;
  phoneInvalid: string;
  emailInvalid: string;
  productCategoryRequired: string;
  serviceChannelRequired: string;
  serviceDateInvalid: string;
  communicationClarityRequired: string;
  staffBehaviorRequired: string;
  timelinessRequired: string;
  overallSatisfactionRequired: string;
  followUpConsentRequired: string;
  overallFeedbackRequired: string;
};

const DEFAULT_VALIDATION_COPY: SurveyValidationCopy = {
  fullNameRequired: 'Full name is required.',
  fullNameMin: 'Enter at least 3 characters.',
  mobileRequired: 'Mobile number is required.',
  mobileInvalid: 'Enter a valid mobile number.',
  phoneInvalid: 'Enter a valid phone number.',
  emailInvalid: 'Enter a valid email address.',
  productCategoryRequired: 'Select a product category.',
  serviceChannelRequired: 'Select a service channel.',
  serviceDateInvalid: 'Enter a valid date.',
  communicationClarityRequired: 'Select whether the process was explained clearly.',
  staffBehaviorRequired: 'Select a staff behavior rating.',
  timelinessRequired: 'Select whether the service was completed on time.',
  overallSatisfactionRequired: 'Select an overall satisfaction level.',
  followUpConsentRequired: 'Select whether we can contact you for follow-up.',
  overallFeedbackRequired: 'Share your overall feedback.',
};

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const MOBILE_PATTERN = /^09\d{9}$/;
const PHONE_PATTERN = /^0\d{8,10}$/;

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

export function createSurveySchema(copy: SurveyValidationCopy = DEFAULT_VALIDATION_COPY) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: copy.fullNameRequired })
      .min(3, { message: copy.fullNameMin })
      .max(120),
    mobile: z
      .string()
      .trim()
      .min(1, { message: copy.mobileRequired })
      .transform((value) => normalizeDigits(value.trim()))
      .refine((value) => MOBILE_PATTERN.test(value), {
        message: copy.mobileInvalid,
      }),
    phone: z
      .union([z.string().trim(), z.literal(''), z.null(), z.undefined()])
      .transform((value) => {
        const trimmed = typeof value === 'string' ? normalizeDigits(value.trim()) : '';
        return trimmed.length > 0 ? trimmed : null;
      })
      .refine((value) => value === null || PHONE_PATTERN.test(value), {
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
    productCategory: choiceField(surveyProductCategoryValues, copy.productCategoryRequired),
    productModel: normalizeOptionalString(120),
    referenceNumber: normalizeOptionalString(80),
    serviceChannel: choiceField(surveyServiceChannelValues, copy.serviceChannelRequired),
    serviceDate: z
      .union([
        z.string().regex(DATE_PATTERN, { message: copy.serviceDateInvalid }),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        return trimmed.length > 0 ? trimmed : null;
      }),
    communicationClarity: choiceField(surveyClarityValues, copy.communicationClarityRequired),
    staffBehavior: choiceField(surveyStaffBehaviorValues, copy.staffBehaviorRequired),
    timeliness: choiceField(surveyTimelinessValues, copy.timelinessRequired),
    overallSatisfaction: choiceField(surveySatisfactionValues, copy.overallSatisfactionRequired),
    followUpConsent: choiceField(surveyFollowUpConsentValues, copy.followUpConsentRequired),
    overallFeedback: z.string().trim().min(1, { message: copy.overallFeedbackRequired }).max(2000),
    improvementSuggestions: normalizeOptionalString(2000),
  });
}

export const surveySchema = createSurveySchema();
export const surveySubmissionSchema = surveySchema.extend({
  locale: z.enum(routing.locales),
});

export type SurveyFormValues = z.input<typeof surveySchema>;
export type SurveyParsedValues = z.output<typeof surveySchema>;
export type SurveySubmissionValues = z.output<typeof surveySubmissionSchema>;
