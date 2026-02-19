const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/dictionary.ts");
const lines = fs.readFileSync(filePath, "utf-8").split("\n");

const commonWords = [];
const medicalTerms = [];
const wordsToRemove = [];

let section = null;

for (const line of lines) {
  const trimmed = line.trim();

  if (trimmed.startsWith("const commonWords")) {
    section = "common";
    continue;
  }
  if (trimmed.startsWith("const medicalTerms")) {
    section = "medical";
    continue;
  }
  if (trimmed.startsWith("export const englishDictionary")) {
    section = null;
    continue;
  }
  if (trimmed.startsWith("export const wordsToRemove")) {
    section = "wtr";
    continue;
  }

  if (section === "common" || section === "medical") {
    // Match: "word", or "word"
    const match = trimmed.match(/^"([^"]*)",?$/);
    if (match) {
      if (section === "common") commonWords.push(match[1]);
      else medicalTerms.push(match[1]);
    }
  }

  if (section === "wtr") {
    // Match: ["Word", true], or ["Word", false],
    const match = trimmed.match(/^\["([^"]+)",\s*(true|false)\],?$/);
    if (match) {
      wordsToRemove.push(match[1]);
    }
  }
}

console.log("commonWords:", commonWords.length);
console.log("medicalTerms:", medicalTerms.length);
console.log("wordsToRemove:", wordsToRemove.length);

const allWords = [...new Set([...commonWords, ...medicalTerms])];
console.log("Unique dictionary words:", allWords.length);

// Build compact dictionary.ts with newline-delimited strings
const wordsJoined = allWords.join("\\n");
const geoJoined = wordsToRemove.join("\\n");

const output = [
  '/**',
  ' * English dictionary — compact newline-delimited format.',
  ' *',
  ' * Words are stored as a single string to minimise bundle size.',
  ' * The Set is constructed once at module load time.',
  ' *',
  ` * Total unique words: ${allWords.length}`,
  ` * Geographical terms: ${wordsToRemove.length}`,
  ' */',
  '',
  '/** All English words as a newline-delimited string. */',
  'const WORDS_RAW =',
  `  "${wordsJoined}";`,
  '',
  '/** Geographical / proper-noun terms to strip before detection. */',
  'const GEO_TERMS_RAW =',
  `  "${geoJoined}";`,
  '',
  '/** Set of all known English words (built once at module load). */',
  'export const englishDictionary: Set<string> = new Set(WORDS_RAW.split("\\n"));',
  '',
  '/** Geographical terms as tuples — all flagged true for backward compat. */',
  'export const wordsToRemove: [string, boolean][] = GEO_TERMS_RAW.split("\\n").map(',
  '  (w) => [w, true] as [string, boolean]',
  ');',
  '',
].join("\n");

fs.writeFileSync(filePath, output);

const stats = fs.statSync(filePath);
console.log(
  "New dictionary.ts size:",
  (stats.size / 1024).toFixed(0),
  "KB",
  "(" + (stats.size / 1024 / 1024).toFixed(2) + " MB)"
);
