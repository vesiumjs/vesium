import { Cartesian3 } from 'cesium';
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
