import { ClippingPlane } from 'cesium';
import { z } from 'zod';

import { Cartesian3Parse } from './Cartesian3';

export type ClippingPlaneJSON = z.infer<typeof ClippingPlaneParse.zodJsonchema>;

/**
 * Serialize a `ClippingPlane` instance to JSON and deserialize from JSON
 */
export class ClippingPlaneParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    normal: Cartesian3Parse.zodJsonchema,
    distance: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(ClippingPlane);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClippingPlane): ClippingPlaneJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      normal: Cartesian3Parse.toJSON(instance?.normal)!,
      distance: instance.distance,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ClippingPlaneJSON, result?: ClippingPlane): ClippingPlane | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new ClippingPlane(
      Cartesian3Parse.fromJSON(json?.normal)!,
      json.distance ?? undefined,
    );
    return result ? ClippingPlane.clone(instance, result) : instance;
  }
}
