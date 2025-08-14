import type { JulianDate } from 'cesium';
import { CylinderGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';

import { z } from 'zod';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type CylinderGraphicsJSON = z.infer<typeof CylinderGraphicsParse.JsonSchema>;

/**
 * Serialize a `CylinderGraphics` instance to JSON and deserialize from JSON
 */
export class CylinderGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    length: z.number().optional(),
    topRadius: z.number().optional(),
    bottomRadius: z.number().optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.JsonSchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.JsonSchema.optional(),
    outlineWidth: z.number().optional(),
    numberOfVerticalLines: z.number().optional(),
    slices: z.number().optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(CylinderGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CylinderGraphics, time?: JulianDate): CylinderGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      length: toPropertyValue(instance.length, time),
      topRadius: toPropertyValue(instance.topRadius, time),
      bottomRadius: toPropertyValue(instance.bottomRadius, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      numberOfVerticalLines: toPropertyValue(instance.numberOfVerticalLines, time),
      slices: toPropertyValue(instance.slices, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: CylinderGraphicsJSON, result?: CylinderGraphics): CylinderGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new CylinderGraphics({
      show: json.show ?? undefined,
      length: json.length ?? undefined,
      topRadius: json.topRadius ?? undefined,
      bottomRadius: json.bottomRadius ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      numberOfVerticalLines: json.numberOfVerticalLines ?? undefined,
      slices: json.slices ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
