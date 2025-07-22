import type { JulianDate } from 'cesium';
import { PointGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { NearFarScalarParse } from './NearFarScalar';

import { SplitDirectionParse } from './SplitDirection';

export type PointGraphicsJSON = z.infer<typeof PointGraphicsParse.zodJsonchema>;

/**
 * Serialize a `PointGraphics` instance to JSON and deserialize from JSON
 */
export class PointGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    pixelSize: z.number().optional(),
    heightReference: HeightReferenceParse.zodJsonchema.optional(),
    color: ColorParse.zodJsonchema.optional(),
    outlineColor: ColorParse.zodJsonchema.optional(),
    outlineWidth: z.number().optional(),
    scaleByDistance: NearFarScalarParse.zodJsonchema.optional(),
    translucencyByDistance: NearFarScalarParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
    disableDepthTestDistance: z.number().optional(),
    splitDirection: SplitDirectionParse.zodJsonchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(PointGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PointGraphics, time?: JulianDate): PointGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      pixelSize: toPropertyValue(instance.pixelSize, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      scaleByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
      splitDirection: SplitDirectionParse.toJSON(toPropertyValue(instance.splitDirection, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PointGraphicsJSON, result?: PointGraphics): PointGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new PointGraphics({
      show: json.show ?? undefined,
      pixelSize: json.pixelSize ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      color: ColorParse.fromJSON(json?.color),
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      scaleByDistance: NearFarScalarParse.fromJSON(json?.scaleByDistance),
      translucencyByDistance: NearFarScalarParse.fromJSON(json?.translucencyByDistance),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance ?? undefined,
      splitDirection: SplitDirectionParse.fromJSON(json?.splitDirection),
    });
    return result ? instance.clone(result) : instance;
  }
}
