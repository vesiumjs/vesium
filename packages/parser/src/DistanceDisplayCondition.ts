import { DistanceDisplayCondition } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.DistanceDisplayCondition` JSON ZodSchema
 */
export function DistanceDisplayConditionZodSchema() {
  return z.object({
    parser: z.literal('DistanceDisplayCondition'),
    value: z.object({
      near: z.number(),
      far: z.number(),
    }),
  });
}

export type DistanceDisplayConditionJSON = z.infer<ReturnType<typeof DistanceDisplayConditionZodSchema>>;

/**
 * Convert `Cesium.DistanceDisplayCondition` instance to JSON
 */
export function DistanceDisplayConditionToJSON(instance?: DistanceDisplayCondition): DistanceDisplayConditionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(DistanceDisplayCondition).parse(instance);
  return {
    parser: 'DistanceDisplayCondition',
    value: {
      near: instance.near,
      far: instance.far,
    },
  };
}

/**
 * Convert JSON to `Cesium.DistanceDisplayCondition` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function DistanceDisplayConditionFromJSON(json?: DistanceDisplayConditionJSON, result?: DistanceDisplayCondition): DistanceDisplayCondition | undefined {
  if (!json) {
    return undefined;
  }
  json = DistanceDisplayConditionZodSchema().parse(json);
  const instance = new DistanceDisplayCondition(
    json.value.near,
    json.value.far,
  );
  return result ? instance.clone(result) : instance;
}
