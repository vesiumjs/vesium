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
export function PolygonGraphicsToJSON(instance?: PolygonGraphics, time?: JulianDate, omit?: keyof PolygonGraphics): PolygonGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolygonGraphics).parse(instance);
  return {
    parser: 'PolygonGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      hierarchy: omit?.includes('hierarchy') ? undefined : PolygonHierarchyToJSON(toPropertyValue(instance.hierarchy, time)),
      height: omit?.includes('height') ? undefined : toPropertyValue(instance.height, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: omit?.includes('extrudedHeight') ? undefined : toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      stRotation: omit?.includes('stRotation') ? undefined : toPropertyValue(instance.stRotation, time),
      granularity: omit?.includes('granularity') ? undefined : toPropertyValue(instance.granularity, time),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      perPositionHeight: omit?.includes('perPositionHeight') ? undefined : toPropertyValue(instance.perPositionHeight, time),
      closeTop: omit?.includes('closeTop') ? undefined : toPropertyValue(instance.closeTop, time),
      closeBottom: omit?.includes('closeBottom') ? undefined : toPropertyValue(instance.closeBottom, time),
      arcType: omit?.includes('arcType') ? undefined : ArcTypeToJSON(toPropertyValue(instance.arcType, time)),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: omit?.includes('zIndex') ? undefined : toPropertyValue(instance.zIndex, time),
      textureCoordinates: omit?.includes('textureCoordinates') ? undefined : PolygonHierarchyToJSON(toPropertyValue(instance.textureCoordinates, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PolygonGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolygonGraphicsFromJSON(json?: PolygonGraphicsJSON, result?: PolygonGraphics, omit?: keyof PolygonGraphics): PolygonGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolygonGraphicsZodSchema().parse(json);
  const instance = new PolygonGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    hierarchy: omit?.includes('hierarchy') ? undefined : PolygonHierarchyFromJSON(json.value.hierarchy),
    height: omit?.includes('height') ? undefined : json.value.height,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    extrudedHeight: omit?.includes('extrudedHeight') ? undefined : json.value.extrudedHeight,
    extrudedHeightReference: omit?.includes('extrudedHeightReference') ? undefined : HeightReferenceFromJSON(json.value.extrudedHeightReference),
    stRotation: omit?.includes('stRotation') ? undefined : json.value.stRotation,
    granularity: omit?.includes('granularity') ? undefined : json.value.granularity,
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    perPositionHeight: omit?.includes('perPositionHeight') ? undefined : json.value.perPositionHeight,
    closeTop: omit?.includes('closeTop') ? undefined : json.value.closeTop,
    closeBottom: omit?.includes('closeBottom') ? undefined : json.value.closeBottom,
    arcType: omit?.includes('arcType') ? undefined : ArcTypeFromJSON(json.value.arcType),
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: omit?.includes('zIndex') ? undefined : json.value.zIndex,
    textureCoordinates: omit?.includes('textureCoordinates') ? undefined : PolygonHierarchyFromJSON(json.value.textureCoordinates),
  });
  return result ? instance.clone(result) : instance;
}
