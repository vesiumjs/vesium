import type { JulianDate } from 'cesium';
import { BillboardGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { BoundingRectangleFromJSON, BoundingRectangleToJSON, BoundingRectangleZodSchema } from './BoundingRectangle';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { HorizontalOriginFromJSON, HorizontalOriginToJSON, HorizontalOriginZodSchema } from './HorizontalOrigin';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { SplitDirectionFromJSON, SplitDirectionToJSON, SplitDirectionZodSchema } from './SplitDirection';
import { VerticalOriginFromJSON, VerticalOriginToJSON, VerticalOriginZodSchema } from './VerticalOrigin';

/**
 * `Cesium.BillboardGraphics` JSON ZodSchema
 */
export function BillboardGraphicsZodSchema() {
  return z.object({
    parser: z.literal('BillboardGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      image: z.string().optional(),
      scale: z.number().optional(),
      pixelOffset: Cartesian2ZodSchema().optional(),
      eyeOffset: Cartesian3ZodSchema().optional(),
      horizontalOrigin: HorizontalOriginZodSchema().optional(),
      verticalOrigin: VerticalOriginZodSchema().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      color: ColorZodSchema().optional(),
      rotation: z.number().optional(),
      alignedAxis: Cartesian3ZodSchema().optional(),
      sizeInMeters: z.boolean().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      scaleByDistance: NearFarScalarZodSchema().optional(),
      translucencyByDistance: NearFarScalarZodSchema().optional(),
      pixelOffsetScaleByDistance: NearFarScalarZodSchema().optional(),
      imageSubRegion: BoundingRectangleZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      disableDepthTestDistance: z.number().optional(),
      splitDirection: SplitDirectionZodSchema().optional(),
    }),
  });
}

export type BillboardGraphicsJSON = z.infer<ReturnType<typeof BillboardGraphicsZodSchema>>;

/**
 * Convert `Cesium.BillboardGraphics` instance to JSON
 */
export function BillboardGraphicsToJSON(instance?: BillboardGraphics, time?: JulianDate): BillboardGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(BillboardGraphics).parse(instance);
  return {
    parser: 'BillboardGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      image: toPropertyValue(instance.image, time),
      scale: toPropertyValue(instance.scale, time),
      pixelOffset: Cartesian2ToJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: Cartesian3ToJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: HorizontalOriginToJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: VerticalOriginToJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      rotation: toPropertyValue(instance.rotation, time),
      alignedAxis: Cartesian3ToJSON(toPropertyValue(instance.alignedAxis, time)),
      sizeInMeters: toPropertyValue(instance.sizeInMeters, time),
      width: toPropertyValue(instance.width, time),
      height: toPropertyValue(instance.height, time),
      scaleByDistance: NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: NearFarScalarToJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      imageSubRegion: BoundingRectangleToJSON(toPropertyValue(instance.imageSubRegion, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
      splitDirection: SplitDirectionToJSON(toPropertyValue(instance.splitDirection, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.BillboardGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function BillboardGraphicsFromJSON(json?: BillboardGraphicsJSON, result?: BillboardGraphics): BillboardGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = BillboardGraphicsZodSchema().parse(result);
  const instance = new BillboardGraphics({
    show: json.value.show,
    image: json.value.image,
    scale: json.value.scale,
    pixelOffset: Cartesian2FromJSON(json.value.pixelOffset),
    eyeOffset: Cartesian3FromJSON(json.value.eyeOffset),
    horizontalOrigin: HorizontalOriginFromJSON(json.value.horizontalOrigin),
    verticalOrigin: VerticalOriginFromJSON(json.value.verticalOrigin),
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    color: ColorFromJSON(json.value.color),
    rotation: json.value.rotation,
    alignedAxis: Cartesian3FromJSON(json.value.alignedAxis),
    sizeInMeters: json.value.sizeInMeters,
    width: json.value.width,
    height: json.value.height,
    scaleByDistance: NearFarScalarFromJSON(json.value.scaleByDistance),
    translucencyByDistance: NearFarScalarFromJSON(json.value.translucencyByDistance),
    pixelOffsetScaleByDistance: NearFarScalarFromJSON(json.value.pixelOffsetScaleByDistance),
    imageSubRegion: BoundingRectangleFromJSON(json.value.imageSubRegion),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: json.value.disableDepthTestDistance,
    splitDirection: SplitDirectionFromJSON(json.value.splitDirection),
  });
  return result ? instance.clone(result) : instance;
}
