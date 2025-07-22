import type { JulianDate } from 'cesium';
import { EllipseGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ClassificationTypeParse } from './ClassificationType';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type EllipseGraphicsJSON = z.infer<typeof EllipseGraphicsParse.zodJsonchema>;

/**
 * Serialize a `EllipseGraphics` instance to JSON and deserialize from JSON
 */
export class EllipseGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    semiMajorAxis: z.number().optional(),
    semiMinorAxis: z.number().optional(),
    height: z.number().optional(),
    heightReference: HeightReferenceParse.zodJsonchema.optional(),
    extrudedHeight: z.number().optional(),
    extrudedHeightReference: HeightReferenceParse.zodJsonchema.optional(),
    rotation: z.number().optional(),
    stRotation: z.number().optional(),
    granularity: z.number().optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.zodJsonchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.zodJsonchema.optional(),
    outlineWidth: z.number().optional(),
    numberOfVerticalLines: z.number().optional(),
    shadows: ShadowModeParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
    classificationType: ClassificationTypeParse.zodJsonchema.optional(),
    zIndex: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(EllipseGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: EllipseGraphics, time?: JulianDate): EllipseGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      semiMajorAxis: toPropertyValue(instance.semiMajorAxis, time),
      semiMinorAxis: toPropertyValue(instance.semiMinorAxis, time),
      height: toPropertyValue(instance.height, time),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
      extrudedHeightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
      rotation: toPropertyValue(instance.rotation, time),
      stRotation: toPropertyValue(instance.stRotation, time),
      granularity: toPropertyValue(instance.granularity, time),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      numberOfVerticalLines: toPropertyValue(instance.numberOfVerticalLines, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeParse.toJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: EllipseGraphicsJSON, result?: EllipseGraphics): EllipseGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new EllipseGraphics({
      show: json.show ?? undefined,
      semiMajorAxis: json.semiMajorAxis ?? undefined,
      semiMinorAxis: json.semiMinorAxis ?? undefined,
      height: json.height ?? undefined,
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      extrudedHeight: json.extrudedHeight ?? undefined,
      extrudedHeightReference: HeightReferenceParse.fromJSON(json?.extrudedHeightReference),
      rotation: json.rotation ?? undefined,
      stRotation: json.stRotation ?? undefined,
      granularity: json.granularity ?? undefined,
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      numberOfVerticalLines: json.numberOfVerticalLines ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      classificationType: ClassificationTypeParse.fromJSON(json?.classificationType),
      zIndex: json.zIndex ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
