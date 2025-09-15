import type { JulianDate } from 'cesium';
import { PolygonGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ArcTypeFromJSON, ArcTypeToJSON, ArcTypeZodSchema } from './ArcType';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { PolygonHierarchyFromJSON, PolygonHierarchyToJSON, PolygonHierarchyZodSchema } from './PolygonHierarchy';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.PolygonGraphics` JSON ZodSchema
 */
export function PolygonGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PolygonGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      hierarchy: PolygonHierarchyZodSchema().optional(),
      height: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      extrudedHeight: z.number().optional(),
      extrudedHeightReference: HeightReferenceZodSchema().optional(),
      stRotation: z.number().optional(),
      granularity: z.number().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      perPositionHeight: z.boolean().optional(),
      closeTop: z.boolean().optional(),
      closeBottom: z.boolean().optional(),
      arcType: ArcTypeZodSchema().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      classificationType: ClassificationTypeZodSchema().optional(),
      zIndex: z.number().optional(),
      textureCoordinates: PolygonHierarchyZodSchema().optional(),
    }),
  });
}

export type PolygonGraphicsJSON = z.infer<ReturnType<typeof PolygonGraphicsZodSchema>>;

/**
 * Convert `Cesium.PolygonGraphics` instance to JSON
 */
export function PolygonGraphicsToJSON(instance?: PolygonGraphics, time?: JulianDate): PolygonGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolygonGraphics).parse(instance);
  return {
    parser: 'PolygonGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      hierarchy: PolygonHierarchyToJSON(toPropertyValue(instance.hierarchy, time)),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      stRotation: toPropertyValue(instance.stRotation, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      perPositionHeight: toPropertyValue(instance.perPositionHeight, time),
      closeTop: toPropertyValue(instance.closeTop, time),
      closeBottom: toPropertyValue(instance.closeBottom, time),
      arcType: ArcTypeToJSON(toPropertyValue(instance.arcType, time)),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
      textureCoordinates: PolygonHierarchyToJSON(toPropertyValue(instance.textureCoordinates, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PolygonGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolygonGraphicsFromJSON(json?: PolygonGraphicsJSON, result?: PolygonGraphics): PolygonGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolygonGraphicsZodSchema().parse(result);
  const instance = new PolygonGraphics({
    show: json.value.show,
    hierarchy: PolygonHierarchyFromJSON(json.value.hierarchy),
    height: json.value.height,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: json.value.extrudedHeight,
    extrudedHeightReference: HeightReferenceFromJSON(json.value.extrudedHeightReference),
    stRotation: json.value.stRotation,
    granularity: json.value.granularity,
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    perPositionHeight: json.value.perPositionHeight,
    closeTop: json.value.closeTop,
    closeBottom: json.value.closeBottom,
    arcType: ArcTypeFromJSON(json.value.arcType),
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: json.value.zIndex,
    textureCoordinates: PolygonHierarchyFromJSON(json.value.textureCoordinates),
  });
  return result ? instance.clone(result) : instance;
}
