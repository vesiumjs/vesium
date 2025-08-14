import type { ConstantPositionProperty, JulianDate, PositionProperty, SampledPositionProperty } from 'cesium';

import { z } from 'zod';
import { ConstantPositionPropertyParse } from './ConstantPositionProperty';
import { SampledPositionPropertyParse } from './SampledPositionProperty';

export interface PositionPropertyJSON {
  type: 'ConstantPositionProperty' | 'SampledPositionProperty';
  content: any;
}

/**
 * Serialize a `PositionProperty` instance to JSON and deserialize from JSON
 */
export class PositionPropertyParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    type: z.enum(['ConstantPositionProperty', 'SampledPositionProperty'] as const),
    content: z.union([ConstantPositionPropertyParse.JsonSchema, SampledPositionPropertyParse.JsonSchema]),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.union([ConstantPositionPropertyParse.InstanceSchema, SampledPositionPropertyParse.InstanceSchema]);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PositionProperty, time?: JulianDate): PositionPropertyJSON | undefined {
    if (ConstantPositionPropertyParse.InstanceSchema.safeParse(instance)) {
      return {
        type: 'ConstantPositionProperty',
        content: ConstantPositionPropertyParse.toJSON(instance as ConstantPositionProperty, time),
      };
    }

    if (SampledPositionPropertyParse.InstanceSchema.safeParse(instance)) {
      return {
        type: 'SampledPositionProperty',
        content: SampledPositionPropertyParse.toJSON(instance as SampledPositionProperty),
      };
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PositionPropertyJSON, result?: PositionProperty): PositionProperty | undefined {
    if (!json) {
      return;
    }
    if (json.type === 'ConstantPositionProperty') {
      return ConstantPositionPropertyParse.fromJSON(json?.content, result as ConstantPositionProperty);
    }
    if (json.type === 'SampledPositionProperty') {
      return SampledPositionPropertyParse.fromJSON(json?.content, result as SampledPositionProperty);
    }
  }
}
