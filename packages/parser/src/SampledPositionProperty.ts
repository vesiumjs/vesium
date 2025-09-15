import type { Cartesian3, JulianDate } from 'cesium';
import { SampledPositionProperty } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema } from './JulianDate';
import { ReferenceFrameFromJSON, ReferenceFrameToJSON, ReferenceFrameZodSchema } from './ReferenceFrame';

/**
 * `Cesium.SampledPositionProperty` JSON ZodSchema
 */
export function SampledPositionPropertyZodSchema() {
  return z.object({
    parser: z.literal('SampledPositionProperty'),
    value: z.object({
      referenceFrame: ReferenceFrameZodSchema().optional(),
      numberOfDerivatives: z.number().optional(),
      times: z.array(JulianDateZodSchema()).optional(),
      values: z.array(Cartesian3ZodSchema()).optional(),
    }),
  });
}

export type SampledPositionPropertyJSON = z.infer<ReturnType<typeof SampledPositionPropertyZodSchema>>;

/**
 * Convert `Cesium.SampledPositionProperty` instance to JSON
 */
export function SampledPositionPropertyToJSON(instance?: SampledPositionProperty): SampledPositionPropertyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(SampledPositionProperty).parse(instance);
  // SampledProperty
  const property = (instance as any)._property;
  const times: JulianDate[] = property._times;
  const values: Cartesian3[] = property._values;

  return {
    parser: 'SampledPositionProperty',
    value: {
      referenceFrame: ReferenceFrameToJSON(instance.referenceFrame),
      numberOfDerivatives: instance.numberOfDerivatives,
      times: times.map(item => JulianDateToJSON(item)!),
      values: values.map(item => Cartesian3ToJSON(item)!),
    },
  };
}

/**
 * Convert JSON to `Cesium.SampledPositionProperty` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function SampledPositionPropertyFromJSON(json?: SampledPositionPropertyJSON, result?: SampledPositionProperty): SampledPositionProperty | undefined {
  if (!json) {
    return undefined;
  }
  json = SampledPositionPropertyZodSchema().parse(result);

  const instance = new SampledPositionProperty(
    ReferenceFrameFromJSON(json.value.referenceFrame),
    json.value.numberOfDerivatives,
  );
  if (!(result instanceof SampledPositionProperty)) {
    result = instance;
  }

  result.referenceFrame = instance.referenceFrame;
  result.numberOfDerivatives = instance.numberOfDerivatives;

  const times = json.value.times?.map(item => JulianDateFromJSON(item)!);
  const values = json.value.values?.map(item => Cartesian3FromJSON(item)!);
  times?.forEach(item => result.removeSample(item));

  if (times?.length && values?.length) {
    result.addSamples(times, values);
  }

  return result;
}
