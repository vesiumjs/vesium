import { JulianDate } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.JulianDate` JSON ZodSchema
 */
export function JulianDateZodSchema() {
  return z.object({
    parser: z.literal('JulianDate'),
    value: z.string(),
  });
}

export type JulianDateJSON = z.infer<ReturnType<typeof JulianDateZodSchema>>;

/**
 * Convert `Cesium.JulianDate` instance to JSON
 */
export function JulianDateToJSON(instance?: JulianDate): JulianDateJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(JulianDate).parse(instance);
  return {
    parser: 'JulianDate',
    value: JulianDate.toIso8601(instance),
  };
}

/**
 * Convert JSON to `Cesium.JulianDate` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function JulianDateFromJSON(json?: JulianDateJSON, result?: JulianDate): JulianDate | undefined {
  if (!json) {
    return undefined;
  }
  json = JulianDateZodSchema().parse(json);
  const instance = JulianDate.fromIso8601(json.value);
  return result ? instance.clone(result) : instance;
}
