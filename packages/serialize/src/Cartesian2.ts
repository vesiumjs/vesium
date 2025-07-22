import { Cartesian2 } from 'cesium';

import { z } from 'zod';

export type Cartesian2JSON = z.infer<typeof Cartesian2Parse.zodJsonchema>;

/**
 * Serialize a `Cartesian2` instance to JSON and deserialize from JSON
 */
export class Cartesian2Parse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(Cartesian2);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cartesian2): Cartesian2JSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
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
    json = this.zodJsonchema.parse(result);
    const instance = new Cartesian2(
      json.x ?? undefined ?? undefined,
      json.y ?? undefined ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
