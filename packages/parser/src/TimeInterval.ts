import { TimeInterval } from 'cesium';
import { z } from 'zod';
import { JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema } from './JulianDate';

/**
 * `Cesium.TimeInterval` JSON ZodSchema
 */
export function TimeIntervalZodSchema() {
  return z.object({
    parser: z.literal('TimeInterval'),
    value: z.object({
      start: JulianDateZodSchema().optional(),
      stop: JulianDateZodSchema().optional(),
      isStartIncluded: z.boolean().optional(),
      isStopIncluded: z.boolean().optional(),
      data: z.any().optional(),
    }),
  });
}

export type TimeIntervalJSON = z.infer<ReturnType<typeof TimeIntervalZodSchema>>;

/**
 * Convert `Cesium.TimeInterval` instance to JSON
 */
export function TimeIntervalToJSON(instance?: TimeInterval): TimeIntervalJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(TimeInterval).parse(instance);
  return {
    parser: 'TimeInterval',
    value: {
      start: JulianDateToJSON(instance.start),
      stop: JulianDateToJSON(instance.stop),
      isStartIncluded: instance.isStartIncluded,
      isStopIncluded: instance.isStopIncluded,
      data: instance.data,
    },
  };
}

/**
 * Convert JSON to `Cesium.TimeInterval` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function TimeIntervalFromJSON(json?: TimeIntervalJSON, result?: TimeInterval): TimeInterval | undefined {
  if (!json) {
    return undefined;
  }
  json = TimeIntervalZodSchema().parse(result);
  const instance = new TimeInterval({
    start: JulianDateFromJSON(json.value.start),
    stop: JulianDateFromJSON(json.value.stop),
    isStartIncluded: json.value.isStartIncluded,
    isStopIncluded: json.value.isStopIncluded,
    data: json.value.data,
  });
  return result ? instance.clone(result) : instance;
}
