/**
 * Generates the ESM wrapper (dist/index.mjs) by reading exports from the CJS bundle.
 * This avoids hardcoding export names in the build script.
 */
const fs = require('fs');
const path = require('path');

const cjsPath = path.join(__dirname, '..', 'dist', 'index.cjs');
const esmPath = path.join(__dirname, '..', 'dist', 'index.mjs');

// Load the CJS bundle and extract its named exports
const cjsModule = require(cjsPath);
const exportNames = Object.keys(cjsModule).filter((k) => k !== 'default');

if (exportNames.length === 0) {
  console.error('Error: No named exports found in dist/index.cjs');
  process.exit(1);
}

const esmContent = [
  "import cjsModule from './index.cjs';",
  `export const { ${exportNames.join(', ')} } = cjsModule;`,
  '',
].join('\n');

fs.writeFileSync(esmPath, esmContent);
console.log(`Generated dist/index.mjs with exports: ${exportNames.join(', ')}`);
