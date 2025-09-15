import type { JulianDate } from 'cesium';
import { PathGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';

/**
 * `Cesium.PathGraphics` JSON ZodSchema
 */
export function PathGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PathGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      leadTime: z.number().optional(),
      trailTime: z.number().optional(),
      width: z.number().optional(),
      resolution: z.number().optional(),
      material: MaterialPropertyZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type PathGraphicsJSON = z.infer<ReturnType<typeof PathGraphicsZodSchema>>;

/**
 * Convert `Cesium.PathGraphics` instance to JSON
 */
export function PathGraphicsToJSON(instance?: PathGraphics, time?: JulianDate): PathGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PathGraphics).parse(instance);
  return {
    parser: 'PathGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      leadTime: toPropertyValue(instance.leadTime, time),
      trailTime: toPropertyValue(instance.trailTime, time),
      width: toPropertyValue(instance.width, time),
      resolution: toPropertyValue(instance.resolution, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PathGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PathGraphicsFromJSON(json?: PathGraphicsJSON, result?: PathGraphics): PathGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PathGraphicsZodSchema().parse(json);
  const instance = new PathGraphics({
    show: json.value.show,
    leadTime: json.value.leadTime,
    trailTime: json.value.trailTime,
    width: json.value.width,
    resolution: json.value.resolution,
    material: MaterialPropertyFromJSON(json.value.material),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
