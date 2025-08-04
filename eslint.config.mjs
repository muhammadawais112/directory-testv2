import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: false,
});

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
        FormData: "readonly",
        FileReader: "readonly",
        process: "readonly"
      }
    }
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element":'off',
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "off"
    },
  },
  ...compat.config({
    extends: [
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
    ],
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react/jsx-key":  'off',
      "react/self-closing-comp": "off",
      "react/no-unescaped-entities": "off"
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }),
  {
    rules: {
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/img-redundant-alt": "off"
    }
  },
  {
    rules: {
      "no-console":  "off",
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-constant-binary-expression": "off",
      "no-unsafe-optional-chaining": "off",
      "no-empty": ["error", { "allowEmptyCatch": true }]
    }
  },
];