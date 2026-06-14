// Deterministic SEO regression checker for zarrinac.com.
//
// Reads the live sitemap, fetches every URL, and flags concrete SEO issues:
// status, title/description (length + duplicates), canonical, hreflang count,
// single <h1>, JSON-LD presence, and HTML page size (>2 MB = Googlebot's index
// cap — guards the find-service-center class of bug). Also checks the homepage
// response headers (security headers present; hreflang NOT in the HTTP Link
// header — guards the next-intl alternateLinks regression).
//
// Prints a human-readable report and exits 1 if any ERROR-level issue is found
// (the cron wrapper escalates to `claude -p` on a non-zero exit). Warnings are
// advisory and don't change the exit code.
//
// Run: node ops/seo-audit.mjs [--base https://zarrinac.com]

const argv = process.argv.slice(2);
const BASE =
  (argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : process.env.SEO_AUDIT_BASE) ||
  'https://zarrinac.com';
const SITEMAP = `${BASE}/sitemap.xml`;
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const TITLE_MIN = 20,
  TITLE_MAX = 70;
const DESC_MIN = 70,
  DESC_MAX = 165;
const SIZE_ERROR = 2 * 1024 * 1024; // Googlebot truncates HTML past 2 MB
const SIZE_WARN = 600 * 1024;

const errors = [];
const warns = [];
const err = (url, msg) => errors.push(`${url}  ${msg}`);
const warn = (url, msg) => warns.push(`${url}  ${msg}`);

async function fetchUrl(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: 'manual', signal: ctrl.signal, ...opts });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body, bytes: Buffer.byteLength(body) };
  } finally {
    clearTimeout(t);
  }
}

// Attribute-order-tolerant extractors (regex is fine for these simple head tags).
function metaContent(html, name) {
  const tag = new RegExp(`<meta[^>]*\\bname=["']${name}["'][^>]*>`, 'i').exec(html);
  if (!tag) return null;
  const c = /content=["']([\s\S]*?)["']/i.exec(tag[0]);
  return c ? c[1].trim() : null;
}
function linkHref(html, rel) {
  const tag = new RegExp(`<link[^>]*\\brel=["']${rel}["'][^>]*>`, 'i').exec(html);
  if (!tag) return null;
  const h = /href=["']([^"']+)["']/i.exec(tag[0]);
  return h ? h[1] : null;
}
function extract(html) {
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [, null])[1];
  return {
    title: title ? title.trim() : null,
    desc: metaContent(html, 'description'),
    canonical: linkHref(html, 'canonical'),
    hreflang: (html.match(/<link[^>]*\bhreflang=/gi) || []).length,
    h1: (html.match(/<h1[\s>]/gi) || []).length,
    jsonld: (html.match(/<script[^>]+application\/ld\+json/gi) || []).length,
  };
}

// --- read sitemap ---
let urls = [];
try {
  const sm = await fetchUrl(SITEMAP);
  urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} catch (e) {
  console.log(`ERROR: cannot read sitemap ${SITEMAP}: ${e.message}`);
  process.exit(1);
}
if (urls.length === 0) {
  console.log(`ERROR: sitemap ${SITEMAP} returned no <loc> URLs`);
  process.exit(1);
}

// --- fetch all pages (bounded concurrency) ---
const pages = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    try {
      const r = await fetchUrl(url);
      pages.push({ url, status: r.status, bytes: r.bytes, ...extract(r.body) });
    } catch (e) {
      err(url, `fetch failed: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// --- per-page checks ---
for (const p of pages) {
  if (p.status !== 200) {
    err(p.url, `status ${p.status} (expected 200)`);
    continue;
  }
  if (p.bytes > SIZE_ERROR)
    err(p.url, `HTML ${(p.bytes / 1048576).toFixed(1)} MB exceeds Googlebot's 2 MB cap`);
  else if (p.bytes > SIZE_WARN) warn(p.url, `HTML ${(p.bytes / 1024).toFixed(0)} KB is large`);
  if (!p.title) err(p.url, 'missing <title>');
  else if (p.title.length < TITLE_MIN || p.title.length > TITLE_MAX)
    warn(p.url, `title ${p.title.length} chars (aim ${TITLE_MIN}-${TITLE_MAX})`);
  if (!p.desc) err(p.url, 'missing meta description');
  else if (p.desc.length < DESC_MIN || p.desc.length > DESC_MAX)
    warn(p.url, `description ${p.desc.length} chars (aim ${DESC_MIN}-${DESC_MAX})`);
  if (!p.canonical) err(p.url, 'missing canonical');
  if (p.hreflang < 2) warn(p.url, `${p.hreflang} hreflang tags (expect 3: fa/en/x-default)`);
  if (p.h1 !== 1) warn(p.url, `${p.h1} <h1> tags (expect exactly 1)`);
  if (p.jsonld === 0) warn(p.url, 'no JSON-LD structured data');
}

// --- duplicate title / description ---
function flagDuplicates(key, label) {
  const seen = new Map();
  for (const p of pages) {
    const v = p[key];
    if (!v) continue;
    (seen.get(v) ?? seen.set(v, []).get(v)).push(p.url);
  }
  for (const [v, list] of seen) {
    if (list.length > 1)
      warn(list[0], `duplicate ${label} ("${v.slice(0, 40)}…") shared by ${list.length} pages`);
  }
}
flagDuplicates('title', 'title');
flagDuplicates('desc', 'description');

// --- homepage header checks ---
try {
  const h = (await fetchUrl(`${BASE}/fa`)).headers;
  for (const need of [
    'x-frame-options',
    'x-content-type-options',
    'strict-transport-security',
    'referrer-policy',
  ]) {
    if (!h.get(need)) warn(`${BASE}/fa`, `missing security header: ${need}`);
  }
  if (/hreflang=/i.test(h.get('link') || '')) {
    warn(
      `${BASE}/fa`,
      'hreflang present in HTTP Link header — should be HTML <link> only (set alternateLinks:false)',
    );
  }
} catch (e) {
  warn(`${BASE}/fa`, `header check failed: ${e.message}`);
}

// --- report ---
console.log(`SEO audit ${new Date().toISOString()} — base ${BASE}`);
console.log(
  `scanned ${pages.length}/${urls.length} pages · ${errors.length} errors · ${warns.length} warnings`,
);
if (errors.length) {
  console.log('\nERRORS:');
  for (const e of errors) console.log(`  ✗ ${e}`);
}
if (warns.length) {
  console.log('\nWARNINGS:');
  for (const w of warns) console.log(`  ! ${w}`);
}
if (!errors.length && !warns.length) console.log('\nAll clean ✓');

process.exit(errors.length ? 1 : 0);
