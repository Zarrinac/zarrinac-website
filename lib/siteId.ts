// Identifies which brand/site this deployment is. Used to tag rows written to the
// shared database (complaints, surveys) so a single Postgres instance can back both
// hisense-ir.com and zarrinac.com, and so each admin panel only sees its own site's
// submissions. Defaults to 'hisense'; the zarrinac deployment sets
// NEXT_PUBLIC_SITE_ID=zarrinac in its environment. Keep this file identical across
// both repos — the difference lives in the env var, not the code.
export type SiteId = 'hisense' | 'zarrinac';

export const SITE_ID: SiteId = (process.env.NEXT_PUBLIC_SITE_ID as SiteId) ?? 'hisense';
