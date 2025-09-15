import { ClippingPlane } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';

/**
 * `Cesium.ClippingPlane` JSON ZodSchema
 */
export function ClippingPlaneZodSchema() {
  return z.object({
    parser: z.literal('ClippingPlane'),
    value: z.object({
      normal: Cartesian3ZodSchema(),
      distance: z.number(),
    }),
  });
}

export type ClippingPlaneJSON = z.infer<ReturnType<typeof ClippingPlaneZodSchema>>;

/**
 * Convert `Cesium.ClippingPlane` instance to JSON
 */
export function ClippingPlaneToJSON(instance?: ClippingPlane): ClippingPlaneJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(ClippingPlane).parse(instance);
  return {
    parser: 'ClippingPlane',
    value: {
      normal: Cartesian3ToJSON(instance.normal)!,
      distance: instance.distance,
    },
  };
}

/**
 * Convert JSON to `Cesium.ClippingPlane` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ClippingPlaneFromJSON(json?: ClippingPlaneJSON, result?: ClippingPlane): ClippingPlane | undefined {
  if (!json) {
    return undefined;
  }
  json = ClippingPlaneZodSchema().parse(result);
  const instance = new ClippingPlane(
    Cartesian3FromJSON(json.value.normal)!,
    json.value.distance,
  );
  return result ? ClippingPlane.clone(instance, result) : instance;
}
