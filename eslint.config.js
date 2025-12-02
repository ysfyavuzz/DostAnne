/* eslint-env node */
// https://docs.expo.dev/guides/using-eslint/
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends('expo', 'prettier'),
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'build/*', 'eslint.config.js'],
  },
  {
    rules: {
      // Custom rules can be added here
    },
  },
];
