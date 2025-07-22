import { ArcType } from 'cesium';

import { z } from 'zod';

export const strings = ['NONE', 'GEODESIC', 'RHUMB'] as const;

export type ArcTypeJSON = z.infer<typeof ArcTypeParse.zodJsonchema>;

/**
 * Serialize a `ArcType` instance to JSON and deserialize from JSON
 */
export class ArcTypeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(ArcType);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ArcType): ArcTypeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(ArcType).find((key: any) => Reflect.get(ArcType, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ArcTypeJSON): ArcType | undefined {
    if (json) {
      return ArcType[json];
    }
  }
}
