import { VerticalOrigin } from 'cesium';
import { z } from 'zod';

const strings = ['CENTER', 'BOTTOM', 'BASELINE', 'TOP'] as const;

/**
 * `Cesium.VerticalOrigin` JSON ZodSchema
 */
export function VerticalOriginZodSchema() {
  return z.object({
    parser: z.literal('VerticalOrigin'),
    value: z.enum(strings),
  });
}

export type VerticalOriginJSON = z.infer<ReturnType<typeof VerticalOriginZodSchema>>;

/**
 * Convert `Cesium.VerticalOrigin` instance to JSON
 */
export function VerticalOriginToJSON(instance?: VerticalOrigin): VerticalOriginJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(VerticalOrigin).parse(instance);
  return {
    parser: 'VerticalOrigin',
    value: Object.keys(VerticalOrigin).find((key: any) => Reflect.get(VerticalOrigin, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.VerticalOrigin` instance
 */
export function VerticalOriginFromJSON(json?: VerticalOriginJSON): VerticalOrigin | undefined {
  if (json) {
    return VerticalOrigin[json.value];
  }
}
