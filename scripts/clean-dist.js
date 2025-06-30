import { cleanPaths } from './clean-paths';

async function cleanDeps() {
  const paths = ['dist', 'apps/**/dist', 'packages/**/dist'];
  await cleanPaths(paths);
  console.log('✅ Dist files removed.');
}

cleanDeps().catch(err => {
  console.error('❌ clean:dist failed:', err);
  process.exit(1);
});
