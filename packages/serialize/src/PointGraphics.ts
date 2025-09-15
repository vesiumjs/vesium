import type { JulianDate } from 'cesium';
import { PointGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { SplitDirectionFromJSON, SplitDirectionToJSON, SplitDirectionZodSchema } from './SplitDirection';

/**
 * `Cesium.PointGraphics` JSON ZodSchema
 */
export function PointGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PointGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      pixelSize: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      color: ColorZodSchema().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      scaleByDistance: NearFarScalarZodSchema().optional(),
      translucencyByDistance: NearFarScalarZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      disableDepthTestDistance: z.number().optional(),
      splitDirection: SplitDirectionZodSchema().optional(),
    }),
  });
}

export type PointGraphicsJSON = z.infer<ReturnType<typeof PointGraphicsZodSchema>>;

/**
 * Convert `Cesium.PointGraphics` instance to JSON
 */
export function PointGraphicsToJSON(instance?: PointGraphics, time?: JulianDate): PointGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PointGraphics).parse(instance);
  return {
    parser: 'PointGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      pixelSize: toPropertyValue(instance.pixelSize, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      scaleByDistance: NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
      splitDirection: SplitDirectionToJSON(toPropertyValue(instance.splitDirection, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PointGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PointGraphicsFromJSON(json?: PointGraphicsJSON, result?: PointGraphics): PointGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PointGraphicsZodSchema().parse(result);
  const instance = new PointGraphics({
    show: json.value.show,
    pixelSize: json.value.pixelSize,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    color: ColorFromJSON(json.value.color),
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    scaleByDistance: NearFarScalarFromJSON(json.value.scaleByDistance),
    translucencyByDistance: NearFarScalarFromJSON(json.value.translucencyByDistance),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: json.value.disableDepthTestDistance,
    splitDirection: SplitDirectionFromJSON(json.value.splitDirection),
  });
  return result ? instance.clone(result) : instance;
}
