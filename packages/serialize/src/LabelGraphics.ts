import type { JulianDate } from 'cesium';
import { LabelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2Parse } from './Cartesian2';
import { Cartesian3Parse } from './Cartesian3';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { HorizontalOriginParse } from './HorizontalOrigin';
import { LabelStyleParse } from './LabelStyle';
import { NearFarScalarParse } from './NearFarScalar';

import { VerticalOriginParse } from './VerticalOrigin';

export type LabelGraphicsJSON = z.infer<typeof LabelGraphicsParse.zodJsonchema>;

/**
 * Serialize a `LabelGraphics` instance to JSON and deserialize from JSON
 */
export class LabelGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    text: z.string().optional(),
    font: z.string().optional(),
    style: LabelStyleParse.zodJsonchema.optional(),
    scale: z.number().optional(),
    showBackground: z.boolean().optional(),
    backgroundColor: ColorParse.zodJsonchema.optional(),
    backgroundPadding: Cartesian2Parse.zodJsonchema.optional(),
    pixelOffset: Cartesian2Parse.zodJsonchema.optional(),
    eyeOffset: Cartesian3Parse.zodJsonchema.optional(),
    horizontalOrigin: HorizontalOriginParse.zodJsonchema.optional(),
    verticalOrigin: VerticalOriginParse.zodJsonchema.optional(),
    heightReference: HeightReferenceParse.zodJsonchema.optional(),
    fillColor: ColorParse.zodJsonchema.optional(),
    outlineColor: ColorParse.zodJsonchema.optional(),
    outlineWidth: z.number().optional(),
    translucencyByDistance: NearFarScalarParse.zodJsonchema.optional(),
    pixelOffsetScaleByDistance: NearFarScalarParse.zodJsonchema.optional(),
    scaleByDistance: NearFarScalarParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
    disableDepthTestDistance: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(LabelGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: LabelGraphics, time?: JulianDate): LabelGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      text: toPropertyValue(instance.text, time),
      font: toPropertyValue(instance.font, time),
      style: LabelStyleParse.toJSON(toPropertyValue(instance.style, time)),
      scale: toPropertyValue(instance.scale, time),
      showBackground: toPropertyValue(instance.showBackground, time),
      backgroundColor: ColorParse.toJSON(toPropertyValue(instance.backgroundColor, time)),
      backgroundPadding: Cartesian2Parse.toJSON(toPropertyValue(instance.backgroundPadding, time)),
      pixelOffset: Cartesian2Parse.toJSON(toPropertyValue(instance.pixelOffset, time)),
      eyeOffset: Cartesian3Parse.toJSON(toPropertyValue(instance.eyeOffset, time)),
      horizontalOrigin: HorizontalOriginParse.toJSON(toPropertyValue(instance.horizontalOrigin, time)),
      verticalOrigin: VerticalOriginParse.toJSON(toPropertyValue(instance.verticalOrigin, time)),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      fillColor: ColorParse.toJSON(toPropertyValue(instance.fillColor, time)),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      translucencyByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
      pixelOffsetScaleByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
      scaleByDistance: NearFarScalarParse.toJSON(toPropertyValue(instance.scaleByDistance, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: LabelGraphicsJSON, result?: LabelGraphics): LabelGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new LabelGraphics({
      show: json.show ?? undefined,
      text: json.text ?? undefined,
      font: json.font ?? undefined,
      style: LabelStyleParse.fromJSON(json?.style),
      scale: json.scale ?? undefined,
      showBackground: json.showBackground ?? undefined,
      backgroundColor: ColorParse.fromJSON(json?.backgroundColor),
      backgroundPadding: Cartesian2Parse.fromJSON(json?.backgroundPadding),
      pixelOffset: Cartesian2Parse.fromJSON(json?.pixelOffset),
      eyeOffset: Cartesian3Parse.fromJSON(json?.eyeOffset),
      horizontalOrigin: HorizontalOriginParse.fromJSON(json?.horizontalOrigin),
      verticalOrigin: VerticalOriginParse.fromJSON(json?.verticalOrigin),
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      fillColor: ColorParse.fromJSON(json?.fillColor),
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      translucencyByDistance: NearFarScalarParse.fromJSON(json?.translucencyByDistance),
      pixelOffsetScaleByDistance: NearFarScalarParse.fromJSON(json?.pixelOffsetScaleByDistance),
      scaleByDistance: NearFarScalarParse.fromJSON(json?.scaleByDistance),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
