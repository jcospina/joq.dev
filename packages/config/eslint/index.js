export async function createConfig({ tsconfigPath = './tsconfig.json' } = {}) {
  const [
    { default: pluginPrettier },
    { default: pluginImport },
    { default: pluginUnused },
    { default: pluginComments },
  ] = await Promise.all([
    import('eslint-plugin-prettier'),
    import('eslint-plugin-import'),
    import('eslint-plugin-unused-imports'),
    import('eslint-plugin-eslint-comments'),
  ]);

  const js = (await import('@eslint/js')).default;
  const tseslint = await import('typescript-eslint');
  const prettier = await import('eslint-config-prettier');

  return [
    {
      ignores: [
        '**/dist/**',
        '**/build/**',
        '**/node_modules/**',
        '**/*.d.ts',
        '**/.vite/**',
        '**/*.log',
        '**/.next/**',
        '**/.astro/**',
        '**/.tsbuildinfo',
        '**/.vscode/**',
        '**/.idea/**',
      ],
    },
    js.configs.recommended,
    {
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: (await import('globals')).default.node,
      },
    },
    {
      name: 'prettier:overrides',
      plugins: { prettier: pluginPrettier },
      rules: {
        ...prettier.rules,
        'prettier/prettier': 'error',
      },
    },

    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: tsconfigPath,
          tsconfigRootDir: process.cwd(),
          sourceType: 'module',
          ecmaVersion: 'latest',
          globals: (await import('globals')).default.browser,
        },
      },
      plugins: {
        import: pluginImport,
        'unused-imports': pluginUnused,
        'eslint-comments': pluginComments,
        '@typescript-eslint': tseslint.plugin,
      },
      rules: {
        ...tseslint.configs.recommended[0].rules,
        ...tseslint.configs.recommendedTypeChecked[0].rules,
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        'import/no-unresolved': 'error',
        'import/no-duplicates': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
        'eslint-comments/disable-enable-pair': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-disable': 'error',
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          { allowExpressions: true },
        ],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ];
}
