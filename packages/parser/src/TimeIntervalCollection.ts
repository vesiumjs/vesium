import { TimeIntervalCollection } from 'cesium';
import { z } from 'zod';
import { TimeIntervalFromJSON, TimeIntervalToJSON, TimeIntervalZodSchema } from './TimeInterval';

/**
 * `Cesium.TimeIntervalCollection` JSON ZodSchema
 */
export function TimeIntervalCollectionZodSchema() {
  return z.object({
    parser: z.literal('TimeIntervalCollection'),
    value: z.object({
      intervals: z.array(TimeIntervalZodSchema()),
    }),
  });
}

export type TimeIntervalCollectionJSON = z.infer<ReturnType<typeof TimeIntervalCollectionZodSchema>>;

/**
 * Convert `Cesium.TimeIntervalCollection` instance to JSON
 */
export function TimeIntervalCollectionToJSON(instance?: TimeIntervalCollection): TimeIntervalCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(TimeIntervalCollection).parse(instance);
  const intervals = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
  return {
    parser: 'TimeIntervalCollection',
    value: {
      intervals: intervals.map(item => TimeIntervalToJSON(item)!),
    },
  };
}

/**
 * Convert JSON to `Cesium.TimeIntervalCollection` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function TimeIntervalCollectionFromJSON(json?: TimeIntervalCollectionJSON, result?: TimeIntervalCollection): TimeIntervalCollection | undefined {
  if (!json) {
    return undefined;
  }
  json = TimeIntervalCollectionZodSchema().parse(result);
  const intervals = json.value.intervals.map(item => TimeIntervalFromJSON(item)!);
  if (result) {
    result.removeAll();
    intervals.forEach(item => result.addInterval(item));
  }
  return new TimeIntervalCollection(intervals);
}
