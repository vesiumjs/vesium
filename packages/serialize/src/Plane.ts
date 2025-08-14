import { Plane } from 'cesium';
import { z } from 'zod';

import { Cartesian3Parse } from './Cartesian3';

export type PlaneJSON = z.infer<typeof PlaneParse.JsonSchema>;

/**
 * Serialize a `Plane` instance to JSON and deserialize from JSON
 */
export class PlaneParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    normal: Cartesian3Parse.JsonSchema,
    distance: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Plane);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Plane): PlaneJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
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
  static fromJSON(json?: PlaneJSON, result?: Plane): Plane | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Plane(
      Cartesian3Parse.fromJSON(json?.normal)!,
      json.distance ?? undefined,
    );

    return result ? Plane.clone(instance, result) : instance;
  }
}
