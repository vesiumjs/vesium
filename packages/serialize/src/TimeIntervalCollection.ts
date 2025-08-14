import { TimeIntervalCollection } from 'cesium';
import { z } from 'zod';
import { TimeIntervalParse } from './TimeInterval';

export type TimeIntervalCollectionJSON = z.infer<typeof TimeIntervalCollectionParse.JsonSchema>;

/**
 * Serialize a `TimeIntervalCollection` instance to JSON and deserialize from JSON
 */
export class TimeIntervalCollectionParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    intervals: z.array(TimeIntervalParse.JsonSchema),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(TimeIntervalCollection);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: TimeIntervalCollection): TimeIntervalCollectionJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    const intervals = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
    return {
      intervals: intervals.map(item => TimeIntervalParse.toJSON(item)!),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: TimeIntervalCollectionJSON, result?: TimeIntervalCollection): TimeIntervalCollection | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const intervals = json.intervals.map(item => TimeIntervalParse.fromJSON(item)!);
    if (result) {
      result.removeAll();
      intervals.forEach(item => result.addInterval(item));
    }
    return new TimeIntervalCollection(intervals);
  }
}
