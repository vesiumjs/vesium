import type { UserConfig } from 'tsdown/config';
import { defineConfig } from 'tsdown/config';
import Vue from 'unplugin-vue/rolldown';

const iifeGlobals = {
  'vue': 'Vue',
  '@vueuse/core': 'VueUse',
  '@vueuse/shared': 'VueUse',
  'cesium': 'Cesium',
  'vesium': 'Vesium',
  '@turf/turf': 'turf',
  'zod': 'z',
};

const config: UserConfig = {
  entry: '*.ts',
  workspace: true,
  format: ['es', 'cjs', 'iife'],
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  plugins: [
    Vue(),
  ],
  globalName: 'Vesium',
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
