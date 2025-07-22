import { Matrix4 } from 'cesium';

import { z } from 'zod';

export type Matrix4JSON = z.infer<typeof Matrix4Parse.zodJsonchema>;

/**
 * Serialize a `Matrix4` instance to JSON and deserialize from JSON
 */
export class Matrix4Parse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.array(z.number());

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(Matrix4);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Matrix4): Matrix4JSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Array.from(instance);
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Matrix4JSON, result?: Matrix4): Matrix4 | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new Matrix4(...json);
    return result ? instance.clone(result) : instance;
  }
}
