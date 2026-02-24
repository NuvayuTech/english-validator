import { wordsToRemove } from "./dictionary";

// ─── Cache Limits ─────────────────────────────────────────────────────────────

export const FRANC_CACHE_LIMIT = 1000;
export const WORD_CACHE_LIMIT = 5000;

// ─── Document ID Patterns ─────────────────────────────────────────────────────

/** Document ID patterns used for matching (non-global). */
export const DOCUMENT_PATTERNS_MATCH: readonly RegExp[] = [
  /\b[A-Z]{2,6}\d{1,4}(-[A-Z]{1,3}\d{1,4}){1,3}\b/,
  /\b[A-Z]{2,6}\d{2,4}-[A-Z]{1,3}\d{1,3}\b/,
  /\b[A-Z]{2,6}\d{1,4}\b/,
];

/** Document ID patterns used for removal (global flag). */
export const DOCUMENT_PATTERNS_REMOVE: readonly RegExp[] = [
  /\b[A-Z]{2,6}\d{0,4}(-[A-Z]{2,6}\d{0,4}){1,4}\b/g,
  /\b[A-Z]{2,6}\d{2,4}-[A-Z]{1,3}\d{1,3}\b/g,
  /\b[A-Z]{2,6}\d{1,4}\b/g,
  /\b[A-Z]{2,4}-[A-Z]{2,4}\d{2,4}\b/g,
];

// ─── Non-English Detection Patterns ──────────────────────────────────────────

/**
 * Single combined regex for non-English European characters.
 * Covers German (äöüß), French (éèêë), Spanish (ñ), Italian (ìò),
 * Scandinavian (åøæ), Polish (łńś), and Turkish (şğı).
 */
export const NON_ENGLISH_CHARS_REGEX =
  /[äöüßéèêëàâçùûÿæœáíóúñ¡¿ìòåøąćęłńśźżşğı]/i;

/**
 * Single combined regex for word suffixes typical of non-English languages.
 * German (-keit, -schaft), Spanish (-ción), Italian (-zione),
 * Dutch (-baar, -lijk), Portuguese (-agem, -ção), French (-eur).
 */
export const NON_ENGLISH_ENDINGS_REGEX =
  /(?:keit|schaft|ción|zione|mente|baar|lijk|eur|agem|ção)$/i;

/** Non-English articles and prepositions from multiple European languages. */
export const NON_ENGLISH_FUNCTION_WORDS_REGEX =
  /^(le|la|les|du|des|dans|avec|sans|sur|sous|entre|el|los|las|del|al|con|sin|por|der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mit|il|lo|gli|het|een|op|aan|voor|met|door|os|dos|das|nos|nas|um|uma)$/i;

/** Non-English vocabulary patterns grouped by language family. */
export const NON_ENGLISH_WORD_PATTERNS: readonly RegExp[] = [
  /^(und|oder|Wann|aber|Kann|wenn|weil|dass|ob|für|nicht|kein|keine|nur|sehr|schon|noch|jetzt|immer|wieder|möchte|würde|hätte|könnte|sollte|müsste|dürfte)$/i,
  /^(que|como|porque|pero|cuando|donde|quien|cual|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)$/i,
  /^(est|sont|était|être|avoir|faire|dire|voir|pouvoir|vouloir|devoir|falloir|savoir|quand|où|pourquoi|qui|quel|quelle|quels|quelles|ce|cette|ces|cet)$/i,
  /^(sono|sei|è|siamo|siete|sono|essere|avere|fare|dire|andare|vedere|dare|sapere|potere|volere|come|quando|dove|perché|chi|quale|quali)$/i,
  /^(en|hoe|es|Er|Wanneer|je|stel|kritiek|et|kritisk|maar|want|omdat|hoewel|terwijl|tenzij|indien|toen|totdat|voordat|nadat|zodat|mits|toch|dus|immers|namelijk)$/i,
  /^(eu|tu|ele|ela|nós|vós|eles|elas|isto|isso|aquilo|mesmo|mesma|mesmos|mesmas|próprio|própria|próprios|próprias)$/i,
  /^(ben|sen|biz|siz|onlar|bana|sana|ona|bize|size|onlara|benim|senin|onun|bizim|sizin|onların)$/i,
  /^(jeg|mig|min|mit|mine|dig|din|dit|dine|han|ham|hans|hun|hende|hendes|den|det|de|dem|deres|denne|dette|disse)$/i,
];

// ─── Geographical Term Patterns ───────────────────────────────────────────────

/** Precompiled geographical term patterns — built once at module load. */
export const GEO_TERM_PATTERNS: readonly RegExp[] = wordsToRemove.map(
  ([word]: [string, boolean]) =>
    new RegExp(`\\b${word}\\b|\\b${word}s\\b`, "i")
);

// ─── Text Processing Patterns ─────────────────────────────────────────────────

/** Regex to strip punctuation from individual words. */
export const WORD_PUNCTUATION_REGEX =
  /['''\-""`~!@#$%^&*()+={}[\]|\\:";'<>?,./]/g;

/** Regex for collapsing whitespace runs. */
export const WHITESPACE_REGEX = /\s+/g;

/** Regex to strip non-letter/non-whitespace Unicode characters. */
export const NON_LETTER_REGEX = /[^\p{L}\s.,!?:;'"()-]/gu;

/** Regex that matches only English-compatible characters. */
export const ENGLISH_CHARS_REGEX = /^[a-zA-Z0-9'-]+$/;

/** Regex for standalone numeric strings. */
export const NUMBERS_ONLY_REGEX = /^\d+$/;

/** Regex for uppercase abbreviations (2+ uppercase letters, optionally with digits). */
export const ABBREVIATION_REGEX = /^[A-Z]{2,}[0-9]*$/;
