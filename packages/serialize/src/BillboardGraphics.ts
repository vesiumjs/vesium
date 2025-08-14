import type { JulianDate } from 'cesium';
import { BillboardGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { BoundingRectangleParse } from './BoundingRectangle';
import { Cartesian2Parse } from './Cartesian2';
import { Cartesian3Parse } from './Cartesian3';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { HorizontalOriginParse } from './HorizontalOrigin';
import { NearFarScalarParse } from './NearFarScalar';

import { SplitDirectionParse } from './SplitDirection';
import { VerticalOriginParse } from './VerticalOrigin';

export type BillboardGraphicsJSON = z.infer<typeof BillboardGraphicsParse.JsonSchema>;

/**
 * Serialize a `BillboardGraphics` instance to JSON and deserialize from JSON
 */
export class BillboardGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    image: z.string().optional(),
    scale: z.number().optional(),
    pixelOffset: Cartesian2Parse.JsonSchema.optional(),
    eyeOffset: Cartesian3Parse.JsonSchema.optional(),
    horizontalOrigin: HorizontalOriginParse.JsonSchema.optional(),
    verticalOrigin: VerticalOriginParse.JsonSchema.optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    color: ColorParse.JsonSchema.optional(),
    rotation: z.number().optional(),
    alignedAxis: Cartesian3Parse.JsonSchema.optional(),
    sizeInMeters: z.boolean().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    scaleByDistance: NearFarScalarParse.JsonSchema.optional(),
    translucencyByDistance: NearFarScalarParse.JsonSchema.optional(),
    pixelOffsetScaleByDistance: NearFarScalarParse.JsonSchema.optional(),
    imageSubRegion: BoundingRectangleParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
    disableDepthTestDistance: z.number().optional(),
    splitDirection: SplitDirectionParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(BillboardGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: BillboardGraphics, time?: JulianDate): BillboardGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      image: toPropertyValue(instance.image, time),
      scale: toPropertyValue(instance.scale, time),
      pixelOffset: Cartesian2Parse.toJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: Cartesian3Parse.toJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: HorizontalOriginParse.toJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: VerticalOriginParse.toJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      rotation: toPropertyValue(instance.rotation, time),
      alignedAxis: Cartesian3Parse.toJSON(toPropertyValue(instance.alignedAxis, time)),
      sizeInMeters: toPropertyValue(instance.sizeInMeters, time),
      width: toPropertyValue(instance.width, time),
      height: toPropertyValue(instance.height, time),
      scaleByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      imageSubRegion: BoundingRectangleParse.toJSON(toPropertyValue(instance.imageSubRegion, time)),
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
  static fromJSON(json?: BillboardGraphicsJSON, result?: BillboardGraphics): BillboardGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new BillboardGraphics({
      show: json.show ?? undefined,
      image: json.image ?? undefined,
      scale: json.scale ?? undefined,
      pixelOffset: Cartesian2Parse.fromJSON(json?.pixelOffset),
      eyeOffset: Cartesian3Parse.fromJSON(json?.eyeOffset),
      horizontalOrigin: HorizontalOriginParse.fromJSON(json?.horizontalOrigin),
      verticalOrigin: VerticalOriginParse.fromJSON(json?.verticalOrigin),
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      color: ColorParse.fromJSON(json?.color),
      rotation: json.rotation ?? undefined,
      alignedAxis: Cartesian3Parse.fromJSON(json?.alignedAxis),
      sizeInMeters: json.sizeInMeters ?? undefined,
      width: json.width ?? undefined,
      height: json.height ?? undefined,
      scaleByDistance: NearFarScalarParse.fromJSON(json?.scaleByDistance),
      translucencyByDistance: NearFarScalarParse.fromJSON(json?.translucencyByDistance),
      pixelOffsetScaleByDistance: NearFarScalarParse.fromJSON(json?.pixelOffsetScaleByDistance),
      imageSubRegion: BoundingRectangleParse.fromJSON(json?.imageSubRegion),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance ?? undefined,
      splitDirection: SplitDirectionParse.fromJSON(json?.splitDirection),
    });
    return result ? instance.clone(result) : instance;
  }
}
