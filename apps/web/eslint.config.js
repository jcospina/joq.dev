import { createConfig } from '@joq/eslint-config';
import { configs as reactHooksConfigs } from 'eslint-plugin-react-hooks';
import { configs as reactRefreshConfigs } from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default (async () => {
  const baseConfig = await createConfig({
    tsconfigPath: './tsconfig.eslint.json',
  });
  const baseTSConfig = baseConfig.find(
    config => config.files && config.files.includes('**/*.{ts,tsx}'),
  );

  const appWebTSConfig = {
    ...baseTSConfig,
    settings: {
      ...(baseTSConfig.settings || {}),
      'import/resolver': {
        typescript: {
          project: './tsconfig.eslint.json',
          alwaysTryTypes: true,
          extensions: ['.ts', '.tsx'],
        },
      },
    },
    languageOptions: {
      ...(baseTSConfig.languageOptions || {}),
      globals: {
        ...(baseTSConfig.languageOptions?.globals || {}),
        ...globals.browser,
      },
    },
  };

  const noTSConfig = baseConfig.filter(
    config => !(config.files && config.files.includes('**/*.{ts,tsx}')),
  );

  return [
    ...noTSConfig,
    appWebTSConfig,
    reactHooksConfigs['recommended-latest'],
    reactRefreshConfigs.vite,
  ];
})();
