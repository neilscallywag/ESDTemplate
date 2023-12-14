module.exports = {
  plugins: ["import", "simple-import-sort", "prettier", "testing-library"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
    },

    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
  ignorePatterns: ["build/**/*", "*.cjs"],
  env: { es6: true },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "linebreak-style":
      process.platform === "win32" ? ["error", "windows"] : ["error", "unix"],
    // Rules for auto sort of imports
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports.
          ["^\\u0000"],
          // Packages.
          // Packages. `react` related packages come first.
          // Things that start with a letter (or digit or underscore), or
          // `@` followed by a letter.
          ["^react", "^@?\\w"],
          // Root imports
          // Shared imports should be separate from application imports.
          ["^(~shared)(/.*|$)"],
          ["^(~)(/.*|$)"],
          ["^(~typings)(/.*|$)"],
          [
            "^(~assets|~theme)(/.*|$)",
            "^(~contexts)(/.*|$)",
            "^(~constants)(/.*|$)",
            "^(~hooks)(/.*|$)",
            "^(~utils)(/.*|$)",
            "^(~services)(/.*|$)",
            "^(~components)(/.*|$)",
            "^(~templates)(/.*|$)",
          ],
          ["^(~pages)(/.*|$)", "^(~features)(/.*|$)"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
};
