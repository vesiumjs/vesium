import { HeightReference } from 'cesium';
import { z } from 'zod';

const strings = ['NONE', 'CLAMP_TO_GROUND', 'RELATIVE_TO_GROUND', 'CLAMP_TO_TERRAIN', 'RELATIVE_TO_TERRAIN', 'CLAMP_TO_3D_TILE', 'RELATIVE_TO_3D_TILE'] as const;

/**
 * `Cesium.HeightReference` JSON ZodSchema
 */
export function HeightReferenceZodSchema() {
  return z.object({
    parser: z.literal('HeightReference'),
    value: z.enum(strings),
  });
}

export type HeightReferenceJSON = z.infer<ReturnType<typeof HeightReferenceZodSchema>>;

/**
 * Convert `Cesium.HeightReference` instance to JSON
 */
export function HeightReferenceToJSON(instance?: HeightReference): HeightReferenceJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(HeightReference).parse(instance);
  return {
    parser: 'HeightReference',
    value: Object.keys(HeightReference).find((key: any) => Reflect.get(HeightReference, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.HeightReference` instance
 */
export function HeightReferenceFromJSON(json?: HeightReferenceJSON): HeightReference | undefined {
  if (json) {
    return HeightReference[json.value];
  }
}
