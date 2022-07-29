module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["node_modules", "dist", "**/vendor/*.js"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    // 0: off, 1: warning, 2: error
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        vueIndentScriptAndStyle: true,
        singleQuote: false,
        quoteProps: "as-needed",
        bracketSpacing: true,
        trailingComma: "none",
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        arrowParens: "avoid",
        insertPragma: false,
        requirePragma: false,
        proseWrap: "never",
        htmlWhitespaceSensitivity: "ignore",
        endOfLine: "auto"
      }
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "no-case-declarations": "off",
    "no-useless-escape": 0,
    "no-console": "off",
    "no-debugger": 2,
    semi: 0,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/no-this-alias": 0,
    "no-var": 0,
    "no-unused-vars": 0,
    "prefer-const": 0,
    "no-return-assign": 0,
    "no-extend-native": 0,
    "no-empty": 0,
    camelcase: 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "import/no-extrane-dependencies": 0,
    "@typescript-eslint/no-empty-function": 0
  }
}
