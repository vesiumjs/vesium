import { Ellipsoid } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';

/**
 * `Cesium.Ellipsoid` JSON ZodSchema
 */
export function EllipsoidZodSchema() {
  return z.object({
    parser: z.literal('Ellipsoid'),
    value: z.object({
      radii: Cartesian3ZodSchema(),
    }),
  });
}

export type EllipsoidJSON = z.infer<ReturnType<typeof EllipsoidZodSchema>>;

/**
 * Convert `Cesium.Ellipsoid` instance to JSON
 */
export function EllipsoidToJSON(instance?: Ellipsoid): EllipsoidJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Ellipsoid).parse(instance);
  return {
    parser: 'Ellipsoid',
    value: {
      radii: Cartesian3ToJSON(instance.radii)!,
    },
  };
}

/**
 * Convert JSON to `Cesium.Ellipsoid` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function EllipsoidFromJSON(json?: EllipsoidJSON, result?: Ellipsoid): Ellipsoid | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipsoidZodSchema().parse(json);
  const radii = Cartesian3FromJSON(json.value.radii)!;
  const instance = new Ellipsoid(radii.x, radii.y, radii.z);
  return result ? instance.clone(result) : instance;
}
