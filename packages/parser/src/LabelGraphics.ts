import type { JulianDate } from 'cesium';
import { LabelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { HorizontalOriginFromJSON, HorizontalOriginToJSON, HorizontalOriginZodSchema } from './HorizontalOrigin';
import { LabelStyleFromJSON, LabelStyleToJSON, LabelStyleZodSchema } from './LabelStyle';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { VerticalOriginFromJSON, VerticalOriginToJSON, VerticalOriginZodSchema } from './VerticalOrigin';

/**
 * `Cesium.LabelGraphics` JSON ZodSchema
 */
export function LabelGraphicsZodSchema() {
  return z.object({
    parser: z.literal('LabelGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      text: z.string().optional(),
      font: z.string().optional(),
      style: LabelStyleZodSchema().optional(),
      scale: z.number().optional(),
      showBackground: z.boolean().optional(),
      backgroundColor: ColorZodSchema().optional(),
      backgroundPadding: Cartesian2ZodSchema().optional(),
      pixelOffset: Cartesian2ZodSchema().optional(),
      eyeOffset: Cartesian3ZodSchema().optional(),
      horizontalOrigin: HorizontalOriginZodSchema().optional(),
      verticalOrigin: VerticalOriginZodSchema().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      fillColor: ColorZodSchema().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      translucencyByDistance: NearFarScalarZodSchema().optional(),
      pixelOffsetScaleByDistance: NearFarScalarZodSchema().optional(),
      scaleByDistance: NearFarScalarZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      disableDepthTestDistance: z.number().optional(),
    }),
  });
}

export type LabelGraphicsJSON = z.infer<ReturnType<typeof LabelGraphicsZodSchema>>;

/**
 * Convert `Cesium.LabelGraphics` instance to JSON
 */
export function LabelGraphicsToJSON(instance?: LabelGraphics, time?: JulianDate): LabelGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(LabelGraphics).parse(instance);
  return {
    parser: 'LabelGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      text: toPropertyValue(instance.text, time),
      font: toPropertyValue(instance.font, time),
      style: LabelStyleToJSON(toPropertyValue(instance.style, time)),
      scale: toPropertyValue(instance.scale, time),
      showBackground: toPropertyValue(instance.showBackground, time),
      backgroundColor: ColorToJSON(toPropertyValue(instance.backgroundColor, time)),
      backgroundPadding: Cartesian2ToJSON(toPropertyValue(instance.backgroundPadding, time)),
      pixelOffset: Cartesian2ToJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: Cartesian3ToJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: HorizontalOriginToJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: VerticalOriginToJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fillColor: ColorToJSON(toPropertyValue(instance.fillColor, time)),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      translucencyByDistance: NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: NearFarScalarToJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      scaleByDistance: NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.LabelGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function LabelGraphicsFromJSON(json?: LabelGraphicsJSON, result?: LabelGraphics): LabelGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = LabelGraphicsZodSchema().parse(json);
  const instance = new LabelGraphics({
    show: json.value.show,
    text: json.value.text,
    font: json.value.font,
    style: LabelStyleFromJSON(json.value.style),
    scale: json.value.scale,
    showBackground: json.value.showBackground,
    backgroundColor: ColorFromJSON(json.value.backgroundColor),
    backgroundPadding: Cartesian2FromJSON(json.value.backgroundPadding),
    pixelOffset: Cartesian2FromJSON(json.value.pixelOffset),
    eyeOffset: Cartesian3FromJSON(json.value.eyeOffset),
    horizontalOrigin: HorizontalOriginFromJSON(json.value.horizontalOrigin),
    verticalOrigin: VerticalOriginFromJSON(json.value.verticalOrigin),
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    fillColor: ColorFromJSON(json.value.fillColor),
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    translucencyByDistance: NearFarScalarFromJSON(json.value.translucencyByDistance),
    pixelOffsetScaleByDistance: NearFarScalarFromJSON(json.value.pixelOffsetScaleByDistance),
    scaleByDistance: NearFarScalarFromJSON(json.value.scaleByDistance),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: json.value.disableDepthTestDistance,
  });
  return result ? instance.clone(result) : instance;
}
