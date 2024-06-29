import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...prettier.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
