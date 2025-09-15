import type { JulianDate } from 'cesium';
import { EllipsoidGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.EllipsoidGraphics` JSON ZodSchema
 */
export function EllipsoidGraphicsZodSchema() {
  return z.object({
    parser: z.literal('EllipsoidGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      radii: Cartesian3ZodSchema().optional(),
      innerRadii: Cartesian3ZodSchema().optional(),
      minimumClock: z.number().optional(),
      maximumClock: z.number().optional(),
      minimumCone: z.number().optional(),
      maximumCone: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      stackPartitions: z.number().optional(),
      slicePartitions: z.number().optional(),
      subdivisions: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type EllipsoidGraphicsJSON = z.infer<ReturnType<typeof EllipsoidGraphicsZodSchema>>;

/**
 * Convert `Cesium.EllipsoidGraphics` instance to JSON
 */
export function EllipsoidGraphicsToJSON(instance?: EllipsoidGraphics, time?: JulianDate): EllipsoidGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(EllipsoidGraphics).parse(instance);
  return {
    parser: 'EllipsoidGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      radii: Cartesian3ToJSON(toPropertyValue(instance.radii, time)),
      innerRadii: Cartesian3ToJSON(toPropertyValue(instance.innerRadii, time)),
      minimumClock: toPropertyValue(instance.minimumClock, time),
      maximumClock: toPropertyValue(instance.maximumClock, time),
      minimumCone: toPropertyValue(instance.minimumCone, time),
      maximumCone: toPropertyValue(instance.maximumCone, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      stackPartitions: toPropertyValue(instance.stackPartitions, time),
      slicePartitions: toPropertyValue(instance.slicePartitions, time),
      subdivisions: toPropertyValue(instance.subdivisions, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.EllipsoidGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function EllipsoidGraphicsFromJSON(json?: EllipsoidGraphicsJSON, result?: EllipsoidGraphics): EllipsoidGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipsoidGraphicsZodSchema().parse(result);
  const instance = new EllipsoidGraphics({
    show: json.value.show,
    radii: Cartesian3FromJSON(json.value.radii),
    innerRadii: Cartesian3FromJSON(json.value.innerRadii),
    minimumClock: json.value.minimumClock,
    maximumClock: json.value.maximumClock,
    minimumCone: json.value.minimumCone,
    maximumCone: json.value.maximumCone,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    stackPartitions: json.value.stackPartitions,
    slicePartitions: json.value.slicePartitions,
    subdivisions: json.value.subdivisions,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
