import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  hooks.configs.flat.recommended,
  a11y.flatConfigs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["src/app/todo/TodoApp.tsx"],
    rules: {
      // This local-only workspace hydrates from browser storage and OS preferences.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
