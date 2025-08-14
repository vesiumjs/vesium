import { SplitDirection } from 'cesium';

import { z } from 'zod';

const strings = ['LEFT', 'NONE', 'RIGHT'] as const;

export type SplitDirectionJSON = z.infer<typeof SplitDirectionParse.JsonSchema>;

/**
 * Serialize a `SplitDirection` instance to JSON and deserialize from JSON
 */
export class SplitDirectionParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.enum(SplitDirection);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: SplitDirection): SplitDirectionJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return Object.keys(SplitDirection).find((key: any) => Reflect.get(SplitDirection, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: SplitDirectionJSON): SplitDirection | undefined {
    if (json) {
      return SplitDirection[json];
    }
  }
}
