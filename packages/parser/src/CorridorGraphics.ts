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
export function CorridorGraphicsToJSON(instance?: CorridorGraphics, time?: JulianDate, omit?: keyof CorridorGraphics): CorridorGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CorridorGraphics).parse(instance);
  return {
    parser: 'CorridorGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      positions: omit?.includes('positions') ? undefined : toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      width: omit?.includes('width') ? undefined : toPropertyValue(instance.width, time),
      height: omit?.includes('height') ? undefined : toPropertyValue(instance.height, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: omit?.includes('extrudedHeight') ? undefined : toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      cornerType: omit?.includes('cornerType') ? undefined : CornerTypeToJSON(toPropertyValue(instance.cornerType, time)),
      granularity: omit?.includes('granularity') ? undefined : toPropertyValue(instance.granularity, time),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: omit?.includes('zIndex') ? undefined : toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.CorridorGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function CorridorGraphicsFromJSON(json?: CorridorGraphicsJSON, result?: CorridorGraphics, omit?: keyof CorridorGraphics): CorridorGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = CorridorGraphicsZodSchema().parse(json);
  const instance = new CorridorGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    positions: omit?.includes('positions') ? undefined : json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    width: omit?.includes('width') ? undefined : json.value.width,
    height: omit?.includes('height') ? undefined : json.value.height,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: omit?.includes('extrudedHeight') ? undefined : json.value.extrudedHeight,
    extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceFromJSON(json.value.extrudedHeightReference),
    cornerType: omit?.includes('cornerType') ? undefined : CornerTypeFromJSON(json.value.cornerType),
    granularity: omit?.includes('granularity') ? undefined : json.value.granularity,
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: omit?.includes('zIndex') ? undefined : json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
