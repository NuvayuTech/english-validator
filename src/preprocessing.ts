import {
  DOCUMENT_PATTERNS_MATCH,
  DOCUMENT_PATTERNS_REMOVE,
  GEO_TERM_PATTERNS,
  NON_LETTER_REGEX,
} from "./constants";
import { isNonEmptyString, normalizeWhitespace } from "./utils";

// ─── Document Pattern Operations ──────────────────────────────────────────────

/**
 * Tests whether text contains a document ID pattern such as
 * AEM01-WI-DSU06-SD01, AURG340-SF06, or AEM01. Uses the shared
 * {@link DOCUMENT_PATTERNS_MATCH} constant (DRY with removeDocumentPatterns).
 *
 * @param text - The text to check for document ID patterns
 * @returns true if at least one document ID pattern is found
 */
export const matchesDocumentPattern = (
  text: string | null | undefined
): boolean => {
  if (!isNonEmptyString(text)) return false;
  return DOCUMENT_PATTERNS_MATCH.some((pattern) => pattern.test(text));
};

/**
 * Strips document ID patterns from text so they don't interfere with
 * language detection. Uses the shared {@link DOCUMENT_PATTERNS_REMOVE}
 * constant with global flags for replacement.
 *
 * @param text - Input text potentially containing document IDs
 * @returns Text with document patterns removed and whitespace normalised
 */
function removeDocumentPatterns(text: string): string {
  let cleaned = text;
  for (const pattern of DOCUMENT_PATTERNS_REMOVE) {
    cleaned = cleaned.replace(pattern, "");
  }
  return normalizeWhitespace(cleaned);
}

// ─── Geographical Term Removal ────────────────────────────────────────────────

/**
 * Removes geographical terms (country names, regions, cities) that appear
 * as standalone words to prevent false positives during detection.
 *
 * Patterns are precompiled once at module load via {@link GEO_TERM_PATTERNS}
 * rather than rebuilt on every call (optimisation).
 *
 * @param inputText - Input text containing potential geographical terms
 * @returns Text with geographical terms removed and whitespace normalised
 */
function removeGeographicalTerms(
  inputText: string | null | undefined
): string {
  if (!isNonEmptyString(inputText)) return inputText as unknown as string;

  let result = inputText;
  for (const pattern of GEO_TERM_PATTERNS) {
    result = result.replace(pattern, "");
  }
  return normalizeWhitespace(result);
}

// ─── Text Preprocessing Pipeline ──────────────────────────────────────────────

/**
 * Preprocesses raw input text for language detection by applying
 * a multi-stage cleaning pipeline:
 *
 * 1. Remove document ID patterns (e.g. AEM01-WI-DSU06-SD01)
 * 2. Remove geographical terms that cause false positives
 * 3. Apply user-supplied custom regex patterns
 * 4. Remove user-supplied exclude words
 * 5. Strip non-letter Unicode characters and normalise whitespace
 *
 * Extracted as a separate module following the Single Responsibility
 * Principle — keeps cleaning logic decoupled from detection logic.
 *
 * @param text - Raw input text
 * @param customPatterns - Optional user-supplied regex patterns to strip
 * @param excludeWords - Optional user-supplied words to remove
 * @returns Cleaned, normalised text ready for word and trigram analysis
 */
export function preprocessText(
  text: string,
  customPatterns?: RegExp[],
  excludeWords?: string[]
): string {
  let processed = removeDocumentPatterns(text);
  processed = removeGeographicalTerms(processed);

  // Apply user-supplied regex patterns
  if (customPatterns && customPatterns.length > 0) {
    for (const pattern of customPatterns) {
      processed = processed.replace(pattern, "");
    }
  }

  // Remove user-supplied words (case-insensitive, whole-word match)
  if (excludeWords && excludeWords.length > 0) {
    for (const word of excludeWords) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      processed = processed.replace(
        new RegExp(`\\b${escaped}\\b`, "gi"),
        ""
      );
    }
  }

  processed = processed.replace(NON_LETTER_REGEX, " ");
  return normalizeWhitespace(processed);
}
