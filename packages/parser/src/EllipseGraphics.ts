import type { JulianDate } from 'cesium';
import { EllipseGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.EllipseGraphics` JSON ZodSchema
 */
export function EllipseGraphicsZodSchema() {
  return z.object({
    parser: z.literal('EllipseGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      semiMajorAxis: z.number().optional(),
      semiMinorAxis: z.number().optional(),
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
      numberOfVerticalLines: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      classificationType: ClassificationTypeZodSchema().optional(),
      zIndex: z.number().optional(),
    }),
  });
}

export type EllipseGraphicsJSON = z.infer<ReturnType<typeof EllipseGraphicsZodSchema>>;

/**
 * Convert `Cesium.EllipseGraphics` instance to JSON
 */
export function EllipseGraphicsToJSON(instance?: EllipseGraphics, time?: JulianDate, omit?: keyof EllipseGraphics): EllipseGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(EllipseGraphics).parse(instance);
  return {
    parser: 'EllipseGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      semiMajorAxis: omit?.includes('semiMajorAxis') ? undefined : toPropertyValue(instance.semiMajorAxis, time),
      semiMinorAxis: omit?.includes('semiMinorAxis') ? undefined : toPropertyValue(instance.semiMinorAxis, time),
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
      numberOfVerticalLines: omit?.includes('numberOfVerticalLines') ? undefined : toPropertyValue(instance.numberOfVerticalLines, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: omit?.includes('zIndex') ? undefined : toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.EllipseGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function EllipseGraphicsFromJSON(json?: EllipseGraphicsJSON, result?: EllipseGraphics, omit?: keyof EllipseGraphics): EllipseGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipseGraphicsZodSchema().parse(json);
  const instance = new EllipseGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    semiMajorAxis: omit?.includes('semiMajorAxis') ? undefined : json.value.semiMajorAxis,
    semiMinorAxis: omit?.includes('semiMinorAxis') ? undefined : json.value.semiMinorAxis,
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
    numberOfVerticalLines: omit?.includes('numberOfVerticalLines') ? undefined : json.value.numberOfVerticalLines,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: omit?.includes('zIndex') ? undefined : json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
