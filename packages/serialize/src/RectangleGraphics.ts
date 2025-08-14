import type { JulianDate } from 'cesium';
import { RectangleGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';

import { z } from 'zod';
import { ClassificationTypeParse } from './ClassificationType';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';
import { RectangleParse } from './Rectangle';

import { ShadowModeParse } from './ShadowMode';

export type RectangleGraphicsJSON = z.infer<typeof RectangleGraphicsParse.JsonSchema>;

/**
 * Serialize a `RectangleGraphics` instance to JSON and deserialize from JSON
 */
export class RectangleGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    coordinates: RectangleParse.JsonSchema.optional(),
    height: z.number().optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    extrudedHeight: z.number().optional(),
    extrudedHeightReference: HeightReferenceParse.JsonSchema.optional(),
    rotation: z.number().optional(),
    stRotation: z.number().optional(),
    granularity: z.number().optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.JsonSchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.JsonSchema.optional(),
    outlineWidth: z.number().optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
    classificationType: ClassificationTypeParse.JsonSchema.optional(),
    zIndex: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(RectangleGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: RectangleGraphics, time?: JulianDate): RectangleGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      coordinates: RectangleParse.toJSON(toPropertyValue(instance.coordinates, time)),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      rotation: toPropertyValue(instance.rotation, time),
      stRotation: toPropertyValue(instance.stRotation, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeParse.toJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: RectangleGraphicsJSON, result?: RectangleGraphics): RectangleGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new RectangleGraphics({
      show: json.show ?? undefined,
      coordinates: RectangleParse.fromJSON(json?.coordinates),
      height: json.height ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      extrudedHeight: json.extrudedHeight ?? undefined,
      extrudedHeightReference: HeightReferenceParse.fromJSON(json?.extrudedHeightReference),
      rotation: json.rotation ?? undefined,
      stRotation: json.stRotation ?? undefined,
      granularity: json.granularity ?? undefined,
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      classificationType: ClassificationTypeParse.fromJSON(json?.classificationType),
      zIndex: json.zIndex ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
