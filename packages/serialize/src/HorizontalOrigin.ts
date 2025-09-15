import { HorizontalOrigin } from 'cesium';
import { z } from 'zod';

const strings = ['CENTER', 'LEFT', 'RIGHT'] as const;

/**
 * `Cesium.HorizontalOrigin` JSON ZodSchema
 */
export function HorizontalOriginZodSchema() {
  return z.object({
    parser: z.literal('HorizontalOrigin'),
    value: z.enum(strings),
  });
}

export type HorizontalOriginJSON = z.infer<ReturnType<typeof HorizontalOriginZodSchema>>;

/**
 * Convert `Cesium.HorizontalOrigin` instance to JSON
 */
export function HorizontalOriginToJSON(instance?: HorizontalOrigin): HorizontalOriginJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(HorizontalOrigin).parse(instance);
  return {
    parser: 'HorizontalOrigin',
    value: Object.keys(HorizontalOrigin).find((key: any) => Reflect.get(HorizontalOrigin, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.HorizontalOrigin` instance
 */
export function HorizontalOriginFromJSON(json?: HorizontalOriginJSON): HorizontalOrigin | undefined {
  if (json) {
    return HorizontalOrigin[json.value];
  }
}
