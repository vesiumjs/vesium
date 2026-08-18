import type { Billboard, BillboardCollection, Scene } from 'cesium';
import { Billboard as CesiumBillboard } from 'cesium';
import { z } from 'zod';
import { BillboardGetSerializationSource, BillboardSetSerializationSource } from './BillboardSerialization';
import { BoundingRectangleFromJSON, BoundingRectangleZodSchema } from './BoundingRectangle';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { HorizontalOriginFromJSON, HorizontalOriginToJSON, HorizontalOriginZodSchema } from './HorizontalOrigin';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { assertSceneForHeightReference, orderedNearFar, primitiveIdToJSON } from './primitive';
import { readPrivate } from './private';
import { SplitDirectionFromJSON, SplitDirectionToJSON, SplitDirectionZodSchema } from './SplitDirection';
import { VerticalOriginFromJSON, VerticalOriginToJSON, VerticalOriginZodSchema } from './VerticalOrigin';

const orderedNearFarSchema = orderedNearFar(NearFarScalarZodSchema());
const orderedDistanceSchema = orderedNearFar(DistanceDisplayConditionZodSchema());

export function BillboardZodSchema() {
  return z.object({
    parser: z.literal('Billboard'),
    value: z.object({
      alignedAxis: Cartesian3ZodSchema().optional(),
      color: ColorZodSchema().optional(),
      disableDepthTestDistance: z.number().nonnegative().optional(),
      distanceDisplayCondition: orderedDistanceSchema.optional(),
      eyeOffset: Cartesian3ZodSchema().optional(),
      height: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      horizontalOrigin: HorizontalOriginZodSchema().optional(),
      imageSubRegion: BoundingRectangleZodSchema().optional(),
      id: z.string().optional(),
      image: z.string().optional(),
      pixelOffset: Cartesian2ZodSchema().optional(),
      pixelOffsetScaleByDistance: orderedNearFarSchema.optional(),
      position: Cartesian3ZodSchema(),
      rotation: z.number().optional(),
      scale: z.number().optional(),
      scaleByDistance: orderedNearFarSchema.optional(),
      show: z.boolean().optional(),
      sizeInMeters: z.boolean().optional(),
      splitDirection: SplitDirectionZodSchema().optional(),
      translucencyByDistance: orderedNearFarSchema.optional(),
      verticalOrigin: VerticalOriginZodSchema().optional(),
      width: z.number().optional(),
    }),
  });
}

export type BillboardJSON = z.infer<ReturnType<typeof BillboardZodSchema>>;

export function BillboardToJSON(instance?: Billboard): BillboardJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CesiumBillboard).parse(instance);
  const source = BillboardGetSerializationSource(instance);
  return BillboardZodSchema().parse({
    parser: 'Billboard',
    value: {
      alignedAxis: Cartesian3ToJSON(instance.alignedAxis),
      color: ColorToJSON(instance.color),
      disableDepthTestDistance: instance.disableDepthTestDistance,
      distanceDisplayCondition: DistanceDisplayConditionToJSON(instance.distanceDisplayCondition),
      eyeOffset: Cartesian3ToJSON(instance.eyeOffset),
      height: instance.height,
      heightReference: HeightReferenceToJSON(instance.heightReference),
      horizontalOrigin: HorizontalOriginToJSON(instance.horizontalOrigin),
      imageSubRegion: source?.imageSubRegion,
      id: primitiveIdToJSON(instance.id),
      image: source?.image,
      pixelOffset: Cartesian2ToJSON(instance.pixelOffset),
      pixelOffsetScaleByDistance: NearFarScalarToJSON(instance.pixelOffsetScaleByDistance),
      position: Cartesian3ToJSON(instance.position),
      rotation: instance.rotation,
      scale: instance.scale,
      scaleByDistance: NearFarScalarToJSON(instance.scaleByDistance),
      show: instance.show,
      sizeInMeters: instance.sizeInMeters,
      splitDirection: SplitDirectionToJSON(instance.splitDirection),
      translucencyByDistance: NearFarScalarToJSON(instance.translucencyByDistance),
      verticalOrigin: VerticalOriginToJSON(instance.verticalOrigin),
      width: instance.width,
    },
  });
}

export function BillboardFromJSON(json: BillboardJSON, collection: BillboardCollection): Billboard {
  const parsed = BillboardZodSchema().parse(json).value;
  if (!collection) {
    throw new TypeError('BillboardFromJSON requires a BillboardCollection.');
  }
  const heightReference = HeightReferenceFromJSON(parsed.heightReference);
  assertSceneForHeightReference(
    heightReference,
    readPrivate<Scene>(collection, '_scene'),
    'BillboardFromJSON',
  );
  const imageSubRegion = BoundingRectangleFromJSON(parsed.imageSubRegion);
  const instance = collection.add({
    alignedAxis: Cartesian3FromJSON(parsed.alignedAxis),
    color: ColorFromJSON(parsed.color),
    disableDepthTestDistance: parsed.disableDepthTestDistance,
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(parsed.distanceDisplayCondition),
    eyeOffset: Cartesian3FromJSON(parsed.eyeOffset),
    height: parsed.height,
    heightReference,
    horizontalOrigin: HorizontalOriginFromJSON(parsed.horizontalOrigin),
    id: parsed.id,
    image: parsed.image,
    imageSubRegion,
    pixelOffset: Cartesian2FromJSON(parsed.pixelOffset),
    pixelOffsetScaleByDistance: NearFarScalarFromJSON(parsed.pixelOffsetScaleByDistance),
    position: Cartesian3FromJSON(parsed.position)!,
    rotation: parsed.rotation,
    scale: parsed.scale,
    scaleByDistance: NearFarScalarFromJSON(parsed.scaleByDistance),
    show: parsed.show,
    sizeInMeters: parsed.sizeInMeters,
    splitDirection: SplitDirectionFromJSON(parsed.splitDirection),
    translucencyByDistance: NearFarScalarFromJSON(parsed.translucencyByDistance),
    verticalOrigin: VerticalOriginFromJSON(parsed.verticalOrigin),
    width: parsed.width,
  });
  BillboardSetSerializationSource(instance, {
    image: parsed.image,
    imageSubRegion,
  });
  return instance;
}
