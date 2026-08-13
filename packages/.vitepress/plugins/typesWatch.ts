import type { Plugin } from 'vite';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { VITEPRESS_BUILD_TYPES_PATH, VITEPRESS_ROOT_PATH } from '../path.ts';

const require = createRequire(import.meta.url);

// `packages/.vitepress/.types` output mirrored from `tsconfig.build.json`
const TSCONFIG_BUILD_PATH = path.resolve(VITEPRESS_ROOT_PATH, '../../tsconfig.build.json');

/**
 * Regenerates the docs type definitions (`packages/.vitepress/.types`) in watch mode while the
 * docs dev server runs, so `dts` blocks always reflect the current source types without a manual
 * `pnpm build:types`.
 *
 * Serve mode only — `docs:build` runs `build:types` upfront, so build mode is unaffected.
 */
export function typesWatchPlugin(): Plugin {
  return {
    name: 'vesium:types-watch',
    apply: 'serve',
    configureServer(server) {
      // Full-reload the page when emitted `.d.ts` files are added or changed, so `dts` blocks
      // re-render with the fresh types. Watch the output dir ourselves: vite's own watcher is
      // not guaranteed to cover the generated directory, so its events are unreliable here.
      // Coalesce bursts (tsc emits many files at once) into a single reload.
      let reloadTimer: NodeJS.Timeout | undefined;
      const scheduleReload = () => {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => server.ws.send({ type: 'full-reload' }), 100);
      };
      const onTypesChange = (_event: string, filename: string | null) => {
        if (filename && (filename.endsWith('.d.ts') || filename.endsWith('.d.ts.map'))) {
          scheduleReload();
        }
      };
      // Ensure the output dir exists before watching it (created on the first tsc emit).
      fs.mkdirSync(VITEPRESS_BUILD_TYPES_PATH, { recursive: true });
      const typesWatcher = fs.watch(VITEPRESS_BUILD_TYPES_PATH, { recursive: true }, onTypesChange);

      // Spawn `vue-tsc --watch` (same binary as `build:types`) with the dev server lifecycle.
      // `--preserveWatchOutput` keeps the watch output as plain log lines instead of clearing
      // the shared terminal (which would wipe the vitepress dev server output).
      const vueTscPath = require.resolve('vue-tsc/bin/vue-tsc.js');
      const child = spawn(process.execPath, [
        vueTscPath,
        '-p',
        TSCONFIG_BUILD_PATH,
        '--emitDeclarationOnly',
        '--watch',
        '--preserveWatchOutput',
      ], {
        stdio: 'inherit',
      });
      child.on('error', (error) => {
        console.error('[types-watch] failed to start vue-tsc --watch:', error);
      });

      server.httpServer?.once('close', () => {
        clearTimeout(reloadTimer);
        typesWatcher.close();
        child.kill();
      });
    },
  };
}
