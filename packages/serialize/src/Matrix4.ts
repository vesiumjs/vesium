import { Matrix4 } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Matrix4` JSON ZodSchema
 */
export const Matrix4ZodSchema = () => z.array(z.number());

export type Matrix4JSON = z.infer<ReturnType<typeof Matrix4ZodSchema>>;

/**
 * Convert `Cesium.Matrix4` instance to JSON
 */
export function Matrix4ToJSON(instance?: Matrix4): Matrix4JSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Matrix4).parse(instance);
  return Array.from(instance);
}

/**
 * Convert JSON to `Cesium.Matrix4` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function Matrix4FromJSON(json?: Matrix4JSON, result?: Matrix4): Matrix4 | undefined {
  if (!json) {
    return undefined;
  }
  json = Matrix4ZodSchema().parse(result);
  const instance = new Matrix4(...json);
  return result ? instance.clone(result) : instance;
}
