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
export function WallGraphicsToJSON(instance?: WallGraphics, time?: JulianDate, omit?: keyof WallGraphics): WallGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(WallGraphics).parse(instance);
  return {
    parser: 'WallGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      positions: omit?.includes('positions') ? undefined : toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      minimumHeights: omit?.includes('minimumHeights') ? undefined : toPropertyValue(instance.minimumHeights, time),
      maximumHeights: omit?.includes('maximumHeights') ? undefined : toPropertyValue(instance.maximumHeights, time),
      granularity: omit?.includes('granularity') ? undefined : toPropertyValue(instance.granularity, time),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.WallGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function WallGraphicsFromJSON(json?: WallGraphicsJSON, result?: WallGraphics, omit?: keyof WallGraphics): WallGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = WallGraphicsZodSchema().parse(json);
  const instance = new WallGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    positions: omit?.includes('positions') ? undefined : json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    minimumHeights: omit?.includes('minimumHeights') ? undefined : json.value.minimumHeights,
    maximumHeights: omit?.includes('maximumHeights') ? undefined : json.value.maximumHeights,
    granularity: omit?.includes('granularity') ? undefined : json.value.granularity,
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
