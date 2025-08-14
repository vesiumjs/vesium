import { ReferenceFrame } from 'cesium';

import { z } from 'zod';

const strings = ['FIXED', 'INERTIAL'] as const;

export type ReferenceFrameJSON = z.infer<typeof ReferenceFrameParse.JsonSchema>;

/**
 * Serialize a `ReferenceFrame` instance to JSON and deserialize from JSON
 */
export class ReferenceFrameParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.enum(ReferenceFrame);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ReferenceFrame): ReferenceFrameJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return Object.keys(ReferenceFrame).find((key: any) => Reflect.get(ReferenceFrame, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ReferenceFrameJSON): ReferenceFrame | undefined {
    if (json) {
      return ReferenceFrame[json];
    }
  }
}
