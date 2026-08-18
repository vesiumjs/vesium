import type { Label, LabelCollection, Scene } from 'cesium';
import { Label as CesiumLabel } from 'cesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { HorizontalOriginFromJSON, HorizontalOriginToJSON, HorizontalOriginZodSchema } from './HorizontalOrigin';
import { LabelStyleFromJSON, LabelStyleToJSON, LabelStyleZodSchema } from './LabelStyle';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { assertSceneForHeightReference, orderedNearFar, primitiveIdToJSON } from './primitive';
import { readPrivate } from './private';
import { VerticalOriginFromJSON, VerticalOriginToJSON, VerticalOriginZodSchema } from './VerticalOrigin';

const orderedNearFarSchema = orderedNearFar(NearFarScalarZodSchema());
const orderedDistanceSchema = orderedNearFar(DistanceDisplayConditionZodSchema());

export function LabelZodSchema() {
  return z.object({
    parser: z.literal('Label'),
    value: z.object({
      backgroundColor: ColorZodSchema().optional(),
      backgroundPadding: Cartesian2ZodSchema().optional(),
      disableDepthTestDistance: z.number().nonnegative().optional(),
      distanceDisplayCondition: orderedDistanceSchema.optional(),
      eyeOffset: Cartesian3ZodSchema().optional(),
      fillColor: ColorZodSchema().optional(),
      font: z.string().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      horizontalOrigin: HorizontalOriginZodSchema().optional(),
      id: z.string().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      pixelOffset: Cartesian2ZodSchema().optional(),
      pixelOffsetScaleByDistance: orderedNearFarSchema.optional(),
      position: Cartesian3ZodSchema(),
      scale: z.number().optional(),
      scaleByDistance: orderedNearFarSchema.optional(),
      show: z.boolean().optional(),
      showBackground: z.boolean().optional(),
      style: LabelStyleZodSchema().optional(),
      text: z.string().optional(),
      translucencyByDistance: orderedNearFarSchema.optional(),
      verticalOrigin: VerticalOriginZodSchema().optional(),
    }),
  });
}

export type LabelJSON = z.infer<ReturnType<typeof LabelZodSchema>>;

export function LabelToJSON(instance?: Label): LabelJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CesiumLabel).parse(instance);
  return LabelZodSchema().parse({
    parser: 'Label',
    value: {
      backgroundColor: ColorToJSON(instance.backgroundColor),
      backgroundPadding: Cartesian2ToJSON(instance.backgroundPadding),
      disableDepthTestDistance: instance.disableDepthTestDistance,
      distanceDisplayCondition: DistanceDisplayConditionToJSON(instance.distanceDisplayCondition),
      eyeOffset: Cartesian3ToJSON(instance.eyeOffset),
      fillColor: ColorToJSON(instance.fillColor),
      font: instance.font,
      heightReference: HeightReferenceToJSON(instance.heightReference),
      horizontalOrigin: HorizontalOriginToJSON(instance.horizontalOrigin),
      id: primitiveIdToJSON(instance.id),
      outlineColor: ColorToJSON(instance.outlineColor),
      outlineWidth: instance.outlineWidth,
      pixelOffset: Cartesian2ToJSON(instance.pixelOffset),
      pixelOffsetScaleByDistance: NearFarScalarToJSON(instance.pixelOffsetScaleByDistance),
      position: Cartesian3ToJSON(instance.position),
      scale: instance.scale,
      scaleByDistance: NearFarScalarToJSON(instance.scaleByDistance),
      show: instance.show,
      showBackground: instance.showBackground,
      style: LabelStyleToJSON(instance.style),
      text: instance.text,
      translucencyByDistance: NearFarScalarToJSON(instance.translucencyByDistance),
      verticalOrigin: VerticalOriginToJSON(instance.verticalOrigin),
    },
  });
}

export function LabelFromJSON(json: LabelJSON, collection: LabelCollection): Label {
  const parsed = LabelZodSchema().parse(json).value;
  if (!collection) {
    throw new TypeError('LabelFromJSON requires a LabelCollection.');
  }
  const heightReference = HeightReferenceFromJSON(parsed.heightReference);
  assertSceneForHeightReference(
    heightReference,
    readPrivate<Scene>(collection, '_scene'),
    'LabelFromJSON',
  );
  return collection.add({
    backgroundColor: ColorFromJSON(parsed.backgroundColor),
    backgroundPadding: Cartesian2FromJSON(parsed.backgroundPadding),
    disableDepthTestDistance: parsed.disableDepthTestDistance,
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(parsed.distanceDisplayCondition),
    eyeOffset: Cartesian3FromJSON(parsed.eyeOffset),
    fillColor: ColorFromJSON(parsed.fillColor),
    font: parsed.font,
    heightReference,
    horizontalOrigin: HorizontalOriginFromJSON(parsed.horizontalOrigin),
    id: parsed.id,
    outlineColor: ColorFromJSON(parsed.outlineColor),
    outlineWidth: parsed.outlineWidth,
    pixelOffset: Cartesian2FromJSON(parsed.pixelOffset),
    pixelOffsetScaleByDistance: NearFarScalarFromJSON(parsed.pixelOffsetScaleByDistance),
    position: Cartesian3FromJSON(parsed.position)!,
    scale: parsed.scale,
    scaleByDistance: NearFarScalarFromJSON(parsed.scaleByDistance),
    show: parsed.show,
    showBackground: parsed.showBackground,
    style: LabelStyleFromJSON(parsed.style),
    text: parsed.text,
    translucencyByDistance: NearFarScalarFromJSON(parsed.translucencyByDistance),
    verticalOrigin: VerticalOriginFromJSON(parsed.verticalOrigin),
  });
}
