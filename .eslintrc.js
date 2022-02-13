module.exports = {
  extends: ["airbnb", "prettier", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off", // sometimes we don't care

    // It's more conveinient to be able to define named-interfaces to capture intent,
    // even if empty i.e. more readible code instead of more concise code.
    "@typescript-eslint/no-empty-interface": "off",

    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", args: "none", ignoreRestSiblings: false },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "class-methods-use-this": "off",
    "func-names": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      { js: "never", jsx: "never", ts: "never", tsx: "never" },
    ],
    "import/no-named-as-default": "off",
    "import/prefer-default-export": "off",
    "max-classes-per-file": ["error", 6],
    "no-empty-function": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": [
      "error",
      { vars: "all", args: "none", ignoreRestSiblings: false },
    ],
    "no-use-before-define": "off",
    "react/forbid-prop-types": "off",
    "react/function-component-definition": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/jsx-no-bind": "off",
    "react/no-unstable-nested-components": "off",

    // Not sure if we'll regret disabling this, but it doesn't seem to offer much
    // bennefit
    "react/require-default-props": "off",

    // note you must disable the base rule as it can report incorrect errors
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
  env: {
    jest: true,
  },
  parserOptions: {
    project: ["tsconfig.json"],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "jest", "@typescript-eslint"],
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
};
