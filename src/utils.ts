import { WHITESPACE_REGEX } from './constants';

// ─── Utility Helpers (DRY) ───────────────────────────────────────────────────

/**
 * Inserts a key-value pair into an LRU-style Map cache. When the cache
 * reaches its size limit, the oldest entry (first key) is evicted before
 * the new entry is added.
 *
 * Extracted to eliminate duplicated eviction logic across caches (DRY).
 *
 * @typeParam K - Cache key type
 * @typeParam V - Cache value type
 * @param cache - The Map to manage
 * @param limit - Maximum number of entries before eviction triggers
 * @param key   - Key for the new entry
 * @param value - Value for the new entry
 */
export function cacheSet<K, V>(cache: Map<K, V>, limit: number, key: K, value: V): void {
  if (cache.size >= limit) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

/**
 * Type-guard that validates a value is a non-empty string.
 * Replaces repeated `!text || typeof text !== "string"` checks (DRY).
 *
 * @param value - The value to check
 * @returns true if value is a string with length > 0
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Collapses consecutive whitespace to a single space and trims
 * leading/trailing whitespace. Centralises a pattern used by
 * multiple preprocessing functions (DRY).
 *
 * @param text - The text to normalise
 * @returns Whitespace-normalised text
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(WHITESPACE_REGEX, ' ').trim();
}
