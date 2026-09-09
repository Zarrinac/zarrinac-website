// Identifies which brand/site this deployment is. Used to tag rows written to the
// shared database (complaints, surveys) so a single Postgres instance can back both
// hisense-ir.com and zarrinac.com, and so each admin panel only sees its own site's
// submissions. Defaults to 'hisense'; the zarrinac deployment sets
// NEXT_PUBLIC_SITE_ID=zarrinac in its environment, and the containerised znci.ir
// deployment (docker/, zarrinac repo) sets 'znci'. znci.ir ships DB-less, so there the
// id never reaches the database — it only selects which home copy gets built, keeping
// znci.ir out of zarrinac.com's duplicate-content cluster. Keep this file identical
// across both repos — the difference lives in the env var, not the code.
export type SiteId = 'hisense' | 'zarrinac' | 'znci';

export const SITE_ID: SiteId = (process.env.NEXT_PUBLIC_SITE_ID as SiteId) ?? 'hisense';
