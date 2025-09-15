import { Quaternion } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Quaternion` JSON ZodSchema
 */
export function QuaternionZodSchema() {
  return z.object({
    parser: z.literal('Quaternion'),
    value: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
      w: z.number(),
    }),
  });
}

export type QuaternionJSON = z.infer<ReturnType<typeof QuaternionZodSchema>>;

/**
 * Convert `Cesium.Quaternion` instance to JSON
 */
export function QuaternionToJSON(instance?: Quaternion): QuaternionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Quaternion).parse(instance);
  return {
    parser: 'Quaternion',
    value: {
      x: instance.x,
      y: instance.y,
      z: instance.z,
      w: instance.w,
    },
  };
}

/**
 * Convert JSON to `Cesium.Quaternion` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function QuaternionFromJSON(json?: QuaternionJSON, result?: Quaternion): Quaternion | undefined {
  if (!json) {
    return undefined;
  }
  json = QuaternionZodSchema().parse(json);
  const instance = new Quaternion(
    json.value.x,
    json.value.y,
    json.value.z,
    json.value.w,
  );
  return result ? instance.clone(result) : instance;
}
