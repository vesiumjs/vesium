import type { UserConfig } from 'tsdown/config';
import fs from 'node:fs';

import fastGlob from 'fast-glob';
import { defineConfig } from 'tsdown/config';
import Vue from 'unplugin-vue/rolldown';

const glob = await fastGlob('./packages/*/package.json');

const packageNames = glob.map(path => JSON.parse(fs.readFileSync(path, 'utf-8')).name);
const internalIifeGlobals = packageNames.reduce((record, name) => {
  record[name] = 'Vesium';
  return record;
}, {} as Record<string, string>);

const iifeGlobals: Record<string, string> = {
  'vue': 'Vue',
  '@vueuse/core': 'VueUse',
  '@vueuse/shared': 'VueUse',
  'cesium': 'Cesium',
  '@turf/turf': 'turf',
  'zod': 'z',
  ...internalIifeGlobals,
};
console.log(iifeGlobals);

const config: UserConfig = {
  entry: '*.ts',
  workspace: true,
  inlineOnly: false,
  format: ['es', 'cjs', 'iife'],
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  plugins: [
    Vue(),
  ],
  globalName: 'Vesium',
  inputOptions: {
    checks: {
      pluginTimings: false,
    },
  },
  outputOptions: {
    // When format is 'iife', allowing multiple libraries to use the same 'globalName'
    extend: true,
    globals: iifeGlobals,
  },
};

const exts = {
  es: 'mjs',
  esm: 'mjs',
  cjs: 'cjs',
  iife: 'js',
  umd: 'js',
};
export default defineConfig([
  {
    ...config,
    dts: { sourcemap: true, vue: true },
    outExtensions: ({ format }) => ({ js: `.${exts[format] || 'js'}` }),
  },
  {
    ...config,
    dts: false,
    minify: true,
    outExtensions: ({ format }) => ({ js: `.min.${exts[format] || 'js'}` }),
  },
]);
