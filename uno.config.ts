import { fileURLToPath } from 'node:url';
import {
  defineConfig,
  presetIcons,
  presetWind4,
} from 'unocss';
import { generateIconCollection } from './internals/icon';

const customIconPath = fileURLToPath(new URL('./icons', import.meta.url));

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      autoInstall: true,
      collections: {
        custom: generateIconCollection(customIconPath, { multiColor: true, varPrefix: 'custom' }),
      },
    }),
  ],
});
