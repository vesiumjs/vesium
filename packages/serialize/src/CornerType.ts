import { CornerType } from 'cesium';

import { z } from 'zod';

const strings = ['ROUNDED', 'MITERED', 'BEVELED'] as const;

export type CornerTypeJSON = z.infer<typeof CornerTypeParse.JsonSchema>;

/**
 * Serialize a `CornerType` instance to JSON and deserialize from JSON
 */
export class CornerTypeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.enum(CornerType);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CornerType): CornerTypeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return Object.keys(CornerType).find((key: any) => Reflect.get(CornerType, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: CornerTypeJSON): CornerType | undefined {
    if (json) {
      return CornerType[json];
    }
  }
}
