import { ABBREVIATION_REGEX, WORD_PUNCTUATION_REGEX } from './constants';
import { francLanguageAnalysis, francCache } from './franc-analysis';
import { preprocessText } from './preprocessing';
import { DetectionOptions } from './types';
import { isNonEmptyString } from './utils';
import { isEnglishWordCached, wordCache } from './word-analysis';

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { matchesDocumentPattern } from './preprocessing';
export type { DetectionOptions } from './types';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Detects whether the given text is **non-English**.
 *
 * Uses a multi-layered detection strategy:
 * 1. **Preprocessing** — strips document IDs, geographical terms, and
 *    special characters to reduce noise
 * 2. **Word-level analysis** — checks each word against a 270k+ English
 *    dictionary with heuristic non-English screening
 * 3. **Trigram analysis** — falls back to franc language detection for
 *    ambiguous cases where word ratio alone is insufficient
 *
 * Short texts (4 words or fewer) use a relaxed threshold (0.6) to avoid
 * false positives on English abbreviations and fragments.
 *
 * @param inputText - The text to analyse (null/undefined/empty returns false)
 * @param options   - Detection configuration (thresholds, word length, etc.)
 * @returns true if the text is non-English, false if English or empty
 *
 * @example
 * detectNonEnglishText("Hello world");                      // false
 * detectNonEnglishText("Bonjour le monde");                 // true
 * detectNonEnglishText("", { englishThreshold: 0.5 });      // false
 * detectNonEnglishText("AEM01-WI-DSU06 is ready");          // false
 */
export const detectNonEnglishText = (
  inputText: string | null | undefined,
  options: DetectionOptions = {},
): boolean => {
  const {
    minWordLength = 2,
    allowNumbers = true,
    allowAbbreviations = true,
    customPatterns,
    excludeWords,
  } = options;
  let { englishThreshold = 0.8 } = options;

  if (!isNonEmptyString(inputText) || inputText.trim().length === 0) {
    return false;
  }

  const francInputText = inputText;
  const processedText = preprocessText(inputText, customPatterns, excludeWords);
  const words = processedText.split(' ');

  if (words.length === 0) return false;
  if (words.length <= 4) englishThreshold = 0.6;

  let englishWordCount = 0;
  let totalRelevantWords = 0;

  for (const word of words) {
    const cleanWord = word.replace(WORD_PUNCTUATION_REGEX, '').trim();
    if (cleanWord.length < minWordLength) continue;

    totalRelevantWords++;

    // Check abbreviation on original casing before lowercasing
    if (allowAbbreviations && ABBREVIATION_REGEX.test(cleanWord)) {
      englishWordCount++;
    } else if (
      isEnglishWordCached(cleanWord.toLowerCase(), {
        allowNumbers,
        allowAbbreviations,
      })
    ) {
      englishWordCount++;
    }
  }

  const englishRatio = totalRelevantWords > 0 ? englishWordCount / totalRelevantWords : 1.0;

  if (englishRatio >= englishThreshold) return false;

  const { language, confidence } = francLanguageAnalysis(francInputText);

  if (language === 'eng' && confidence >= 0.9 && englishRatio >= 0.7) {
    return false;
  }

  return true;
};

/**
 * Convenience inverse of {@link detectNonEnglishText}.
 * Returns true when the text IS English.
 *
 * @param inputText - The text to analyse
 * @param options   - Same configuration as detectNonEnglishText
 * @returns true if English, false if non-English
 *
 * @example
 * isEnglish("The sky is blue");   // true
 * isEnglish("Le ciel est bleu");  // false
 */
export const isEnglish = (
  inputText: string | null | undefined,
  options: DetectionOptions = {},
): boolean => {
  return !detectNonEnglishText(inputText, options);
};

/**
 * Clears both the franc language-analysis cache and the word-lookup cache.
 * Call this in long-running applications to free memory or to reset state
 * between independent detection sessions.
 *
 * @example
 * clearLanguageDetectorCaches(); // frees all cached results
 */
export const clearLanguageDetectorCaches = (): void => {
  francCache.clear();
  wordCache.clear();
};
