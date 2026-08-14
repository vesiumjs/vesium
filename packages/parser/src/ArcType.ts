import { ArcType } from 'cesium';
import { z } from 'zod';

const strings = ['NONE', 'GEODESIC', 'RHUMB'] as const;

/**
 * `Cesium.ArcType` JSON ZodSchema
 */
export function ArcTypeZodSchema() {
  return z.object({
    parser: z.literal('ArcType'),
    value: z.enum(strings),
  });
}

export type ArcTypeJSON = z.infer<ReturnType<typeof ArcTypeZodSchema>>;

/**
 * Convert `Cesium.ArcType` instance to JSON
 */
export function ArcTypeToJSON(instance?: ArcType): ArcTypeJSON | undefined {
  if (instance === undefined || instance === null) {
    return undefined;
  }
  instance = z.enum(ArcType).parse(instance);
  return {
    parser: 'ArcType',
    value: Object.keys(ArcType).find(key => Reflect.get(ArcType, key) === instance) as (typeof strings)[number],
  };
}

/**
 * Convert JSON to `Cesium.ArcType` instance
 */
export function ArcTypeFromJSON(json?: ArcTypeJSON): ArcType | undefined {
  if (json) {
    return ArcType[json.value];
  }
}
