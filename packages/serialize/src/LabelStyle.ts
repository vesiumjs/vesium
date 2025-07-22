import { LabelStyle } from 'cesium';

import { z } from 'zod';

export const strings = ['FILL', 'OUTLINE', 'FILL_AND_OUTLINE'] as const;

export type LabelStyleJSON = z.infer<typeof LabelStyleParse.zodJsonchema>;

/**
 * Serialize a `LabelStyle` instance to JSON and deserialize from JSON
 */
export class LabelStyleParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(LabelStyle);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: LabelStyle): LabelStyleJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(LabelStyle).find((key: any) => Reflect.get(LabelStyle, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: LabelStyleJSON): LabelStyle | undefined {
    if (json) {
      return LabelStyle[json];
    }
  }
}
