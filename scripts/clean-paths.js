import { rm } from 'fs/promises';

/**
 * Remove a list of filesystem paths.
 *
 * @param {string[]} paths         Array of glob or path strings
 * @param {{ recursive?: boolean, force?: boolean }} [options]
 *        rm options: recursive (`true` by default), force (`true` by default)
 */
export async function cleanPaths(paths, options = {}) {
  const { recursive = true, force = true } = options;

  await Promise.all(
    paths.map(async (p) => {
      try {
        await rm(p, { recursive, force });
        console.log(`Removed: ${p}`);
      } catch (err) {
        // ignore “not found” errors
        if (err.code !== 'ENOENT') {
          console.error(`Error removing ${p}:`, err);
        }
      }
    })
  );
}