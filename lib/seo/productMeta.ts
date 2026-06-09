import type { Locale } from '@/i18n/routing';

// Buying-intent <title> and <meta description> templates for product detail pages.
//
// The product `name` already carries the category + brand (e.g. "تلویزیون Q6Q هایسنس",
// "کولر گازی اینورتر هایسنس HIH-24TG") and is unique per SKU, so these templates wrap it
// with purchase-intent terms (خرید/قیمت/مشخصات) + the site brand. This fixes three issues
// from the SEO audit at once: titles under 30 chars, titles identical to the <h1>, and
// duplicate/short/mislocalised meta descriptions.
//
// We deliberately DO NOT use the DB `tagline` for meta: many are duplicated across sibling
// SKUs (all HID duct units share one tagline, all HRH/HIH/HRTC/HFH series likewise) and a
// few are mislocalised (the q6q fa tagline is English) — both hurt SEO. The clean, visible
// product name/<h1> on the page is unchanged; only the head metadata is enriched.

export const buildProductMetaTitle = (locale: Locale, name: string): string =>
  locale === 'fa' ? `${name} | خرید، قیمت و مشخصات | هایسنس ایران` : `${name} | Hisense Iran`;

export const buildProductMetaDescription = (locale: Locale, name: string): string =>
  locale === 'fa'
    ? `خرید ${name} با گارانتی رسمی و خدمات پس از فروش سراسری از نمایندگی رسمی هایسنس ایران، زرین نمای کاسپین. مشخصات کامل و استعلام قیمت روز.`
    : `Buy the ${name} from Hisense Iran's official distributor — genuine product, warranty, and nationwide after-sales service.`;

// Category listing pages: the route title (e.g. "ماشین لباسشویی هایسنس") is also reused as a
// visible label/H1 elsewhere, so we wrap only the <title> field in `generateMetadata` — not
// the translation value — to lengthen short category titles without any side effects.
export const buildCategoryMetaTitle = (locale: string, routeTitle: string): string =>
  locale === 'fa' ? `${routeTitle} | خرید و قیمت | هایسنس ایران` : `${routeTitle} | Hisense Iran`;
