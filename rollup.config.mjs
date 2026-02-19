import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

const plugins = [
  typescript({ tsconfig: "./tsconfig.json", declaration: true, declarationDir: "./dist" }),
  resolve(),
  commonjs(),
  json(),
];

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.cjs.js",
    format: "cjs",
    exports: "named",
  },
  plugins,
  external: ["franc"],
};
