import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import FastGlob from 'fast-glob';
import { normalizePath } from 'vite';

export function getAllPackages() {
  const filePaths = FastGlob.sync(`./packages/*/package.json`, {
    absolute: true,
    onlyFiles: true,
    ignore: ['node_modules', 'dist', '.vitepress'],
  });

  return filePaths.map(filePath => ({
    root: normalizePath(resolve(filePath, '../')),
    packageJSON: JSON.parse(readFileSync(filePath).toString()) as Record<string, any>,

  })).filter(e => !e.packageJSON.private);
}
