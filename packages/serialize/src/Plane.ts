import { Plane } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';

/**
 * `Cesium.Plane` JSON ZodSchema
 */
export function PlaneZodSchema() {
  return z.object({
    parser: z.literal('Plane'),
    value: z.object({
      normal: Cartesian3ZodSchema(),
      distance: z.number(),
    }),
  });
}

export type PlaneJSON = z.infer<ReturnType<typeof PlaneZodSchema>>;

/**
 * Convert `Cesium.Plane` instance to JSON
 */
export function PlaneToJSON(instance?: Plane): PlaneJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Plane).parse(instance);
  return {
    parser: 'Plane',
    value: {
      normal: Cartesian3ToJSON(instance.normal)!,
      distance: instance.distance,
    },
  };
}

/**
 * Convert JSON to `Cesium.Plane` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PlaneFromJSON(json?: PlaneJSON, result?: Plane): Plane | undefined {
  if (!json) {
    return undefined;
  }
  json = PlaneZodSchema().parse(result);
  const instance = new Plane(
    Cartesian3FromJSON(json.value.normal)!,
    json.value.distance,
  );

  return result ? Plane.clone(instance, result) : instance;
}
