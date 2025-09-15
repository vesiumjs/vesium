import { ClassificationType } from 'cesium';
import { z } from 'zod';

const strings = ['TERRAIN', 'CESIUM_3D_TILE', 'BOTH'] as const;

/**
 * `Cesium.ClassificationType` JSON ZodSchema
 */
export function ClassificationTypeZodSchema() {
  return z.object({
    parser: z.literal('ClassificationType'),
    value: z.enum(strings),
  });
}
export type ClassificationTypeJSON = z.infer<ReturnType<typeof ClassificationTypeZodSchema>>;

/**
 * Convert `Cesium.ClassificationType` instance to JSON
 */
export function ClassificationTypeToJSON(instance?: ClassificationType): ClassificationTypeJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(ClassificationType).parse(instance);
  return {
    parser: 'ClassificationType',
    value: Object.keys(ClassificationType).find((key: any) => Reflect.get(ClassificationType, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.ClassificationType` instance
 */
export function ClassificationTypeFromJSON(json?: ClassificationTypeJSON): ClassificationType | undefined {
  if (json) {
    return ClassificationType[json.value];
  }
}
