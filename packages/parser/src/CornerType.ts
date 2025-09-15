import { CornerType } from 'cesium';
import { z } from 'zod';

const strings = ['ROUNDED', 'MITERED', 'BEVELED'] as const;

/**
 * `Cesium.CornerType` JSON ZodSchema
 */
export function CornerTypeZodSchema() {
  return z.object({
    parser: z.literal('CornerType'),
    value: z.enum(strings),
  });
}

export type CornerTypeJSON = z.infer<ReturnType<typeof CornerTypeZodSchema>>;

/**
 * Convert `Cesium.CornerType` instance to JSON
 */
export function CornerTypeToJSON(instance?: CornerType): CornerTypeJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(CornerType).parse(instance);
  return {
    parser: 'CornerType',
    value: Object.keys(CornerType).find((key: any) => Reflect.get(CornerType, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.CornerType` instance
 */
export function CornerTypeFromJSON(json?: CornerTypeJSON): CornerType | undefined {
  if (json) {
    return CornerType[json.value];
  }
}
