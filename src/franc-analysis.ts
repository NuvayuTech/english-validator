import { francAll } from "franc";
import { FRANC_CACHE_LIMIT } from "./constants";
import { LanguageResult } from "./types";
import { cacheSet } from "./utils";

// ─── Core Language Analysis ───────────────────────────────────────────────────

/** LRU-style cache for franc language analysis results. */
export const francCache = new Map<string, [string, number]>();

/**
 * Analyses text using the franc trigram-based language detection library.
 * Inspects the top 5 results for English with >= 0.9 confidence before
 * falling back to the top overall result.
 *
 * Results are memoised in an LRU-style cache (max {@link FRANC_CACHE_LIMIT}
 * entries) so repeated lookups for the same text are O(1).
 *
 * @param cleanText - Preprocessed text to analyse
 * @returns Detected language ISO 639-3 code and its confidence score
 */
export function francLanguageAnalysis(cleanText: string): LanguageResult {
  if (francCache.has(cleanText)) {
    const [language, confidence] = francCache.get(cleanText)!;
    return { language, confidence };
  }

  const detectedLanguage = francAll(cleanText);

  for (const [lang, conf] of detectedLanguage.slice(0, 5)) {
    if (lang === "eng" && conf >= 0.9) {
      cacheSet(francCache, FRANC_CACHE_LIMIT, cleanText, [lang, conf]);
      return { language: lang, confidence: conf };
    }
  }

  const [language, confidence] = detectedLanguage[0];
  cacheSet(francCache, FRANC_CACHE_LIMIT, cleanText, detectedLanguage[0]);
  return { language, confidence };
}
