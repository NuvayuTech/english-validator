import { englishDictionary } from './dictionary';
import {
  ABBREVIATION_REGEX,
  ENGLISH_CHARS_REGEX,
  NUMBERS_ONLY_REGEX,
  WORD_CACHE_LIMIT,
} from './constants';
import { WordOptions } from './types';
import { hasObviousNonEnglishIndicators } from './non-english-checks';
import { cacheSet } from './utils';

// ─── Word-Level Analysis ──────────────────────────────────────────────────────

/** LRU-style cache for individual word English-check results. */
export const wordCache = new Map<string, boolean>();

/**
 * Validates that a word contains only English-compatible characters:
 * ASCII letters (a-z, A-Z), digits (0-9), apostrophes, and hyphens.
 *
 * @param word - The word to validate
 * @returns true if every character is English-compatible
 */
function hasOnlyEnglishCharacters(word: string): boolean {
  return ENGLISH_CHARS_REGEX.test(word);
}

/**
 * Determines whether a single word is English through a layered pipeline:
 *
 * 1. **Character filter** — rejects words with non-ASCII characters
 * 2. **Number detection** — standalone digits pass when allowNumbers is true
 * 3. **Non-English screening** — rejects obvious non-English indicators
 * 4. **Dictionary lookup** — checks the 270k+ English word Set
 * 5. **Contraction resolution** — splits on apostrophe and rechecks base
 *
 * Each layer short-circuits to avoid unnecessary work (optimised).
 *
 * @param word    - Lowercase word to evaluate
 * @param options - Controls number handling
 * @returns true if the word is recognised as English
 */
function isEnglishWord(word: string, options: WordOptions): boolean {
  if (!hasOnlyEnglishCharacters(word)) return false;
  if (options.allowNumbers && NUMBERS_ONLY_REGEX.test(word)) return true;
  if (options.allowAbbreviations && ABBREVIATION_REGEX.test(word)) return true;
  if (hasObviousNonEnglishIndicators(word)) return false;
  if (englishDictionary.has(word)) return true;

  if (word.includes("'")) {
    const contractionBase = word.split("'")[0];
    if (englishDictionary.has(contractionBase)) return true;
  }

  return false;
}

/**
 * Cached wrapper around {@link isEnglishWord}. Uses an LRU-style Map
 * cache (max {@link WORD_CACHE_LIMIT} entries) keyed on word + options
 * to avoid redundant dictionary lookups for previously checked words.
 *
 * Follows the Single Responsibility Principle: caching logic is
 * separated from word-evaluation logic.
 *
 * @param word    - Lowercase word to check
 * @param options - Controls number and abbreviation handling
 * @returns true if the word is recognised as English
 */
export function isEnglishWordCached(word: string, options: WordOptions): boolean {
  const cacheKey = `${word}_${options.allowNumbers}_${options.allowAbbreviations}`;

  if (wordCache.has(cacheKey)) return wordCache.get(cacheKey)!;

  const result = isEnglishWord(word, options);
  cacheSet(wordCache, WORD_CACHE_LIMIT, cacheKey, result);
  return result;
}
