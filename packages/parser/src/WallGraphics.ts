import type { JulianDate } from 'cesium';
import { WallGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.WallGraphics` JSON ZodSchema
 */
export function WallGraphicsZodSchema() {
  return z.object({
    parser: z.literal('WallGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      positions: z.array(Cartesian3ZodSchema()).optional(),
      minimumHeights: z.array(z.number()).optional(),
      maximumHeights: z.array(z.number()).optional(),
      granularity: z.number().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type WallGraphicsJSON = z.infer<ReturnType<typeof WallGraphicsZodSchema>>;

/**
 * Convert `Cesium.WallGraphics` instance to JSON
 */
export function WallGraphicsToJSON(instance?: WallGraphics, time?: JulianDate): WallGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(WallGraphics).parse(instance);
  return {
    parser: 'WallGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      minimumHeights: toPropertyValue(instance.minimumHeights, time),
      maximumHeights: toPropertyValue(instance.maximumHeights, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.WallGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function WallGraphicsFromJSON(json?: WallGraphicsJSON, result?: WallGraphics): WallGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = WallGraphicsZodSchema().parse(json);
  const instance = new WallGraphics({
    show: json.value.show,
    positions: json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    minimumHeights: json.value.minimumHeights,
    maximumHeights: json.value.maximumHeights,
    granularity: json.value.granularity,
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
