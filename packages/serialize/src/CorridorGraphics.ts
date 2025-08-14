import type { JulianDate } from 'cesium';
import { CorridorGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';
import { ClassificationTypeParse } from './ClassificationType';
import { ColorParse } from './Color';
import { CornerTypeParse } from './CornerType';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type CorridorGraphicsJSON = z.infer<typeof CorridorGraphicsParse.JsonSchema>;

/**
 * Serialize a `CorridorGraphics` instance to JSON and deserialize from JSON
 */
export class CorridorGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    positions: z.array(Cartesian3Parse.JsonSchema).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    extrudedHeight: z.number().optional(),
    extrudedHeightReference: HeightReferenceParse.JsonSchema.optional(),
    cornerType: CornerTypeParse.JsonSchema.optional(),
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
  static readonly InstanceSchema = z.instanceof(CorridorGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CorridorGraphics, time?: JulianDate): CorridorGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Parse.toJSON(item)),
      width: toPropertyValue(instance.width, time),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      cornerType: CornerTypeParse.toJSON(toPropertyValue(instance.cornerType, time)),
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
  static fromJSON(json?: CorridorGraphicsJSON, result?: CorridorGraphics): CorridorGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new CorridorGraphics({
      show: json.show ?? undefined,
      positions: json.positions?.map(item => Cartesian3Parse.fromJSON(item)!) ?? undefined,
      width: json.width ?? undefined,
      height: json.height ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      extrudedHeight: json.extrudedHeight ?? undefined,
      extrudedHeightReference: HeightReferenceParse.fromJSON(json?.extrudedHeightReference),
      cornerType: CornerTypeParse.fromJSON(json?.cornerType),
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
