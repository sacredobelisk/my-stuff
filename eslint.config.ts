/* eslint-disable @typescript-eslint/no-explicit-any */
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import tanstack from "@tanstack/eslint-plugin-query";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignores = ["**/build/**", "**/node_modules/**", "package-lock.json"];

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: [
      "js/recommended",
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      tanstack.configs["flat/recommended"],
    ],
    ignores,
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect",
      },
    },

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
    files: ["**/*.json"],
    ignores,
    plugins: { json: json as any },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    ignores,
    plugins: { json: json as any },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  { files: ["**/*.css"], ignores, plugins: { css }, language: "css/css", extends: ["css/recommended"] },

  // turn off some rules for react-router generated files
  {
    files: ["**/.react-router/**/*.ts"],
    rules: {
      semi: "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-namespace": "off",
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
