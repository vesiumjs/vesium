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
export function PointGraphicsToJSON(instance?: PointGraphics, time?: JulianDate, omit?: keyof PointGraphics): PointGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PointGraphics).parse(instance);
  return {
    parser: 'PointGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      pixelSize: omit?.includes('pixelSize') ? undefined : toPropertyValue(instance.pixelSize, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      color: omit?.includes('color') ? undefined : ColorToJSON(toPropertyValue(instance.color, time)),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.scaleByDistance, time)),
      translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarToJSON(toPropertyValue(instance.translucencyByDistance, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : toPropertyValue(instance.disableDepthTestDistance, time),
      splitDirection: omit?.includes('splitDirection') ? undefined : SplitDirectionToJSON(toPropertyValue(instance.splitDirection, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PointGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PointGraphicsFromJSON(json?: PointGraphicsJSON, result?: PointGraphics, omit?: keyof PointGraphics): PointGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PointGraphicsZodSchema().parse(json);
  const instance = new PointGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    pixelSize: omit?.includes('pixelSize') ? undefined : json.value.pixelSize,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    color: omit?.includes('color') ? undefined : ColorFromJSON(json.value.color),
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    scaleByDistance: omit?.includes('scaleByDistance') ? undefined : NearFarScalarFromJSON(json.value.scaleByDistance),
    translucencyByDistance: omit?.includes('translucencyByDistance') ? undefined : NearFarScalarFromJSON(json.value.translucencyByDistance),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    disableDepthTestDistance: omit?.includes('disableDepthTestDistance') ? undefined : json.value.disableDepthTestDistance,
    splitDirection: omit?.includes('splitDirection') ? undefined : SplitDirectionFromJSON(json.value.splitDirection),
  });
  return result ? instance.clone(result) : instance;
}
