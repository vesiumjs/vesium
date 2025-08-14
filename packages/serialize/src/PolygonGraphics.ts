import type { JulianDate } from 'cesium';
import { PolygonGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ArcTypeParse } from './ArcType';
import { ClassificationTypeParse } from './ClassificationType';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';
import { PolygonHierarchyParse } from './PolygonHierarchy';

import { ShadowModeParse } from './ShadowMode';

export type PolygonGraphicsJSON = z.infer<typeof PolygonGraphicsParse.JsonSchema>;

/**
 * Serialize a `PolygonGraphics` instance to JSON and deserialize from JSON
 */
export class PolygonGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    hierarchy: PolygonHierarchyParse.JsonSchema.optional(),
    height: z.number().optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    extrudedHeight: z.number().optional(),
    extrudedHeightReference: HeightReferenceParse.JsonSchema.optional(),
    stRotation: z.number().optional(),
    granularity: z.number().optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.JsonSchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.JsonSchema.optional(),
    outlineWidth: z.number().optional(),
    perPositionHeight: z.boolean().optional(),
    closeTop: z.boolean().optional(),
    closeBottom: z.boolean().optional(),
    arcType: ArcTypeParse.JsonSchema.optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
    classificationType: ClassificationTypeParse.JsonSchema.optional(),
    zIndex: z.number().optional(),
    textureCoordinates: PolygonHierarchyParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(PolygonGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolygonGraphics, time?: JulianDate): PolygonGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      hierarchy: PolygonHierarchyParse.toJSON(toPropertyValue(instance.hierarchy, time)),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      stRotation: toPropertyValue(instance.stRotation, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      perPositionHeight: toPropertyValue(instance.perPositionHeight, time),
      closeTop: toPropertyValue(instance.closeTop, time),
      closeBottom: toPropertyValue(instance.closeBottom, time),
      arcType: ArcTypeParse.toJSON(toPropertyValue(instance.arcType, time)),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeParse.toJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
      textureCoordinates: PolygonHierarchyParse.toJSON(toPropertyValue(instance.textureCoordinates, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PolygonGraphicsJSON, result?: PolygonGraphics): PolygonGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new PolygonGraphics({
      show: json.show ?? undefined,
      hierarchy: PolygonHierarchyParse.fromJSON(json?.hierarchy),
      height: json.height ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      extrudedHeight: json.extrudedHeight ?? undefined,
      extrudedHeightReference: HeightReferenceParse.fromJSON(json?.extrudedHeightReference),
      stRotation: json.stRotation ?? undefined,
      granularity: json.granularity ?? undefined,
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      perPositionHeight: json.perPositionHeight ?? undefined,
      closeTop: json.closeTop ?? undefined,
      closeBottom: json.closeBottom ?? undefined,
      arcType: ArcTypeParse.fromJSON(json?.arcType),
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      classificationType: ClassificationTypeParse.fromJSON(json?.classificationType),
      zIndex: json.zIndex ?? undefined,
      textureCoordinates: PolygonHierarchyParse.fromJSON(json?.textureCoordinates),
    });
    return result ? instance.clone(result) : instance;
  }
}
