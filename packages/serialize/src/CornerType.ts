import { CornerType } from 'cesium';

import { z } from 'zod';

export const strings = ['ROUNDED', 'MITERED', 'BEVELED'] as const;

export type CornerTypeJSON = z.infer<typeof CornerTypeParse.zodJsonchema>;

/**
 * Serialize a `CornerType` instance to JSON and deserialize from JSON
 */
export class CornerTypeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(CornerType);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CornerType): CornerTypeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
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
