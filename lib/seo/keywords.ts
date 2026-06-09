import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

type SeoLocale = 'fa' | 'en';
type SeoKeywordsByLocale = Record<SeoLocale, string[]>;

const KEYWORD_FILE_PATH = path.join(process.cwd(), 'seo', 'keywords.txt');
const KEYWORD_LINE = /^-\s+/;
const MAX_KEYWORD_LENGTH = 70;

let cachedKeywords: SeoKeywordsByLocale | null = null;

const isPersian = (value: string) => /[\u0600-\u06FF]/.test(value);

const loadKeywords = (): SeoKeywordsByLocale => {
  if (cachedKeywords) {
    return cachedKeywords;
  }

  const result: SeoKeywordsByLocale = { fa: [], en: [] };

  try {
    const raw = fs.readFileSync(KEYWORD_FILE_PATH, 'utf8');
    const seen = { fa: new Set<string>(), en: new Set<string>() };

    raw
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => KEYWORD_LINE.test(line))
      .map((line) => line.replace(KEYWORD_LINE, '').trim())
      .filter((line) => line.length > 0 && line.length <= MAX_KEYWORD_LENGTH)
      .forEach((keyword) => {
        const locale: SeoLocale = isPersian(keyword) ? 'fa' : 'en';
        if (!seen[locale].has(keyword)) {
          seen[locale].add(keyword);
        }
      });

    result.fa = Array.from(seen.fa);
    result.en = Array.from(seen.en);
  } catch {
    // No-op: fall back to empty lists if the file is missing.
  }

  cachedKeywords = result;
  return result;
};

export const getSeoKeywords = (locale: SeoLocale, limit = 16): string[] => {
  const keywords = loadKeywords()[locale] ?? [];
  return Number.isFinite(limit) ? keywords.slice(0, limit) : keywords;
};
