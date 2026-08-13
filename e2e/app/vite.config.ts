import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import UnpluginCesium from 'unplugin-cesium/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    vue(),
    UnpluginCesium({
      copyStaticFiles: true,
    }),
  ],
  server: {
    port: 4173,
    strictPort: true,
  },
});
