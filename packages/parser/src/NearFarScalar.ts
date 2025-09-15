import { NearFarScalar } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.NearFarScalar` JSON ZodSchema
 */
export function NearFarScalarZodSchema() {
  return z.object({
    parser: z.literal('NearFarScalar'),
    value: z.object({
      near: z.number(),
      nearValue: z.number(),
      far: z.number(),
      farValue: z.number(),
    }),
  });
}

export type NearFarScalarJSON = z.infer<ReturnType<typeof NearFarScalarZodSchema>>;

/**
 * Convert `Cesium.NearFarScalar` instance to JSON
 */
export function NearFarScalarToJSON(instance?: NearFarScalar): NearFarScalarJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(NearFarScalar).parse(instance);
  return {
    parser: 'NearFarScalar',
    value: {
      near: instance.near,
      nearValue: instance.nearValue,
      far: instance.far,
      farValue: instance.farValue,
    },
  };
}

/**
 * Convert JSON to `Cesium.NearFarScalar` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function NearFarScalarFromJSON(json?: NearFarScalarJSON, result?: NearFarScalar): NearFarScalar | undefined {
  if (!json) {
    return undefined;
  }
  json = NearFarScalarZodSchema().parse(result);
  const instance = new NearFarScalar(
    json.value.near,
    json.value.nearValue,
    json.value.far,
    json.value.farValue,
  );
  return result ? instance.clone(result) : instance;
}
