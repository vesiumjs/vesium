import type { JulianDate } from 'cesium';
import { CorridorGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { CornerTypeFromJSON, CornerTypeToJSON, CornerTypeZodSchema } from './CornerType';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.CorridorGraphics` JSON ZodSchema
 */
export function CorridorGraphicsZodSchema() {
  return z.object({
    parser: z.literal('CorridorGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      positions: z.array(Cartesian3ZodSchema()).optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      extrudedHeight: z.number().optional(),
      extrudedHeightReference: HeightReferenceZodSchema().optional(),
      cornerType: CornerTypeZodSchema().optional(),
      granularity: z.number().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      classificationType: ClassificationTypeZodSchema().optional(),
      zIndex: z.number().optional(),
    }),
  });
}

export type CorridorGraphicsJSON = z.infer<ReturnType<typeof CorridorGraphicsZodSchema>>;

/**
 * Convert `Cesium.CorridorGraphics` instance to JSON
 */
export function CorridorGraphicsToJSON(instance?: CorridorGraphics, time?: JulianDate): CorridorGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CorridorGraphics).parse(instance);
  return {
    parser: 'CorridorGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      width: toPropertyValue(instance.width, time),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      cornerType: CornerTypeToJSON(toPropertyValue(instance.cornerType, time)),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.CorridorGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function CorridorGraphicsFromJSON(json?: CorridorGraphicsJSON, result?: CorridorGraphics): CorridorGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = CorridorGraphicsZodSchema().parse(json);
  const instance = new CorridorGraphics({
    show: json.value.show,
    positions: json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    width: json.value.width,
    height: json.value.height,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: json.value.extrudedHeight,
    extrudedHeightReference: HeightReferenceFromJSON(json.value.extrudedHeightReference),
    cornerType: CornerTypeFromJSON(json.value.cornerType),
    granularity: json.value.granularity,
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
