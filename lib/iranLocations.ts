import type { Locale } from '@/i18n/routing';
import rawProvinces from './iranLocations.json';

type LocalizedLabel = {
  en: string;
  fa: string;
};

export type IranCity = {
  id: string;
  labels: LocalizedLabel;
};

export type IranProvince = {
  id: string;
  labels: LocalizedLabel;
  cities: IranCity[];
};

export const iranProvinces = rawProvinces as IranProvince[];

const PERSIAN_TEXT_PATTERN = /[؀-ۿ]/;

const PERSIAN_TO_LATIN_MAP: Record<string, string> = {
  ا: 'a',
  آ: 'a',
  ب: 'b',
  پ: 'p',
  ت: 't',
  ث: 's',
  ج: 'j',
  چ: 'ch',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'z',
  ر: 'r',
  ز: 'z',
  ژ: 'zh',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'z',
  ط: 't',
  ظ: 'z',
  ع: '',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  م: 'm',
  ن: 'n',
  و: 'v',
  ه: 'h',
  ی: 'y',
  ئ: 'y',
  ء: '',
  ؤ: 'v',
  ة: 'h',
  ك: 'k',
  ي: 'y',
};

const ENDING_A_CLUSTER_CONSONANTS = new Set(['d', 'j', 'n', 'r', 'z']);
const LATIN_VOWEL_PATTERN = /^[aeiou]/i;
const LATIN_CONSONANT_PATTERN = /^(ch|gh|kh|ph|sh|th|zh|[bcdfghjklmnpqrstvwxyz])$/i;
const PERSIAN_VOWEL_LETTER_PATTERN = /[اآوی]/;

function normalizePersianLabel(value: string) {
  return value
    .trim()
    .replace(/‌/g, ' ')
    .replace(/[ك]/g, 'ک')
    .replace(/[يى]/g, 'ی')
    .replace(/[ؤ]/g, 'و')
    .replace(/[أإ]/g, 'ا')
    .replace(/\s+/g, ' ');
}

function isLatinVowelSound(value: string) {
  return LATIN_VOWEL_PATTERN.test(value);
}

function isLatinConsonantSound(value: string) {
  return LATIN_CONSONANT_PATTERN.test(value);
}

function transliteratePersianWord(word: string) {
  const normalizedWord = normalizePersianLabel(word);

  if (!normalizedWord) {
    return '';
  }

  const tokens: string[] = [];

  for (let index = 0; index < normalizedWord.length; index += 1) {
    const character = normalizedWord[index];
    const previousCharacter = normalizedWord[index - 1] ?? '';
    const nextCharacter = normalizedWord[index + 1] ?? '';

    if (character === 'و') {
      if (!previousCharacter) {
        tokens.push('v');
      } else if (!nextCharacter) {
        tokens.push('u');
      } else if (
        PERSIAN_VOWEL_LETTER_PATTERN.test(previousCharacter) ||
        PERSIAN_VOWEL_LETTER_PATTERN.test(nextCharacter)
      ) {
        tokens.push('v');
      } else {
        tokens.push('o');
      }

      continue;
    }

    if (character === 'ی' || character === 'ي' || character === 'ئ') {
      tokens.push(previousCharacter ? 'i' : 'y');
      continue;
    }

    if ((character === 'ه' || character === 'ة') && index === normalizedWord.length - 1) {
      tokens.push('eh');
      continue;
    }

    if (character === 'ع' && index === 0) {
      tokens.push('a');
      continue;
    }

    if (character === ' ') {
      continue;
    }

    tokens.push(PERSIAN_TO_LATIN_MAP[character] ?? character);
  }

  const explicitVowelCount = tokens.filter(isLatinVowelSound).length;
  const output: string[] = [];

  for (let index = 0; index < tokens.length; ) {
    const token = tokens[index];

    if (!isLatinConsonantSound(token)) {
      output.push(token);
      index += 1;
      continue;
    }

    let clusterEndIndex = index;
    while (clusterEndIndex < tokens.length && isLatinConsonantSound(tokens[clusterEndIndex])) {
      clusterEndIndex += 1;
    }

    const cluster = tokens.slice(index, clusterEndIndex);
    const isWordStart = index === 0;
    const isWordEnd = clusterEndIndex === tokens.length;
    const nextToken = tokens[clusterEndIndex];

    if (cluster.length === 2 && explicitVowelCount === 0) {
      output.push(cluster[0], 'a', cluster[1]);
    } else if (cluster.length === 3 && explicitVowelCount === 0) {
      if (ENDING_A_CLUSTER_CONSONANTS.has(cluster[2])) {
        output.push(cluster[0], 'a', cluster[1], 'a', cluster[2]);
      } else {
        output.push(cluster[0], 'a', cluster[1], cluster[2]);
      }
    } else if (cluster.length === 4 && explicitVowelCount === 0) {
      output.push(cluster[0], 'a', cluster[1], cluster[2], 'a', cluster[3]);
    } else if (cluster.length >= 3 && isWordStart && nextToken && isLatinVowelSound(nextToken)) {
      output.push(cluster[0], 'a', ...cluster.slice(1));
    } else if (
      cluster.length === 2 &&
      isWordEnd &&
      explicitVowelCount > 0 &&
      ENDING_A_CLUSTER_CONSONANTS.has(cluster[1])
    ) {
      output.push(cluster[0], 'a', cluster[1]);
    } else {
      output.push(...cluster);
    }

    index = clusterEndIndex;
  }

  return output.join('').replace(/aa+/g, 'a');
}

function transliteratePersianToLatin(value: string) {
  const normalized = normalizePersianLabel(value);

  return normalized
    .split(' ')
    .filter(Boolean)
    .map(transliteratePersianWord)
    .join(' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeSearchText(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[ك]/g, 'ک')
    .replace(/[يى]/g, 'ی')
    .replace(/[ؤ]/g, 'و')
    .replace(/[أإ]/g, 'ا')
    .toLowerCase();
}

export function getLocalizedLabel(labels: LocalizedLabel, locale: Locale) {
  if (locale === 'fa') {
    return labels.fa;
  }

  if (PERSIAN_TEXT_PATTERN.test(labels.en)) {
    return transliteratePersianToLatin(labels.fa);
  }

  return labels.en;
}

export function getProvinceById(provinceId: string) {
  return iranProvinces.find((province) => province.id === provinceId);
}

export function getCityById(provinceId: string, cityId: string) {
  return getProvinceById(provinceId)?.cities.find((city) => city.id === cityId);
}

export function getLocationDisplayName(locale: Locale, provinceId: string, cityId: string) {
  const province = getProvinceById(provinceId);
  const city = getCityById(provinceId, cityId);

  if (!province || !city) {
    return null;
  }

  return `${getLocalizedLabel(province.labels, locale)} / ${getLocalizedLabel(city.labels, locale)}`;
}
