import { Cartographic, Math as CesiumMath } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Cartographic` JSON ZodSchema. Longitude and latitude are radians.
 */
export function CartographicZodSchema() {
  return z.object({
    parser: z.literal('Cartographic'),
    value: z.object({
      height: z.number().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }),
  });
}

export type CartographicJSON = z.infer<ReturnType<typeof CartographicZodSchema>>;

/**
 * `Cesium.Cartographic` JSON ZodSchema with longitude and latitude in degrees.
 */
export function CartographicDegreesZodSchema() {
  return z.object({
    parser: z.literal('CartographicDegrees'),
    value: z.object({
      height: z.number().optional(),
      latitude: z.number(),
      longitude: z.number(),
    }),
  });
}

export type CartographicDegreesJSON = z.infer<ReturnType<typeof CartographicDegreesZodSchema>>;

export function CartographicToJSON(instance?: Cartographic): CartographicJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cartographic).parse(instance);
  return CartographicZodSchema().parse({
    parser: 'Cartographic',
    value: {
      height: instance.height,
      latitude: instance.latitude,
      longitude: instance.longitude,
    },
  });
}

export function CartographicFromJSON(json?: CartographicJSON, result?: Cartographic): Cartographic | undefined {
  if (!json) {
    return undefined;
  }
  const value = CartographicZodSchema().parse(json).value;
  const instance = new Cartographic(value.longitude, value.latitude, value.height);
  return result ? instance.clone(result) : instance;
}

export function CartographicToDegreesJSON(instance?: Cartographic): CartographicDegreesJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cartographic).parse(instance);
  return CartographicDegreesZodSchema().parse({
    parser: 'CartographicDegrees',
    value: {
      height: instance.height,
      latitude: CesiumMath.toDegrees(instance.latitude),
      longitude: CesiumMath.toDegrees(instance.longitude),
    },
  });
}

export function CartographicFromDegreesJSON(json?: CartographicDegreesJSON, result?: Cartographic): Cartographic | undefined {
  if (!json) {
    return undefined;
  }
  const value = CartographicDegreesZodSchema().parse(json).value;
  return Cartographic.fromDegrees(value.longitude, value.latitude, value.height, result);
}
