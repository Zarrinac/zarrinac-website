'use client';

// Full-screen search overlay with localized page and product suggestions.
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { SUB_MENU_CONTENT, canonicalizeHref } from './navigationData';
import type { ApiProduct } from '@/lib/api/products/types';
import type { Locale } from '@/i18n/routing';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  placeholder: string;
  locale: string;
  closeLabel: string;
};

type SearchResult = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  terms: string;
};

const CATEGORY_SLUGS: Partial<Record<ApiProduct['category'], string>> = {
  TVS: 'tvs',
  WMS: 'wms',
  RAC: 'rac',
  CAC: 'cac',
};

const normalizeQuery = (value: string) => value.trim().toLocaleLowerCase();

const UI_COPY: Record<
  Locale,
  {
    pages: string;
    products: string;
    popular: string;
    noResults: string;
    submitHint: string;
  }
> = {
  fa: {
    pages: 'صفحات',
    products: 'محصولات',
    popular: 'پیشنهادهای پرکاربرد',
    noResults: 'نتیجه‌ای پیدا نشد.',
    submitHint: 'برای رفتن به اولین نتیجه Enter بزنید.',
  },
  en: {
    pages: 'Pages',
    products: 'Products',
    popular: 'Popular searches',
    noResults: 'No results found.',
    submitHint: 'Press Enter to open the first result.',
  },
};

export default function SearchOverlay({
  isOpen,
  onClose,
  placeholder,
  locale,
  closeLabel,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const resolvedLocale: Locale = locale === 'fa' ? 'fa' : 'en';
  const copy = UI_COPY[resolvedLocale];
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasLoadedProducts) {
      return;
    }

    let isActive = true;

    fetch('/api/products')
      .then((response) => (response.ok ? response.json() : []))
      .then((data: unknown) => {
        if (!isActive) {
          return;
        }
        setProducts(Array.isArray(data) ? (data as ApiProduct[]) : []);
        setHasLoadedProducts(true);
      })
      .catch(() => {
        if (isActive) {
          setHasLoadedProducts(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [hasLoadedProducts, isOpen]);

  const pageResults = useMemo<SearchResult[]>(() => {
    const seen = new Set<string>();

    return Object.values(SUB_MENU_CONTENT)
      .flat()
      .reduce<SearchResult[]>((items, item) => {
        const href = `/${resolvedLocale}${canonicalizeHref(item.href)}`;

        if (seen.has(href)) {
          return items;
        }

        seen.add(href);
        items.push({
          href,
          title: item.title[resolvedLocale],
          description: item.description[resolvedLocale],
          eyebrow: copy.pages,
          terms: [item.title.fa, item.title.en, item.description.fa, item.description.en, item.href]
            .join(' ')
            .toLocaleLowerCase(),
        });
        return items;
      }, []);
  }, [copy.pages, resolvedLocale]);

  const productResults = useMemo<SearchResult[]>(() => {
    return products.flatMap((product) => {
      const categorySlug = CATEGORY_SLUGS[product.category];
      if (!categorySlug) {
        return [];
      }

      const localizedCopy = product.copy[resolvedLocale] ?? product.copy.en;
      const fallbackCopy = product.copy.en;
      const slug = (product.slug ?? product.id).toLocaleLowerCase();

      return [
        {
          href: `/${resolvedLocale}/products/${categorySlug}/${slug}`,
          title: localizedCopy.name || product.id,
          description: localizedCopy.tagline || fallbackCopy.tagline || product.series,
          eyebrow: copy.products,
          terms: [
            product.id,
            product.sku ?? '',
            product.series,
            product.seriesLabel ?? '',
            product.panel,
            product.resolution,
            product.refreshRate,
            product.extras.join(' '),
            localizedCopy.name,
            localizedCopy.tagline,
            fallbackCopy.name,
            fallbackCopy.tagline,
          ]
            .join(' ')
            .toLocaleLowerCase(),
        },
      ];
    });
  }, [copy.products, products, resolvedLocale]);

  const results = useMemo(() => {
    const normalizedQuery = normalizeQuery(query);
    const allResults = [...pageResults, ...productResults];

    if (!normalizedQuery) {
      return allResults.slice(0, 8);
    }

    return allResults
      .map((result) => {
        const title = result.title.toLocaleLowerCase();
        const score =
          title === normalizedQuery
            ? 3
            : title.includes(normalizedQuery)
              ? 2
              : result.terms.includes(normalizedQuery)
                ? 1
                : 0;

        return { result, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
      .map((item) => item.result)
      .slice(0, 10);
  }, [pageResults, productResults, query]);

  if (!isOpen) {
    return null;
  }

  const isRTL = locale === 'fa';
  const hasQuery = normalizeQuery(query).length > 0;

  const closeOverlay = () => {
    setQuery('');
    onClose();
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const firstResult = results[0];

    if (firstResult) {
      closeOverlay();
      router.push(firstResult.href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center bg-(--overlay-color) px-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeOverlay();
        }
      }}
    >
      <div
        className="relative mt-3 w-full max-w-3xl overflow-hidden rounded-3xl bg-(--surface-color) shadow-2xl ring-1 ring-(--border-color)"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <form onSubmit={handleSubmit} role="search" className="bg-(--brand-color) p-2 md:p-3">
          <div className="flex items-center gap-3 rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-(--border-color) md:px-3 md:py-2">
            <SearchIcon className="text-(--text-muted-color)" fontSize="small" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
              placeholder={placeholder}
              className="h-10 flex-1 border-0 bg-transparent text-sm md:text-base text-(--default-black-font) outline-none placeholder-(--text-muted-color)"
            />
            <button
              type="button"
              onClick={closeOverlay}
              className="ml-auto inline-flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-(--brand-color) text-white transition hover:bg-(--brand-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
              aria-label={closeLabel}
              title={closeLabel}
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </form>

        <div className="max-h-[70vh] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="mb-2 flex items-center justify-between gap-3 px-1 text-xs font-semibold text-(--text-subtle-color)">
            <span>{hasQuery ? placeholder : copy.popular}</span>
            {results.length > 0 ? <span>{copy.submitHint}</span> : null}
          </div>

          {results.length > 0 ? (
            <ul className="grid gap-2">
              {results.map((result) => (
                <li key={result.href}>
                  <Link
                    href={result.href}
                    onClick={closeOverlay}
                    className="block rounded-2xl border border-(--border-color) bg-(--surface-muted-color) px-4 py-3 transition hover:border-(--brand-color) hover:bg-(--surface-hover-color) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color)"
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-(--brand-color)">
                      {result.eyebrow}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-(--default-black-font) sm:text-base">
                      {result.title}
                    </span>
                    <span className="mt-1 block text-xs leading-6 text-(--text-muted-color) sm:text-sm">
                      {result.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) px-4 py-6 text-center text-sm text-(--text-muted-color)">
              {copy.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
