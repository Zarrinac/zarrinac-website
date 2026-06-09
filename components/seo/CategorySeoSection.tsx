import JsonLd from './JsonLd';
import type { Locale } from '@/i18n/routing';
import { getLocaleLanguage } from '@/lib/seo/site';
import type { CategorySeoContent } from '@/lib/seo/categorySeoContent';

// Renders indexable, keyword-targeted category copy plus an FAQ (with FAQPage
// JSON-LD). The Q&A text is rendered in the DOM via native <details> so it is
// crawlable without client-side JS.

type CategorySeoSectionProps = {
  content: CategorySeoContent;
  locale: Locale;
};

export default function CategorySeoSection({ content, locale }: CategorySeoSectionProps) {
  const isRTL = locale === 'fa';
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: getLocaleLanguage(locale),
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-5xl px-4 sm:px-6"
      aria-labelledby="category-seo-heading"
    >
      <JsonLd data={faqJsonLd} />

      <div className="space-y-4">
        <h2
          id="category-seo-heading"
          className="text-xl font-bold text-(--default-black-font) sm:text-2xl"
        >
          {content.heading}
        </h2>
        {content.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm leading-7 text-(--text-muted-color) sm:text-base sm:leading-8"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        <h3 className="text-lg font-bold text-(--default-black-font) sm:text-xl">
          {content.faqHeading}
        </h3>
        <div className="divide-y divide-(--border-color) overflow-hidden rounded-2xl border border-(--border-color) bg-(--surface-color)">
          {content.faqs.map((faq) => (
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
      </div>
    </section>
  );
}
