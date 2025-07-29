import { cleanPaths } from './clean-paths.mjs';

async function cleanDist() {
  const paths = ['dist', 'apps/**/dist', 'packages/**/dist'];
  await cleanPaths(paths);
  console.log('✅ Dist files removed.');
}

cleanDist().catch(err => {
  console.error('❌ clean:dist failed:', err);
  process.exit(1);
});
