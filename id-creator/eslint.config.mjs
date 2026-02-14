import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import checkFile from "eslint-plugin-check-file";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "check-file": checkFile,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // Enforce PascalCase for component files (tsx/jsx), excluding index files
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{tsx,jsx}": "PASCAL_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // Enforce PascalCase for folders in Components and Pages
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/Components/**": "PASCAL_CASE",
          "src/Pages/**": "PASCAL_CASE",
        },
      ],
    },
  },
  // Exclude index files from naming convention
  {
    files: ["**/index.{ts,tsx,js,jsx}"],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },
  // Exclude hook files (use* camelCase) in Hooks folders
  {
    files: ["**/Hooks/use*.{ts,tsx,js,jsx}"],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },
]);
