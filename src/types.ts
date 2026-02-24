// ─── Public Interfaces ────────────────────────────────────────────────────────

/** Configuration options for text detection functions. */
export interface DetectionOptions {
  /** Minimum ratio of English words required (0.0–1.0). Default: 0.8 */
  englishThreshold?: number;
  /** Words shorter than this are skipped during analysis. Default: 2 */
  minWordLength?: number;
  /** Whether standalone numbers count as English words. Default: true */
  allowNumbers?: boolean;
  /** Whether uppercase abbreviations (e.g. NATO, FBI) count as English. Default: true */
  allowAbbreviations?: boolean;
  /**
   * Custom regex patterns to strip from text before validation.
   * Use this to remove domain-specific identifiers, codes, or markup
   * that would otherwise interfere with language detection.
   *
   * @example
   * // Remove ticket IDs like JIRA-1234
   * customPatterns: [/\b[A-Z]+-\d+\b/g]
   */
  customPatterns?: RegExp[];
  /**
   * Custom words to remove from text before validation.
   * Case-insensitive, matches whole words only.
   * Use this for domain-specific terms, brand names, abbreviations,
   * or any tokens that should be ignored during detection.
   *
   * @example
   * excludeWords: ["ACME", "GmbH", "SDK"]
   */
  excludeWords?: string[];
}

// ─── Internal Interfaces ──────────────────────────────────────────────────────

/** Internal result from franc trigram-based language analysis. */
export interface LanguageResult {
  language: string;
  confidence: number;
}

/** Internal options for word-level English checks. */
export interface WordOptions {
  allowNumbers: boolean;
  allowAbbreviations: boolean;
}
