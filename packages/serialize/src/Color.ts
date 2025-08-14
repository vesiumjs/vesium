import { Color } from 'cesium';
import { z } from 'zod';

export type ColorJSON = z.infer<typeof ColorParse.JsonSchema>;

/**
 * Serialize a `Color` instance to JSON and deserialize from JSON
 */
export class ColorParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    red: z.number().optional(),
    green: z.number().optional(),
    blue: z.number().optional(),
    alpha: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Color);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Color): ColorJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      red: instance.red,
      green: instance.green,
      blue: instance.blue,
      alpha: instance.alpha,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ColorJSON, result?: Color): Color | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Color(
      json.red ?? undefined,
      json.green ?? undefined,
      json.blue ?? undefined,
      json.alpha ?? undefined,
    );
    return result ? instance.clone(result) : instance;
  }
}
