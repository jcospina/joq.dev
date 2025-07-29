import { rm } from 'fs/promises';
import fg from 'fast-glob';

/**
 * Remove a list of filesystem paths.
 *
 * @param {string[]} paths         Array of glob or path strings
 * @param {{ recursive?: boolean, force?: boolean }} [options]
 *        rm options: recursive (`true` by default), force (`true` by default)
 */
export async function cleanPaths(paths, options = {}) {
  const { recursive = true, force = true } = options;

  // Expand globs into real paths
  const dirs = await fg(paths, { onlyDirectories: true, dot: true });

  await Promise.all(
    dirs.map(async dir => {
      await rm(dir, { recursive, force });
      console.log(`Removed: ${dir}`);
    }),
  );
}
