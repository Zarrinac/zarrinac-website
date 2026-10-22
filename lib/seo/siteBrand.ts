import { SITE_ID, type SiteId } from '@/lib/siteId';

// The name each deployment of this tree presents itself under, in visible copy and in
// metadata. hisense-ir.com speaks as "Hisense Iran"; zarrinac.com (and znci.ir) speak as
// the company behind it, Zarrin Namaye Caspian — the official Hisense distributor. Since
// zarrinac.com serves the same sections as hisense-ir.com (2026-10-22), this is one of
// the per-site layers that keeps the two domains from reading as one duplicate site.
// Written so it can be ported to the hisense repo verbatim: there SITE_ID is 'hisense'
// and every string stays what it is today.

type BrandNames = { fa: string; en: string };

const SITE_BRAND_NAMES: Record<SiteId, BrandNames> = {
  hisense: { fa: 'هایسنس ایران', en: 'Hisense Iran' },
  zarrinac: { fa: 'زرین نمای کاسپین', en: 'Zarrin Namaye Caspian' },
  znci: { fa: 'زرین نمای کاسپین', en: 'Zarrin Namaye Caspian' },
};

export const IS_ZARRINAC_SITE = SITE_ID === 'zarrinac';

/** Localized brand name ("Hisense Iran" on hisense-ir.com, "Zarrin Namaye Caspian" here). */
export const siteBrandName = (locale: string): string =>
  SITE_BRAND_NAMES[SITE_ID][locale === 'fa' ? 'fa' : 'en'];

/** `<meta name="application-name">`. */
export const SITE_APPLICATION_NAME =
  SITE_ID === 'hisense' ? 'Hisense Iran' : 'Zarrin Namaye Caspian';

/** Open Graph `og:site_name`. */
export const SITE_OG_NAME =
  SITE_ID === 'hisense'
    ? 'Zarrin Namaye Caspian | Hisense Iran'
    : 'Zarrin Namaye Caspian | Official Hisense Distributor';
