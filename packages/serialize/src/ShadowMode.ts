import { ShadowMode } from 'cesium';

import { z } from 'zod';

export const strings = ['DISABLED', 'ENABLED', 'CAST_ONLY', 'RECEIVE_ONLY'] as const;

export type ShadowModeJSON = z.infer<typeof ShadowModeParse.zodJsonchema>;

/**
 * Serialize a `ShadowMode` instance to JSON and deserialize from JSON
 */
export class ShadowModeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(ShadowMode);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ShadowMode): ShadowModeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(ShadowMode).find((key: any) => Reflect.get(ShadowMode, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ShadowModeJSON): ShadowMode | undefined {
    if (json) {
      return ShadowMode[json];
    }
  }
}
