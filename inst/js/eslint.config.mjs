import js from "@eslint/js";
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["*.*"],
  },
  {
    files: ["src/**/*.js"],
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": ["warn"] // warn unused vars
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.stylistic
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"] // TS-aware unused vars
    },
  },
  {
    files: ["src/**"],
    extends: [stylistic.configs.customize({
      indent: 4,
      quotes: "double",
      semi: true,
      severity: "warn"
    })],
    rules: {
      // "@stylistic/indent": ["warn"],
      "@stylistic/brace-style": ["warn", "1tbs"],
      "@stylistic/semi": ["error"],
      "@stylistic/max-statements-per-line": ["error", { max: Infinity }]
    }
  },
]);
