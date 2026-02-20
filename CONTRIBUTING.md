# Contributing to english-validator

Thank you for your interest in contributing!

## Getting Started

```bash
git clone https://github.com/NuvayuTech/english-validator.git
cd english-validator
npm install
npm test
```

## Development Workflow

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Write a **failing test first** (TDD)
4. Implement the minimal code to pass the test
5. Ensure all tests pass: `npm test`
6. Ensure build works: `npm run build`
7. Commit with a descriptive message
8. Open a Pull Request against `main`

## Code Standards

- **TypeScript** — all source code lives in `src/`
- **≥80% test coverage** — CI enforces this
- **No breaking changes** to `isEnglish()` or `detectNonEnglishText()` signatures
- **DRY** — no duplicated logic
- **JSDoc comments** on all public functions

## Reporting Issues

Open an issue at [GitHub Issues](https://github.com/NuvayuTech/english-validator/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Node.js version and environment

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
