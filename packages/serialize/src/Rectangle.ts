import { Rectangle } from 'cesium';

import { z } from 'zod';

export type RectangleJSON = z.infer<typeof RectangleParse.JsonSchema>;

/**
 * Serialize a `Rectangle` instance to JSON and deserialize from JSON
 */
export class RectangleParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    west: z.number(),
    south: z.number(),
    east: z.number(),
    north: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Rectangle);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Rectangle): RectangleJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      west: instance.west,
      south: instance.south,
      east: instance.east,
      north: instance.north,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: RectangleJSON, result?: Rectangle): Rectangle | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Rectangle(
      json.west ?? undefined,
      json.south ?? undefined,
      json.east ?? undefined,
      json.north ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
