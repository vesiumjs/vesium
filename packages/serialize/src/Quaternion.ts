import { Quaternion } from 'cesium';

import { z } from 'zod';

export type QuaternionJSON = z.infer<typeof QuaternionParse.JsonSchema>;

/**
 * Serialize a `Quaternion` instance to JSON and deserialize from JSON
 */
export class QuaternionParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    w: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Quaternion);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Quaternion): QuaternionJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      x: instance.x,
      y: instance.y,
      z: instance.z,
      w: instance.w,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: QuaternionJSON, result?: Quaternion): Quaternion | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Quaternion(
      json.x ?? undefined,
      json.y ?? undefined,
      json.z ?? undefined,
      json.w ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
