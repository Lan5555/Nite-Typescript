import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // TypeScript files only (with type-aware linting)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        // eslint-disable-next-line no-undef
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: "latest",
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // ✅ Your custom TypeScript rules
      'semi': ['error', 'always'],
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': 'warn',
      'indent': ['error', 2],
      'no-debugger': 'warn',
      'prefer-const': 'error',
    },
  },

  // Plain JS files (no TypeScript parser)
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,

      // ✅ Your custom JS rules
      'semi': ['error', 'always'],
      'eqeqeq': ['error', 'always'],
      'no-unused-vars': 'warn',
      'indent': ['error', 2],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
]);
