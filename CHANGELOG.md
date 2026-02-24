# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2025-02-24

### Added

- ESLint (v9 flat config) + Prettier for code quality and formatting
- New npm scripts: `lint`, `lint:fix`, `format`, `format:check`, `check`
- ESLint and Prettier steps in GitHub Actions CI pipeline

### Fixed

- `package.json` exports order — `types` condition now listed first for proper TypeScript resolution
- `README.md` — corrected `isEnglish("")` comment from `false` to `true`
- `verify.js` — fixed import path from `./dist/index.cjs.js` to `./dist/index.cjs`
- Removed duplicate `./preprocessing` import in `index.ts`

## [2.0.1] - 2025-02-24

### Changed

- Refactored monolithic `index.ts` (573 lines) into 8 modular files following SOLID principles:
  - `types.ts` — interfaces (`DetectionOptions`, `LanguageResult`, `WordOptions`)
  - `constants.ts` — regex patterns and cache limits
  - `utils.ts` — generic helpers (`cacheSet`, `isNonEmptyString`, `normalizeWhitespace`)
  - `franc-analysis.ts` — trigram-based language detection
  - `preprocessing.ts` — text cleaning pipeline and document pattern matching
  - `non-english-checks.ts` — heuristic non-English detectors
  - `word-analysis.ts` — word-level English detection with caching
  - `index.ts` — thin public API layer

### Improved

- README with detailed API types, contraction resolution docs, language detection table (9 languages), and performance section

## [2.0.0] - 2025-02-23

### Changed

- **Breaking:** Halved package size with ESM wrapper strategy (3.4 MB unpacked, down from ~6.8 MB)

### Added

- CI workflow (GitHub Actions) with Node 18/20/22 matrix
- Contributing guide, security policy, issue/PR templates
- 80% coverage enforcement in CI

## [1.0.2] - 2025-02-22

### Added

- `customPatterns` option — remove custom regex patterns before validation
- `excludeWords` option — exclude specific words from validation
- `allowAbbreviations` option — treat uppercase abbreviations as English

### Fixed

- Restored `allowAbbreviations` check in `isEnglishWord`

### Improved

- README with use cases section and quick examples for each `DetectionOptions` parameter

## [1.0.1] - 2025-02-21

### Fixed

- ESM/CJS dual-format compatibility

### Changed

- TypeScript rewrite with SOLID/DRY refactoring
- Optimized bundle size (9.6 MB → 3.1 MB)

## [1.0.0] - 2025-02-20

### Added

- Initial release of `english-validator`
- `isEnglish(text, options?)` — returns `true` if text is English
- `detectNonEnglishText(text, options?)` — returns `true` if text is non-English
- `matchesDocumentPattern(text)` — checks for document ID patterns
- `clearLanguageDetectorCaches()` — clears internal LRU caches
- 274,810-word English dictionary
- Trigram-based language analysis via `franc`
- Heuristic detection for 9+ non-English language families
- LRU caching for performance (franc: 1,000 entries, word: 5,000 entries)
- Contraction resolution (e.g., `don't` → `do`)
- Geographic term filtering (865 patterns)
- Zero runtime dependencies for consumers

[2.0.2]: https://github.com/NuvayuTech/english-validator/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/NuvayuTech/english-validator/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/NuvayuTech/english-validator/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/NuvayuTech/english-validator/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/NuvayuTech/english-validator/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/NuvayuTech/english-validator/releases/tag/v1.0.0
