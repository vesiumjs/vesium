import type { JulianDate } from 'cesium';
import { EllipsoidGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type EllipsoidGraphicsJSON = z.infer<typeof EllipsoidGraphicsParse.JsonSchema>;

/**
 * Serialize a `EllipsoidGraphics` instance to JSON and deserialize from JSON
 */
export class EllipsoidGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    radii: Cartesian3Parse.JsonSchema.optional(),
    innerRadii: Cartesian3Parse.JsonSchema.optional(),
    minimumClock: z.number().optional(),
    maximumClock: z.number().optional(),
    minimumCone: z.number().optional(),
    maximumCone: z.number().optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.JsonSchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.JsonSchema.optional(),
    outlineWidth: z.number().optional(),
    stackPartitions: z.number().optional(),
    slicePartitions: z.number().optional(),
    subdivisions: z.number().optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(EllipsoidGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: EllipsoidGraphics, time?: JulianDate): EllipsoidGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      radii: Cartesian3Parse.toJSON(toPropertyValue(instance.radii, time)),
      innerRadii: Cartesian3Parse.toJSON(toPropertyValue(instance.innerRadii, time)),
      minimumClock: toPropertyValue(instance.minimumClock, time),
      maximumClock: toPropertyValue(instance.maximumClock, time),
      minimumCone: toPropertyValue(instance.minimumCone, time),
      maximumCone: toPropertyValue(instance.maximumCone, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      stackPartitions: toPropertyValue(instance.stackPartitions, time),
      slicePartitions: toPropertyValue(instance.slicePartitions, time),
      subdivisions: toPropertyValue(instance.subdivisions, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: EllipsoidGraphicsJSON, result?: EllipsoidGraphics): EllipsoidGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new EllipsoidGraphics({
      show: json.show ?? undefined,
      radii: Cartesian3Parse.fromJSON(json?.radii),
      innerRadii: Cartesian3Parse.fromJSON(json?.innerRadii),
      minimumClock: json.minimumClock ?? undefined,
      maximumClock: json.maximumClock ?? undefined,
      minimumCone: json.minimumCone ?? undefined,
      maximumCone: json.maximumCone ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      stackPartitions: json.stackPartitions ?? undefined,
      slicePartitions: json.slicePartitions ?? undefined,
      subdivisions: json.subdivisions ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
