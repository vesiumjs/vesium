import { ColorBlendMode } from 'cesium';
import { z } from 'zod';

const strings = ['HIGHLIGHT', 'REPLACE', 'MIX'] as const;

/**
 * `Cesium.ColorBlendMode` JSON ZodSchema
 */
export function ColorBlendModeZodSchema() {
  return z.object({
    parser: z.literal('ColorBlendMode'),
    value: z.enum(strings),
  });
}

export type ColorBlendModeJSON = z.infer<ReturnType<typeof ColorBlendModeZodSchema>>;

/**
 * Convert `Cesium.ColorBlendMode` instance to JSON
 */
export function ColorBlendModeToJSON(instance?: ColorBlendMode): ColorBlendModeJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(ColorBlendMode).parse(instance);
  return {
    parser: 'ColorBlendMode',
    value: Object.keys(ColorBlendMode).find((key: any) => Reflect.get(ColorBlendMode, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.ColorBlendMode` instance
 */
export function ColorBlendModeFromJSON(json?: ColorBlendModeJSON): ColorBlendMode | undefined {
  if (json) {
    return ColorBlendMode[json.value];
  }
}
