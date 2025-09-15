import type { JulianDate } from 'cesium';
import { BoxGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.BoxGraphics` JSON ZodSchema
 */
export function BoxGraphicsZodSchema() {
  return z.object({
    parser: z.literal('BoxGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      dimensions: Cartesian3ZodSchema().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type BoxGraphicsJSON = z.infer<ReturnType<typeof BoxGraphicsZodSchema>>;

/**
 * Convert `Cesium.BoxGraphics` instance to JSON
 */
export function BoxGraphicsToJSON(instance?: BoxGraphics, time?: JulianDate): BoxGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(BoxGraphics).parse(instance);
  return {
    parser: 'BoxGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      dimensions: Cartesian3ToJSON(toPropertyValue(instance.dimensions, time)),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.BoxGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function BoxGraphicsFromJSON(json?: BoxGraphicsJSON, result?: BoxGraphics): BoxGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = BoxGraphicsZodSchema().parse(json);
  const instance = new BoxGraphics({
    show: json.value.show,
    dimensions: Cartesian3FromJSON(json.value.dimensions),
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
