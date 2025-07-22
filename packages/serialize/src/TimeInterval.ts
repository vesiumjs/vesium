import { TimeInterval } from 'cesium';
import { z } from 'zod';
import { JulianDateParse } from './JulianDate';

export type TimeIntervalJSON = z.infer<typeof TimeIntervalParse.zodJsonchema>;

/**
 * Serialize a `TimeInterval` instance to JSON and deserialize from JSON
 */
export class TimeIntervalParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    start: JulianDateParse.zodJsonchema.optional(),
    stop: JulianDateParse.zodJsonchema.optional(),
    isStartIncluded: z.boolean().optional(),
    isStopIncluded: z.boolean().optional(),
    data: z.any().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(TimeInterval);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: TimeInterval): TimeIntervalJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      start: JulianDateParse.toJSON(instance?.start),
      stop: JulianDateParse.toJSON(instance?.stop),
      isStartIncluded: instance.isStartIncluded,
      isStopIncluded: instance.isStopIncluded,
      data: instance.data,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: TimeIntervalJSON, result?: TimeInterval): TimeInterval | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new TimeInterval({
      start: JulianDateParse.fromJSON(json?.start),
      stop: JulianDateParse.fromJSON(json?.stop),
      isStartIncluded: json.isStartIncluded ?? undefined,
      isStopIncluded: json.isStopIncluded ?? undefined,
      data: json.data ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
