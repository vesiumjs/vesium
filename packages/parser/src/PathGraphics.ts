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
export function PathGraphicsToJSON(instance?: PathGraphics, time?: JulianDate, omit?: keyof PathGraphics): PathGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PathGraphics).parse(instance);
  return {
    parser: 'PathGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      leadTime: omit?.includes('leadTime') ? undefined : toPropertyValue(instance.leadTime, time),
      trailTime: omit?.includes('trailTime') ? undefined : toPropertyValue(instance.trailTime, time),
      width: omit?.includes('width') ? undefined : toPropertyValue(instance.width, time),
      resolution: omit?.includes('resolution') ? undefined : toPropertyValue(instance.resolution, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PathGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PathGraphicsFromJSON(json?: PathGraphicsJSON, result?: PathGraphics, omit?: keyof PathGraphics): PathGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PathGraphicsZodSchema().parse(json);
  const instance = new PathGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    leadTime: omit?.includes('leadTime') ? undefined : json.value.leadTime,
    trailTime: omit?.includes('trailTime') ? undefined : json.value.trailTime,
    width: omit?.includes('width') ? undefined : json.value.width,
    resolution: omit?.includes('resolution') ? undefined : json.value.resolution,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
