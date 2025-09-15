import { Cartesian2 } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Cartesian2` JSON ZodSchema
 */
export function Cartesian2ZodSchema() {
  return z.object({
    parser: z.literal('Cartesian2'),
    value: z.object({
      x: z.number().optional(),
      y: z.number().optional(),
    }),
  });
}

export type Cartesian2JSON = z.infer<ReturnType<typeof Cartesian2ZodSchema>>;

/**
 * Convert `Cesium.Cartesian2` instance to JSON
 */
export function Cartesian2ToJSON(instance?: Cartesian2): Cartesian2JSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cartesian2).parse(instance);
  return {
    parser: 'Cartesian2',
    value: {
      x: instance.x,
      y: instance.y,
    },
  };
}

/**
 * Convert JSON to `Cesium.Cartesian2` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function Cartesian2FromJSON(json?: Cartesian2JSON, result?: Cartesian2): Cartesian2 | undefined {
  if (!json) {
    return undefined;
  }
  json = Cartesian2ZodSchema().parse(result);
  const instance = new Cartesian2(
    json.value.x,
    json.value.y,
  );
  return result ? instance.clone(result) : instance;
}
