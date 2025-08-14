import type { JulianDate } from 'cesium';
import { WallGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type WallGraphicsJSON = z.infer<typeof WallGraphicsParse.JsonSchema>;

/**
 * Serialize a `WallGraphics` instance to JSON and deserialize from JSON
 */
export class WallGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    positions: z.array(Cartesian3Parse.JsonSchema).optional(),
    minimumHeights: z.array(z.number()).optional(),
    maximumHeights: z.array(z.number()).optional(),
    granularity: z.number().optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.JsonSchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.JsonSchema.optional(),
    outlineWidth: z.number().optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(WallGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: WallGraphics, time?: JulianDate): WallGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Parse.toJSON(item)),
      minimumHeights: toPropertyValue(instance.minimumHeights, time),
      maximumHeights: toPropertyValue(instance.maximumHeights, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: WallGraphicsJSON, result?: WallGraphics): WallGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new WallGraphics({
      show: json.show ?? undefined,
      positions: json.positions?.map(item => Cartesian3Parse.fromJSON(item)!) ?? undefined,
      minimumHeights: json.minimumHeights ?? undefined,
      maximumHeights: json.maximumHeights ?? undefined,
      granularity: json.granularity ?? undefined,
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
