import type { JulianDate } from 'cesium';
import { PolylineVolumeGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { CornerTypeFromJSON, CornerTypeToJSON, CornerTypeZodSchema } from './CornerType';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.PolylineVolumeGraphics` JSON ZodSchema
 */
export function PolylineVolumeGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PolylineVolumeGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      positions: z.array(Cartesian3ZodSchema()).optional(),
      shape: z.array(Cartesian2ZodSchema()).optional(),
      cornerType: CornerTypeZodSchema().optional(),
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

export type PolylineVolumeGraphicsJSON = z.infer<ReturnType<typeof PolylineVolumeGraphicsZodSchema>>;

/**
 * Convert `Cesium.PolylineVolumeGraphics` instance to JSON
 */
export function PolylineVolumeGraphicsToJSON(instance?: PolylineVolumeGraphics, time?: JulianDate, omit?: keyof PolylineVolumeGraphics): PolylineVolumeGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolylineVolumeGraphics).parse(instance);
  return {
    parser: 'PolylineVolumeGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      positions: omit?.includes('positions') ? undefined : toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      shape: omit?.includes('shape') ? undefined : toPropertyValue(instance.shape, time)?.map((item: any) => Cartesian2ToJSON(item)),
      cornerType: omit?.includes('cornerType') ? undefined : CornerTypeToJSON(toPropertyValue(instance.cornerType, time)),
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
 * Convert JSON to `Cesium.PolylineVolumeGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolylineVolumeGraphicsFromJSON(json?: PolylineVolumeGraphicsJSON, result?: PolylineVolumeGraphics, omit?: keyof PolylineVolumeGraphics): PolylineVolumeGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolylineVolumeGraphicsZodSchema().parse(json);
  const instance = new PolylineVolumeGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    positions: omit?.includes('positions') ? undefined : json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    shape: omit?.includes('shape') ? undefined : json.value.shape?.map((item: any) => Cartesian2FromJSON(item)!),
    cornerType: omit?.includes('cornerType') ? undefined : CornerTypeFromJSON(json.value.cornerType),
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
