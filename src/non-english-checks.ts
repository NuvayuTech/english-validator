import {
  NON_ENGLISH_CHARS_REGEX,
  NON_ENGLISH_ENDINGS_REGEX,
  NON_ENGLISH_FUNCTION_WORDS_REGEX,
  NON_ENGLISH_WORD_PATTERNS,
} from './constants';
import { isNonEmptyString } from './utils';

// ─── Non-English Indicator Checks ─────────────────────────────────────────────

/**
 * Checks whether a word contains characters typical of non-English
 * European languages using the precompiled {@link NON_ENGLISH_CHARS_REGEX}.
 *
 * Covers: German (äöüß), French (éèêë), Spanish (ñ), Italian (ìò),
 * Scandinavian (åøæ), Polish (łńś), Turkish (şğı).
 *
 * @param text - Single word to inspect
 * @returns true if non-English characters are present
 */
export function hasNonEnglishCharacters(text: string): boolean {
  return NON_ENGLISH_CHARS_REGEX.test(text);
}

/**
 * Checks whether a word has a suffix typical of non-English languages
 * using the precompiled {@link NON_ENGLISH_ENDINGS_REGEX}.
 *
 * Detects: German (-keit, -schaft), Spanish (-cion), Italian (-zione),
 * Dutch (-baar, -lijk), Portuguese (-agem, -cao), French (-eur).
 *
 * @param text - Single word to inspect
 * @returns true if a non-English suffix is found
 */
export function hasNonEnglishEndings(text: string): boolean {
  return NON_ENGLISH_ENDINGS_REGEX.test(text);
}

/**
 * Checks whether a word matches common non-English vocabulary from German,
 * Spanish, French, Italian, Dutch, Portuguese, Turkish, or Scandinavian
 * using the precompiled {@link NON_ENGLISH_WORD_PATTERNS} array.
 *
 * @param text - Single word to check
 * @returns true if the word matches a known non-English vocabulary word
 */
export function hasNonEnglishWordPatterns(text: string): boolean {
  return NON_ENGLISH_WORD_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Multi-heuristic check for obvious non-English indicators on a single
 * word or short phrase. Applies checks in order of ascending cost:
 *
 * 1. Character analysis (cheapest — single regex)
 * 2. Suffix analysis (single regex)
 * 3. Vocabulary matching (pattern array)
 * 4. Function-word detection (single regex)
 *
 * @param text - Word or short phrase to evaluate
 * @returns true if obvious non-English indicators are found
 */
export function hasObviousNonEnglishIndicators(text: string | null | undefined): boolean {
  if (!isNonEmptyString(text) || text.length < 2) return false;

  if (!text.includes(' ')) {
    if (hasNonEnglishCharacters(text) || hasNonEnglishEndings(text)) {
      return true;
    }
  }

  return hasNonEnglishWordPatterns(text) || NON_ENGLISH_FUNCTION_WORDS_REGEX.test(text);
}
