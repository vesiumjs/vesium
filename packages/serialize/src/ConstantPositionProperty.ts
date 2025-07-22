import type { JulianDate } from 'cesium';
import { notNullish } from '@vueuse/core';
import { ConstantPositionProperty } from 'cesium';
import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';

export type ConstantPositionPropertyJSON = z.infer<typeof ConstantPositionPropertyParse.zodJsonchema>;
/**
 * Serialize a `ConstantPositionProperty` instance to JSON and deserialize from JSON
 */
export class ConstantPositionPropertyParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    z: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(ConstantPositionProperty);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ConstantPositionProperty, time?: JulianDate): ConstantPositionPropertyJSON | undefined {
    if (!notNullish(instance)) {
      return;
    }
    return Cartesian3Parse.toJSON(instance?.getValue(time));
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ConstantPositionPropertyJSON, result?: ConstantPositionProperty): ConstantPositionProperty | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new ConstantPositionProperty(Cartesian3Parse.fromJSON(json));
    result && instance.setValue(result.getValue());
    return instance;
  }
}
