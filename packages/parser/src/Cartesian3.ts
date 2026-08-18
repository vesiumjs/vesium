import { Cartesian3, Cartographic, Math as CesiumMath } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Cartesian3` JSON ZodSchema
 */
export function Cartesian3ZodSchema() {
  return z.object({
    parser: z.literal('Cartesian3'),
    value: z.object({
      x: z.number().optional(),
      y: z.number().optional(),
      z: z.number().optional(),
    }),
  });
}

export type Cartesian3JSON = z.infer<ReturnType<typeof Cartesian3ZodSchema>>;

/**
 * `Cesium.Cartesian3` JSON ZodSchema with longitude and latitude in degrees.
 */
export function Cartesian3DegreesZodSchema() {
  return z.object({
    parser: z.literal('Cartesian3Degrees'),
    value: z.object({
      height: z.number().optional(),
      latitude: z.number(),
      longitude: z.number(),
    }),
  });
}

export type Cartesian3DegreesJSON = z.infer<ReturnType<typeof Cartesian3DegreesZodSchema>>;

/**
 * Convert `Cesium.Cartesian3` instance to JSON
 */
export function Cartesian3ToJSON(instance?: Cartesian3): Cartesian3JSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cartesian3).parse(instance);
  return {
    parser: 'Cartesian3',
    value: {
      x: instance.x,
      y: instance.y,
      z: instance.z,
    },
  };
}

/**
 * Convert JSON to `Cesium.Cartesian3` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function Cartesian3FromJSON(json?: Cartesian3JSON, result?: Cartesian3): Cartesian3 | undefined {
  if (!json) {
    return undefined;
  }
  json = Cartesian3ZodSchema().parse(json);
  const instance = new Cartesian3(
    json.value.x,
    json.value.y,
    json.value.z,
  );
  return result ? instance.clone(result) : instance;
}

/**
 * Converts a Cartesian3 to longitude, latitude, and height JSON in degrees.
 */
export function Cartesian3ToDegreesJSON(instance?: Cartesian3): Cartesian3DegreesJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cartesian3).parse(instance);
  const cartographic = Cartographic.fromCartesian(instance);
  if (!cartographic) {
    throw new TypeError('Cartesian3 at the ellipsoid center cannot be represented as longitude and latitude.');
  }
  return Cartesian3DegreesZodSchema().parse({
    parser: 'Cartesian3Degrees',
    value: {
      height: cartographic.height,
      latitude: CesiumMath.toDegrees(cartographic.latitude),
      longitude: CesiumMath.toDegrees(cartographic.longitude),
    },
  });
}

/**
 * Converts longitude, latitude, and height JSON in degrees to a Cartesian3.
 */
export function Cartesian3FromDegreesJSON(json?: Cartesian3DegreesJSON, result?: Cartesian3): Cartesian3 | undefined {
  if (!json) {
    return undefined;
  }
  const value = Cartesian3DegreesZodSchema().parse(json).value;
  return Cartesian3.fromDegrees(value.longitude, value.latitude, value.height, undefined, result);
}
