import { ShadowMode } from 'cesium';
import { z } from 'zod';

const strings = ['DISABLED', 'ENABLED', 'CAST_ONLY', 'RECEIVE_ONLY'] as const;

/**
 * `Cesium.ShadowMode` JSON ZodSchema
 */
export function ShadowModeZodSchema() {
  return z.object({
    parser: z.literal('ShadowMode'),
    value: z.enum(strings),
  });
}

export type ShadowModeJSON = z.infer<ReturnType<typeof ShadowModeZodSchema>>;

/**
 * Convert `Cesium.ShadowMode` instance to JSON
 */
export function ShadowModeToJSON(instance?: ShadowMode): ShadowModeJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(ShadowMode).parse(instance);
  return {
    parser: 'ShadowMode',
    value: Object.keys(ShadowMode).find((key: any) => Reflect.get(ShadowMode, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.ShadowMode` instance
 */
export function ShadowModeFromJSON(json?: ShadowModeJSON): ShadowMode | undefined {
  if (json) {
    return ShadowMode[json.value];
  }
}
