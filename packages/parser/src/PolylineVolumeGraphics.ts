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
export function PolylineVolumeGraphicsToJSON(instance?: PolylineVolumeGraphics, time?: JulianDate): PolylineVolumeGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolylineVolumeGraphics).parse(instance);
  return {
    parser: 'PolylineVolumeGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      shape: toPropertyValue(instance.shape, time)?.map((item: any) => Cartesian2ToJSON(item)),
      cornerType: CornerTypeToJSON(toPropertyValue(instance.cornerType, time)),
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
 * Convert JSON to `Cesium.PolylineVolumeGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolylineVolumeGraphicsFromJSON(json?: PolylineVolumeGraphicsJSON, result?: PolylineVolumeGraphics): PolylineVolumeGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolylineVolumeGraphicsZodSchema().parse(json);
  const instance = new PolylineVolumeGraphics({
    show: json.value.show,
    positions: json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    shape: json.value.shape?.map((item: any) => Cartesian2FromJSON(item)!),
    cornerType: CornerTypeFromJSON(json.value.cornerType),
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
