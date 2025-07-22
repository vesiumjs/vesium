import type { JulianDate } from 'cesium';
import { PathGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';

import { MaterialPropertyParse } from './MaterialProperty';

export type PathGraphicsJSON = z.infer<typeof PathGraphicsParse.zodJsonchema>;

/**
 * Serialize a `PathGraphics` instance to JSON and deserialize from JSON
 */
export class PathGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    leadTime: z.number().optional(),
    trailTime: z.number().optional(),
    width: z.number().optional(),
    resolution: z.number().optional(),
    material: MaterialPropertyParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(PathGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PathGraphics, time?: JulianDate): PathGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      leadTime: toPropertyValue(instance.leadTime, time),
      trailTime: toPropertyValue(instance.trailTime, time),
      width: toPropertyValue(instance.width, time),
      resolution: toPropertyValue(instance.resolution, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PathGraphicsJSON, result?: PathGraphics): PathGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new PathGraphics({
      show: json.show ?? undefined,
      leadTime: json.leadTime ?? undefined,
      trailTime: json.trailTime ?? undefined,
      width: json.width ?? undefined,
      resolution: json.resolution ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
