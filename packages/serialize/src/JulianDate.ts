import { JulianDate } from 'cesium';

import { z } from 'zod';

export type JulianDateJSON = z.infer<typeof JulianDateParse.zodJsonchema>;

/**
 * Serialize a `JulianDate` instance to JSON and deserialize from JSON
 */
export class JulianDateParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.string();

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(JulianDate);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: JulianDate): JulianDateJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return instance.toString();
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: JulianDateJSON, result?: JulianDate): JulianDate | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = JulianDate.fromIso8601(json);
    return result ? instance.clone(result) : instance;
  }
}
