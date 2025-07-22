import { ColorBlendMode } from 'cesium';

import { z } from 'zod';

const strings = ['HIGHLIGHT', 'REPLACE', 'MIX'] as const;

export type ColorBlendModeJSON = z.infer<typeof ColorBlendModeParse.zodJsonchema>;

/**
 * Serialize a `ColorBlendMode` instance to JSON and deserialize from JSON
 */
export class ColorBlendModeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(ColorBlendMode);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ColorBlendMode): ColorBlendModeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(ColorBlendMode).find((key: any) => Reflect.get(ColorBlendMode, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ColorBlendModeJSON): ColorBlendMode | undefined {
    if (json) {
      return ColorBlendMode[json];
    }
  }
}
