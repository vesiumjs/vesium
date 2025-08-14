import { DistanceDisplayCondition } from 'cesium';

import { z } from 'zod';

export type DistanceDisplayConditionJSON = z.infer<typeof DistanceDisplayConditionParse.JsonSchema>;

/**
 * Serialize a `DistanceDisplayCondition` instance to JSON and deserialize from JSON
 */
export class DistanceDisplayConditionParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    near: z.number(),
    far: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(DistanceDisplayCondition);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: DistanceDisplayCondition): DistanceDisplayConditionJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      near: instance.near,
      far: instance.far,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: DistanceDisplayConditionJSON, result?: DistanceDisplayCondition): DistanceDisplayCondition | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new DistanceDisplayCondition(
      json.near ?? undefined,
      json.far ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
