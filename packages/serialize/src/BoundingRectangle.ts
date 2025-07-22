import { BoundingRectangle } from 'cesium';
import { z } from 'zod';

export type BoundingRectangleJSON = z.infer<typeof BoundingRectangleParse.zodJsonchema>;

/**
 * Serialize a `BoundingRectangle` instance to JSON and deserialize from JSON
 */
export class BoundingRectangleParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(BoundingRectangle);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: BoundingRectangle): BoundingRectangleJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      x: instance.x,
      y: instance.y,
      width: instance.width,
      height: instance.height,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: BoundingRectangleJSON, result?: BoundingRectangle): BoundingRectangle | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new BoundingRectangle(
      json.x ?? undefined,
      json.y ?? undefined,
      json.width ?? undefined,
      json.height ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
