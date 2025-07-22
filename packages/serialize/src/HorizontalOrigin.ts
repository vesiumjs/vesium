import { HorizontalOrigin } from 'cesium';

import { z } from 'zod';

export const strings = ['CENTER', 'LEFT', 'RIGHT'] as const;

export type HorizontalOriginJSON = z.infer<typeof HorizontalOriginParse.zodJsonchema>;

/**
 * Serialize a `HorizontalOrigin` instance to JSON and deserialize from JSON
 */
export class HorizontalOriginParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(HorizontalOrigin);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: HorizontalOrigin): HorizontalOriginJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(HorizontalOrigin).find((key: any) => Reflect.get(HorizontalOrigin, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: HorizontalOriginJSON): HorizontalOrigin | undefined {
    if (json) {
      return HorizontalOrigin[json];
    }
  }
}
