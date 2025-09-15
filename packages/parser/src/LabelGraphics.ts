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
export function LabelGraphicsToJSON(instance?: LabelGraphics, time?: JulianDate, omit?: keyof LabelGraphics): LabelGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(LabelGraphics).parse(instance);
  return {
    parser: 'LabelGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      text: omit?.includes('text') ? undefined : toPropertyValue(instance.text, time),
      font: omit?.includes('font') ? undefined : toPropertyValue(instance.font, time),
      style: omit?.includes('style') ? undefined : LabelStyleToJSON(toPropertyValue(instance.style, time)),
      scale: omit?.includes('scale') ? undefined : toPropertyValue(instance.scale, time),
      showBackground: omit?.includes('showBackground') ? undefined : toPropertyValue(instance.showBackground, time),
      backgroundColor: omit?.includes('backgroundColor') ? undefined : ColorToJSON(toPropertyValue(instance.backgroundColor, time)),
      backgroundPadding: omit?.includes('backgroundPadding') ? undefined : Cartesian2ToJSON(toPropertyValue(instance.backgroundPadding, time)),
      pixelOffset: omit?.includes('pixelOffset') ? undefined : Cartesian2ToJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: omit?.includes('eyeOffset') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: omit?.includes('horizontalOrigin') ? undefined : HorizontalOriginToJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: omit?.includes('verticalOrigin') ? undefined : VerticalOriginToJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fillColor: omit?.includes('fillColor') ? undefined : ColorToJSON(toPropertyValue(instance.fillColor, time)),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: omit?.includes('pixelOffsetScaleByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : toPropertyValue(instance.disableDepthTestDistance, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.LabelGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function LabelGraphicsFromJSON(json?: LabelGraphicsJSON, result?: LabelGraphics, omit?: keyof LabelGraphics): LabelGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = LabelGraphicsZodSchema().parse(json);
  const instance = new LabelGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    text: omit?.includes('text') ? undefined : json.value.text,
    font: omit?.includes('font') ? undefined : json.value.font,
    style: omit?.includes('style') ? undefined : LabelStyleFromJSON(json.value.style),
    scale: omit?.includes('scale') ? undefined : json.value.scale,
    showBackground: omit?.includes('showBackground') ? undefined : json.value.showBackground,
    backgroundColor: omit?.includes('backgroundColor') ? undefined : ColorFromJSON(json.value.backgroundColor),
    backgroundPadding: omit?.includes('backgroundPadding') ? undefined : Cartesian2FromJSON(json.value.backgroundPadding),
    pixelOffset: omit?.includes('pixelOffset') ? undefined : Cartesian2FromJSON(json.value.pixelOffset),
    eyeOffset: omit?.includes('eyeOffset') ? undefined : Cartesian3FromJSON(json.value.eyeOffset),
    horizontalOrigin: omit?.includes('horizontalOrigin') ? undefined : HorizontalOriginFromJSON(json.value.horizontalOrigin),
    verticalOrigin: omit?.includes('verticalOrigin') ? undefined : VerticalOriginFromJSON(json.value.verticalOrigin),
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    fillColor: omit?.includes('fillColor') ? undefined : ColorFromJSON(json.value.fillColor),
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarFromJSON(json.value.translucencyByDistance),
    pixelOffsetScaleByDistance: omit?.includes('pixelOffsetScaleByDistance') ? undefined : NearFarScalarFromJSON(json.value.pixelOffsetScaleByDistance),
    scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarFromJSON(json.value.scaleByDistance),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : json.value.disableDepthTestDistance,
  });
  return result ? instance.clone(result) : instance;
}
