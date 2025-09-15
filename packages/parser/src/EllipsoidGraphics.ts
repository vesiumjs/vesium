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
export function EllipsoidGraphicsToJSON(instance?: EllipsoidGraphics, time?: JulianDate, omit?: keyof EllipsoidGraphics): EllipsoidGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(EllipsoidGraphics).parse(instance);
  return {
    parser: 'EllipsoidGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      radii: omit?.includes('radii') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.radii, time)),
      innerRadii: omit?.includes('innerRadii') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.innerRadii, time)),
      minimumClock: omit?.includes('minimumClock') ? undefined : toPropertyValue(instance.minimumClock, time),
      maximumClock: omit?.includes('maximumClock') ? undefined : toPropertyValue(instance.maximumClock, time),
      minimumCone: omit?.includes('minimumCone') ? undefined : toPropertyValue(instance.minimumCone, time),
      maximumCone: omit?.includes('maximumCone') ? undefined : toPropertyValue(instance.maximumCone, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      stackPartitions: omit?.includes('stackPartitions') ? undefined : toPropertyValue(instance.stackPartitions, time),
      slicePartitions: omit?.includes('slicePartitions') ? undefined : toPropertyValue(instance.slicePartitions, time),
      subdivisions: omit?.includes('subdivisions') ? undefined : toPropertyValue(instance.subdivisions, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.EllipsoidGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function EllipsoidGraphicsFromJSON(json?: EllipsoidGraphicsJSON, result?: EllipsoidGraphics, omit?: keyof EllipsoidGraphics): EllipsoidGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipsoidGraphicsZodSchema().parse(json);
  const instance = new EllipsoidGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    radii: omit?.includes('radii') ? undefined : Cartesian3FromJSON(json.value.radii),
    innerRadii: omit?.includes('innerRadii') ? undefined : Cartesian3FromJSON(json.value.innerRadii),
    minimumClock: omit?.includes('minimumClock') ? undefined : json.value.minimumClock,
    maximumClock: omit?.includes('maximumClock') ? undefined : json.value.maximumClock,
    minimumCone: omit?.includes('minimumCone') ? undefined : json.value.minimumCone,
    maximumCone: omit?.includes('maximumCone') ? undefined : json.value.maximumCone,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    stackPartitions: omit?.includes('stackPartitions') ? undefined : json.value.stackPartitions,
    slicePartitions: omit?.includes('slicePartitions') ? undefined : json.value.slicePartitions,
    subdivisions: omit?.includes('subdivisions') ? undefined : json.value.subdivisions,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
