module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'jsonc', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {}
    },
    {
      files: ['*.json', '*.jsonc', '*.md'],
      parser: 'jsonc-eslint-parser'
    }
  ]
};