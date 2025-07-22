import { ClassificationType } from 'cesium';

import { z } from 'zod';

const strings = ['TERRAIN', 'CESIUM_3D_TILE', 'BOTH'] as const;

export type ClassificationTypeJSON = z.infer<typeof ClassificationTypeParse.zodJsonchema>;

/**
 * Serialize a `ClassificationType` instance to JSON and deserialize from JSON
 */
export class ClassificationTypeParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.enum(strings);

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.enum(ClassificationType);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClassificationType): ClassificationTypeJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return Object.keys(ClassificationType).find((key: any) => Reflect.get(ClassificationType, key) === instance) as any;
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ClassificationTypeJSON): ClassificationType | undefined {
    if (json) {
      return ClassificationType[json];
    }
  }
}
