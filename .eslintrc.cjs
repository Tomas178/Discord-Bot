/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',

    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/*.js'],
  rules: {
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',

    'no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],

    'import/prefer-default-export': 'off',

    'node/no-unsupported-features/es-syntax': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      extends: ['plugin:vitest/recommended'],
    },
  ],
};
