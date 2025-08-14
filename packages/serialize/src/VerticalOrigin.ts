import { VerticalOrigin } from 'cesium';

import { z } from 'zod';

const strings = ['CENTER', 'BOTTOM', 'BASELINE', 'TOP'] as const;

export type VerticalOriginJSON = z.infer<typeof VerticalOriginParse.JsonSchema>;

/**
 * Serialize a `VerticalOrigin` instance to JSON and deserialize from JSON
 */
export class VerticalOriginParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.enum(VerticalOrigin);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: VerticalOrigin): VerticalOriginJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return Object.keys(VerticalOrigin).find((key: any) => Reflect.get(VerticalOrigin, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: VerticalOriginJSON): VerticalOrigin | undefined {
    if (json) {
      return VerticalOrigin[json];
    }
  }
}
