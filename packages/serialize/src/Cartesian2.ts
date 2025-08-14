import { Cartesian2 } from 'cesium';

import { z } from 'zod';

export type Cartesian2JSON = z.infer<typeof Cartesian2Parse.JsonSchema>;

/**
 * Serialize a `Cartesian2` instance to JSON and deserialize from JSON
 */
export class Cartesian2Parse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Cartesian2);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cartesian2): Cartesian2JSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      x: instance.x,
      y: instance.y,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cartesian2JSON, result?: Cartesian2): Cartesian2 | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Cartesian2(
      json.x ?? undefined,
      json.y ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
