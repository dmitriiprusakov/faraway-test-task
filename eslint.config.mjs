import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores(["dist/**", ".tools/**", "cypress/screenshots/**", "cypress/videos/**"]),
	{
		files: ["**/*.{js,mjs}"],
		extends: [js.configs.recommended],
		languageOptions: { globals: globals.node },
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
		plugins: { "react-hooks": reactHooks },
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"@typescript-eslint/consistent-type-imports": "error",
		},
	},
	{
		files: ["cypress/**/*.ts", "cypress.config.ts"],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, cy: "readonly", Cypress: "readonly", describe: "readonly", it: "readonly", beforeEach: "readonly" },
		},
	},
]);
