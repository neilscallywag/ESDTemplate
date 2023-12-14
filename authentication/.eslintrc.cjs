module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'simple-import-sort',
    'prettier',
    'testing-library',
  ],
  root: true,
  ignorePatterns: ['.eslintrc.js', 'jest.config.ts'],
  rules: {
    'no-console': 'warn',
    'linebreak-style':
      process.platform === 'win32' ? ['error', 'windows'] : ['error', 'unix'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        singleline: {
          delimiter: 'semi',
          requireLast: true,
        },
      },
    ],
    semi: ['error', 'always'],
    // Rules for auto sort of imports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages.
          // Packages. `react` related packages come first.
          // Things that start with a letter (or digit or underscore), or
          // `@` followed by a letter.
          ['^react', '^@?\\w'],
          // Root imports
          // Shared imports should be separate from application imports.
          ['^(~shared)(/.*|$)'],
          ['^(~)(/.*|$)'],
          ['^(~typings)(/.*|$)'],
          [
            '^(~assets|~theme)(/.*|$)',
            '^(~contexts)(/.*|$)',
            '^(~constants)(/.*|$)',
            '^(~hooks)(/.*|$)',
            '^(~utils)(/.*|$)',
            '^(~services)(/.*|$)',
            '^(~components)(/.*|$)',
            '^(~templates)(/.*|$)',
          ],
          ['^(~pages)(/.*|$)', '^(~features)(/.*|$)'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
