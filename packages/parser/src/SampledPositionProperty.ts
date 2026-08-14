import type { SampledPositionProperty as CesiumSampledPositionProperty, JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import { SampledPositionProperty } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ZodSchema } from './Cartesian3';
import { JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema } from './JulianDate';
import { readPrivate } from './private';
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
export function SampledPositionPropertyToJSON(instance?: CesiumSampledPositionProperty): SampledPositionPropertyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(SampledPositionProperty).parse(instance);
  // SampledProperty internals hold the packed times and values
  const property = readPrivate<{ _times: JulianDate[]; _values: number[] }>(instance, '_property');
  const times: JulianDate[] = property!._times;
  // _values is a flat array; each sample occupies 3 * (numberOfDerivatives + 1) numbers
  const rawValues: number[] = property!._values;
  const stride = 3 * (instance.numberOfDerivatives + 1);

  const cartesianValues: Cartesian3JSON[] = [];
  for (let i = 0; i < rawValues.length; i += stride) {
    cartesianValues.push({
      parser: 'Cartesian3',
      value: {
        x: rawValues[i],
        y: rawValues[i + 1],
        z: rawValues[i + 2],
      },
    });
  }

  return {
    parser: 'SampledPositionProperty',
    value: {
      referenceFrame: ReferenceFrameToJSON(instance.referenceFrame),
      numberOfDerivatives: instance.numberOfDerivatives,
      times: times.map(item => JulianDateToJSON(item)!),
      values: cartesianValues,
    },
  };
}

/**
 * Convert JSON to `Cesium.SampledPositionProperty` instance
 * @param json - A JSON containing instance data
 * @param _result - Unused parameter kept for API compatibility. SampledPositionProperty.referenceFrame is read-only after construction, so the result instance cannot be properly reused.
 */
export function SampledPositionPropertyFromJSON(json?: SampledPositionPropertyJSON, _result?: CesiumSampledPositionProperty): CesiumSampledPositionProperty | undefined {
  if (!json) {
    return undefined;
  }
  json = SampledPositionPropertyZodSchema().parse(json);

  const referenceFrame = ReferenceFrameFromJSON(json.value.referenceFrame);
  const numberOfDerivatives = json.value.numberOfDerivatives;

  // referenceFrame is read-only, so we must create a new instance with the correct values
  const instance = new SampledPositionProperty(referenceFrame, numberOfDerivatives);

  const times = json.value.times?.map(item => JulianDateFromJSON(item)!);
  const values = json.value.values?.map(item => Cartesian3FromJSON(item)!);

  if (times?.length && values?.length) {
    instance.addSamples(times, values);
  }

  // SampledPositionProperty.referenceFrame is read-only after construction,
  // so we cannot properly reuse a result instance with a different referenceFrame.
  // Always return the newly created instance.
  return instance;
}
