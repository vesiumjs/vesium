import { NearFarScalar } from 'cesium';

import { z } from 'zod';

export type NearFarScalarJSON = z.infer<typeof NearFarScalarParse.JsonSchema>;

/**
 * Serialize a `NearFarScalar` instance to JSON and deserialize from JSON
 */
export class NearFarScalarParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    near: z.number(),
    nearValue: z.number(),
    far: z.number(),
    farValue: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(NearFarScalar);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: NearFarScalar): NearFarScalarJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      near: instance.near,
      nearValue: instance.nearValue,
      far: instance.far,
      farValue: instance.farValue,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: NearFarScalarJSON, result?: NearFarScalar): NearFarScalar | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new NearFarScalar(
      json.near ?? undefined,
      json.nearValue ?? undefined,
      json.far ?? undefined,
      json.farValue ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
