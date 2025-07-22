import { HeightReference } from 'cesium';

import { z } from 'zod';

export const strings = ['NONE', 'CLAMP_TO_GROUND', 'RELATIVE_TO_GROUND', 'CLAMP_TO_TERRAIN', 'RELATIVE_TO_TERRAIN', 'CLAMP_TO_3D_TILE', 'RELATIVE_TO_3D_TILE'] as const;

export type HeightReferenceJSON = z.infer<typeof HeightReferenceParse.zodJsonchema>;

/**
 * Serialize a `HeightReference` instance to JSON and deserialize from JSON
 */
export class HeightReferenceParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(HeightReference);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: HeightReference): HeightReferenceJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(HeightReference).find((key: any) => Reflect.get(HeightReference, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: HeightReferenceJSON): HeightReference | undefined {
    if (json) {
      return HeightReference[json];
    }
  }
}
