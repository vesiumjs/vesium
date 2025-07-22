import type { JulianDate } from 'cesium';
import { PolylineVolumeGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2Parse } from './Cartesian2';
import { Cartesian3Parse } from './Cartesian3';
import { ColorParse } from './Color';
import { CornerTypeParse } from './CornerType';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type PolylineVolumeGraphicsJSON = z.infer<typeof PolylineVolumeGraphicsParse.zodJsonchema>;

/**
 * Serialize a `PolylineVolumeGraphics` instance to JSON and deserialize from JSON
 */
export class PolylineVolumeGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    positions: z.array(Cartesian3Parse.zodJsonchema).optional(),
    shape: z.array(Cartesian2Parse.zodJsonchema).optional(),
    cornerType: CornerTypeParse.zodJsonchema.optional(),
    granularity: z.number().optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.zodJsonchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.zodJsonchema.optional(),
    outlineWidth: z.number().optional(),
    shadows: ShadowModeParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(PolylineVolumeGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolylineVolumeGraphics, time?: JulianDate): PolylineVolumeGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Parse.toJSON(item)),
      shape: toPropertyValue(instance.shape, time)?.map((item: any) => Cartesian2Parse.toJSON(item)),
      cornerType: CornerTypeParse.toJSON(toPropertyValue(instance.cornerType, time)),
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
  static fromJSON(json?: PolylineVolumeGraphicsJSON, result?: PolylineVolumeGraphics): PolylineVolumeGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new PolylineVolumeGraphics({
      show: json.show ?? undefined,
      positions: json.positions?.map(item => Cartesian3Parse.fromJSON(item)!) ?? undefined,
      shape: json.shape?.map((item: any) => Cartesian2Parse.fromJSON(item)!) ?? undefined,
      cornerType: CornerTypeParse.fromJSON(json?.cornerType),
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
