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
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      { singleline: { delimiter: 'semi', requireLast: false } },
    ],
    semi: ['error', 'always'],
    // Clean Code specific rules
    'id-length': ['error', { min: 2 }],
    'max-lines': ['error', 300],
    complexity: ['error', 10],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 4],
    'max-statements': ['error', 15],
    camelcase: 'error',
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false,
        properties: true,
        capIsNewExceptions: [
          'Entity',
          'PrimaryGeneratedColumn',
          'ManyToOne',
          'JoinColumn',
          'Column',
        ],
      },
    ],
    'no-mixed-operators': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'spaced-comment': ['error', 'always'],
    'multiline-comment-style': ['error', 'starred-block'],
    'no-throw-literal': 'error',
    'handle-callback-err': 'error',
    'no-redeclare': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    // Import sorting and organization
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^@?\\w'],
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
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
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
