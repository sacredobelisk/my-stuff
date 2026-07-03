import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import tanstack from "@tanstack/eslint-plugin-query";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignores = ["**/build/**", "**/node_modules/**", "**/.react-router/**/*.ts", "package-lock.json"];
const jsFiles = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];

export default defineConfig([
  { ignores },
  {
    files: jsFiles,
    plugins: { js },
    extends: [
      "js/recommended",
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      tanstack.configs["flat/recommended"],
    ],
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  tseslint.configs.recommended,
  { ...pluginReact.configs.flat.recommended, files: jsFiles },
  { ...reactHooks.configs.flat.recommended, files: jsFiles },

  { files: ["**/*.json"], ...json.configs.recommended, language: "json/json" },
  { files: ["**/*.jsonc"], ...json.configs.recommended, language: "json/jsonc" },
  { files: ["**/*.css"], ...css.configs.recommended, language: "css/css" },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      "no-empty-pattern": "warn",
      "react-hooks/preserve-manual-memoization": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },

  {
    rules: {
      "@tanstack/query/exhaustive-deps": [
        "error",
        {
          allowlist: {
            variables: ["del", "get", "patch", "post", "put"],
          },
        },
      ],
    },
  },

  // turn off no-empty-pattern rule for route meta functions
  {
    files: ["**/app/routes/**/*.tsx"],
    rules: {
      "no-empty-pattern": "off",
    },
  },
]);
