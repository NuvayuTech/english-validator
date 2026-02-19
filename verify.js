const {
  isEnglish,
  detectNonEnglishText,
  matchesDocumentPattern,
  clearLanguageDetectorCaches,
} = require("./dist/index.cjs.js");

// ─── Basic English Detection ─────────────────────────────────────────────────

console.log("=== Basic English Detection ===");
console.log("English sentence:", isEnglish("The quick brown fox jumps over the lazy dog")); // true
console.log("French sentence:", isEnglish("Ceci est une phrase en français")); // false
console.log("German sentence:", isEnglish("Das ist ein deutscher Satz und er ist lang genug")); // false
console.log("Spanish sentence:", isEnglish("Esta es una frase en español que es bastante larga")); // false
console.log("Empty string:", isEnglish("")); // true
console.log("Null:", isEnglish(null)); // true

// ─── detectNonEnglishText (inverse) ──────────────────────────────────────────

console.log("\n=== detectNonEnglishText (inverse of isEnglish) ===");
console.log("English:", detectNonEnglishText("Hello, how are you today?")); // false
console.log("German:", detectNonEnglishText("Dies ist ein deutscher Satz und er ist lang genug")); // true

// ─── Numbers & Abbreviations ────────────────────────────────────────────────

console.log("\n=== Numbers & Abbreviations ===");
console.log("With numbers:", isEnglish("There are 42 apples in the basket")); // true
console.log("Abbreviations:", isEnglish("NATO FBI CIA are important organizations")); // true
console.log("Abbreviations disabled:", isEnglish("NATO FBI CIA are important", { allowAbbreviations: false })); // may vary

// ─── Custom Patterns ────────────────────────────────────────────────────────

console.log("\n=== Custom Patterns ===");
console.log(
  "JIRA ticket (no pattern):",
  isEnglish("Fix bug PROJ-1234 in login flow")
); // may be false (PROJ-1234 not English)
console.log(
  "JIRA ticket (with pattern):",
  isEnglish("Fix bug PROJ-1234 in login flow", {
    customPatterns: [/PROJ-\d+/g],
  })
); // true

// ─── Exclude Words ──────────────────────────────────────────────────────────

console.log("\n=== Exclude Words ===");
console.log(
  "Kubernetes (no exclude):",
  isEnglish("Deploy Kubernetes pods and monitor dashboards")
); // may be false
console.log(
  "Kubernetes (with exclude):",
  isEnglish("Deploy Kubernetes pods and monitor dashboards", {
    excludeWords: ["Kubernetes"],
  })
); // true

// ─── Document Patterns ──────────────────────────────────────────────────────

console.log("\n=== Document Pattern Matching ===");
console.log("AEM01-WI-DSU06-SD01:", matchesDocumentPattern("AEM01-WI-DSU06-SD01")); // true
console.log("Hello world:", matchesDocumentPattern("Hello world")); // false

// ─── Threshold Tuning ───────────────────────────────────────────────────────

console.log("\n=== Threshold Tuning ===");
console.log(
  "Lenient (0.5):",
  isEnglish("Hello mundo amigo friend", { englishThreshold: 0.5 })
); // true
console.log(
  "Strict (0.95):",
  isEnglish("Hello mundo amigo friend", { englishThreshold: 0.95 })
); // false

// ─── Combined Options ───────────────────────────────────────────────────────

console.log("\n=== Combined Options ===");
console.log(
  "All options:",
  isEnglish("TKT-5678 Deploy Terraform stack monitored by Datadog", {
    customPatterns: [/TKT-\d+/g],
    excludeWords: ["Datadog", "Terraform"],
    englishThreshold: 0.7,
    allowAbbreviations: true,
  })
); // true

// ─── Cache Clearing ─────────────────────────────────────────────────────────

console.log("\n=== Cache Clearing ===");
clearLanguageDetectorCaches();
console.log("Caches cleared successfully");

console.log("\n✅ Verification complete!");
