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
export function EllipseGraphicsToJSON(instance?: EllipseGraphics, time?: JulianDate): EllipseGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(EllipseGraphics).parse(instance);
  return {
    parser: 'EllipseGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      semiMajorAxis: toPropertyValue(instance.semiMajorAxis, time),
      semiMinorAxis: toPropertyValue(instance.semiMinorAxis, time),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      rotation: toPropertyValue(instance.rotation, time),
      stRotation: toPropertyValue(instance.stRotation, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      numberOfVerticalLines: toPropertyValue(instance.numberOfVerticalLines, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.EllipseGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function EllipseGraphicsFromJSON(json?: EllipseGraphicsJSON, result?: EllipseGraphics): EllipseGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipseGraphicsZodSchema().parse(result);
  const instance = new EllipseGraphics({
    show: json.value.show,
    semiMajorAxis: json.value.semiMajorAxis,
    semiMinorAxis: json.value.semiMinorAxis,
    height: json.value.height,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: json.value.extrudedHeight,
    extrudedHeightReference: HeightReferenceFromJSON(json.value.extrudedHeightReference),
    rotation: json.value.rotation,
    stRotation: json.value.stRotation,
    granularity: json.value.granularity,
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    numberOfVerticalLines: json.value.numberOfVerticalLines,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
