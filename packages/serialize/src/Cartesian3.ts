import { Cartesian3 } from 'cesium';

import { z } from 'zod';

export type Cartesian3JSON = z.infer<typeof Cartesian3Parse.JsonSchema>;

/**
 * Serialize a `Cartesian3` instance to JSON and deserialize from JSON
 */
export class Cartesian3Parse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    z: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Cartesian3);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cartesian3): Cartesian3JSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      x: instance.x,
      y: instance.y,
      z: instance.z,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cartesian3JSON, result?: Cartesian3): Cartesian3 | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Cartesian3(
      json.x ?? undefined,
      json.y ?? undefined,
      json.z ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
