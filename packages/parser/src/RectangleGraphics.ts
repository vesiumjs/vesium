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
export function RectangleGraphicsToJSON(instance?: RectangleGraphics, time?: JulianDate): RectangleGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(RectangleGraphics).parse(instance);
  return {
    parser: 'RectangleGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      coordinates: RectangleToJSON(toPropertyValue(instance.coordinates, time)),
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
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.RectangleGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function RectangleGraphicsFromJSON(json?: RectangleGraphicsJSON, result?: RectangleGraphics): RectangleGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = RectangleGraphicsZodSchema().parse(json);
  const instance = new RectangleGraphics({
    show: json.value.show,
    coordinates: RectangleFromJSON(json.value.coordinates),
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
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
