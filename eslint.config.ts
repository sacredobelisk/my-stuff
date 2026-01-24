import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
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
      "no-empty-pattern": "warn",
      "react/react-in-jsx-scope": "off",
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },

  { files: ["**/*.json"], ignores, plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], ignores, plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
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
