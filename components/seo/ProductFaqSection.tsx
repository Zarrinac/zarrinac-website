import JsonLd from './JsonLd';
import type { Locale } from '@/i18n/routing';
import { getLocaleLanguage } from '@/lib/seo/site';
import type { ProductFaq } from '@/lib/seo/productFaq';

// Renders genuine, crawlable product FAQs (native <details>, no client JS) plus
// FAQPage JSON-LD. Used on product detail pages to add real Q&A content.

type ProductFaqSectionProps = {
  faqs: ProductFaq[];
  heading: string;
  locale: Locale;
};

export default function ProductFaqSection({ faqs, heading, locale }: ProductFaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  const isRTL = locale === 'fa';
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: getLocaleLanguage(locale),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-5xl px-4 sm:px-6"
      aria-labelledby="product-faq-heading"
    >
      <JsonLd data={faqJsonLd} />

      <h2
        id="product-faq-heading"
        className="text-xl font-bold text-(--default-black-font) sm:text-2xl"
      >
        {heading}
      </h2>

      <div className="mt-6 divide-y divide-(--border-color) overflow-hidden rounded-2xl border border-(--border-color) bg-(--surface-color)">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="flex list-none cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-(--default-black-font) sm:text-base [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span
                aria-hidden
                className="text-lg text-(--brand-color) transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-(--text-muted-color) sm:text-base">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
