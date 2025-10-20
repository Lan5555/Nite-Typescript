import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JS and TS config
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // Needed for full type-aware linting
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: "latest",
      },
      globals: globals.browser,
    },
    plugins: {
      // Include TS plugin
      '@typescript-eslint': tseslint.plugin,
    },
    // Extend recommended configs
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      // ✅ Your custom rules
      'semi': ['error', 'always'],
      'eqeqeq': ['error', 'always'],
      'no-unused-vars': 'off', // Disable base rule
      '@typescript-eslint/no-unused-vars': 'warn', // Enable TS-specific version
      'indent': ['error', 2],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-undef': 'off', // Disable for TS (handled by TS compiler)
    }
  }
]);
