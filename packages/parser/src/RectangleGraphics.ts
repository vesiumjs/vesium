import type { JulianDate } from 'cesium';
import { RectangleGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.RectangleGraphics` JSON ZodSchema
 */
export function RectangleGraphicsZodSchema() {
  return z.object({
    parser: z.literal('RectangleGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      coordinates: RectangleZodSchema().optional(),
      height: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      extrudedHeight: z.number().optional(),
      extrudedHeightReference: HeightReferenceZodSchema().optional(),
      rotation: z.number().optional(),
      stRotation: z.number().optional(),
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

export type RectangleGraphicsJSON = z.infer<ReturnType<typeof RectangleGraphicsZodSchema>>;

/**
 * Convert `Cesium.RectangleGraphics` instance to JSON
 */
export function RectangleGraphicsToJSON(instance?: RectangleGraphics, time?: JulianDate, omit?: keyof RectangleGraphics): RectangleGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(RectangleGraphics).parse(instance);
  return {
    parser: 'RectangleGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      coordinates: omit?.includes('coordinates') ? undefined : RectangleToJSON(toPropertyValue(instance.coordinates, time)),
      height: omit?.includes('height') ? undefined : toPropertyValue(instance.height, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: omit?.includes('extrudedHeight') ? undefined : toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      rotation: omit?.includes('rotation') ? undefined : toPropertyValue(instance.rotation, time),
      stRotation: omit?.includes('stRotation') ? undefined : toPropertyValue(instance.stRotation, time),
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
 * Convert JSON to `Cesium.RectangleGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function RectangleGraphicsFromJSON(json?: RectangleGraphicsJSON, result?: RectangleGraphics, omit?: keyof RectangleGraphics): RectangleGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = RectangleGraphicsZodSchema().parse(json);
  const instance = new RectangleGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    coordinates: omit?.includes('coordinates') ? undefined : RectangleFromJSON(json.value.coordinates),
    height: omit?.includes('height') ? undefined : json.value.height,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: omit?.includes('extrudedHeight') ? undefined : json.value.extrudedHeight,
    extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceFromJSON(json.value.extrudedHeightReference),
    rotation: omit?.includes('rotation') ? undefined : json.value.rotation,
    stRotation: omit?.includes('stRotation') ? undefined : json.value.stRotation,
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
