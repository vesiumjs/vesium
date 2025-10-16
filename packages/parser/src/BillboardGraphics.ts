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
export function BillboardGraphicsToJSON(instance?: BillboardGraphics, time?: JulianDate, omit?: keyof BillboardGraphics): BillboardGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(BillboardGraphics).parse(instance);
  return {
    parser: 'BillboardGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      image: omit?.includes('image') ? undefined : toPropertyValue(instance.image, time),
      scale: omit?.includes('scale') ? undefined : toPropertyValue(instance.scale, time),
      pixelOffset: omit?.includes('pixelOffset') ? undefined : Cartesian2ToJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: omit?.includes('eyeOffset') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: omit?.includes('horizontalOrigin') ? undefined : HorizontalOriginToJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: omit?.includes('verticalOrigin') ? undefined : VerticalOriginToJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      color: omit?.includes('color') ? undefined : ColorToJSON(toPropertyValue(instance.color, time)),
      rotation: omit?.includes('rotation') ? undefined : toPropertyValue(instance.rotation, time),
      alignedAxis: omit?.includes('alignedAxis') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.alignedAxis, time)),
      sizeInMeters: omit?.includes('sizeInMeters') ? undefined : toPropertyValue(instance.sizeInMeters, time),
      width: omit?.includes('width') ? undefined : toPropertyValue(instance.width, time),
      height: omit?.includes('height') ? undefined : toPropertyValue(instance.height, time),
      scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: omit?.includes('pixelOffsetScaleByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      imageSubRegion: omit?.includes('imageSubRegion') ? undefined : BoundingRectangleToJSON(toPropertyValue(instance.imageSubRegion, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : toPropertyValue(instance.disableDepthTestDistance, time),
      splitDirection: omit?.includes('splitDirection') ? undefined : SplitDirectionToJSON(toPropertyValue(instance.splitDirection, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.BillboardGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function BillboardGraphicsFromJSON(json?: BillboardGraphicsJSON, result?: BillboardGraphics, omit?: keyof BillboardGraphics): BillboardGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = BillboardGraphicsZodSchema().parse(json);
  const instance = new BillboardGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    image: omit?.includes('image') ? undefined : json.value.image,
    scale: omit?.includes('scale') ? undefined : json.value.scale,
    pixelOffset: omit?.includes('pixelOffset') ? undefined : Cartesian2FromJSON(json.value.pixelOffset),
    eyeOffset: omit?.includes('eyeOffset') ? undefined : Cartesian3FromJSON(json.value.eyeOffset),
    horizontalOrigin: omit?.includes('horizontalOrigin') ? undefined : HorizontalOriginFromJSON(json.value.horizontalOrigin),
    verticalOrigin: omit?.includes('verticalOrigin') ? undefined : VerticalOriginFromJSON(json.value.verticalOrigin),
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    color: omit?.includes('color') ? undefined : ColorFromJSON(json.value.color),
    rotation: omit?.includes('rotation') ? undefined : json.value.rotation,
    alignedAxis: omit?.includes('alignedAxis') ? undefined : Cartesian3FromJSON(json.value.alignedAxis),
    sizeInMeters: omit?.includes('sizeInMeters') ? undefined : json.value.sizeInMeters,
    width: omit?.includes('width') ? undefined : json.value.width,
    height: omit?.includes('height') ? undefined : json.value.height,
    scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarFromJSON(json.value.scaleByDistance),
    translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarFromJSON(json.value.translucencyByDistance),
    pixelOffsetScaleByDistance: omit?.includes('pixelOffsetScaleByDistance') ? undefined : NearFarScalarFromJSON(json.value.pixelOffsetScaleByDistance),
    imageSubRegion: omit?.includes('imageSubRegion') ? undefined : BoundingRectangleFromJSON(json.value.imageSubRegion),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : json.value.disableDepthTestDistance,
    splitDirection: omit?.includes('splitDirection') ? undefined : SplitDirectionFromJSON(json.value.splitDirection),
  });
  return result ? instance.clone(result) : instance;
}
