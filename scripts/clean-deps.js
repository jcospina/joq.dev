import { cleanPaths } from './clean-paths.js';

async function cleanDeps() {
  const paths = [
    'node_modules',
    'apps/**/node_modules',
    'packages/**/node_modules',
  ];
  await cleanPaths(paths);
  console.log('✅ Dependencies removed.');
}

cleanDeps().catch(err => {
  console.error('❌ clean:deps failed:', err);
  process.exit(1);
});
