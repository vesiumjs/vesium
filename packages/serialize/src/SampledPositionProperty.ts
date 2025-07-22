import type { Cartesian3, JulianDate } from 'cesium';

import { SampledPositionProperty } from 'cesium';
import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';
import { JulianDateParse } from './JulianDate';
import { ReferenceFrameParse } from './ReferenceFrame';

export type SampledPositionPropertyJSON = z.infer<typeof SampledPositionPropertyParse.zodJsonchema>;

/**
 * Serialize a `SampledPositionProperty` instance to JSON and deserialize from JSON
 */
export class SampledPositionPropertyParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    referenceFrame: ReferenceFrameParse.zodJsonchema.optional(),
    numberOfDerivatives: z.number().optional(),
    times: z.array(JulianDateParse.zodJsonchema).optional(),
    values: z.array(Cartesian3Parse.zodJsonchema).optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(SampledPositionProperty);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: SampledPositionProperty): SampledPositionPropertyJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    // SampledProperty
    const property = (instance as any)._property;
    const times: JulianDate[] = property._times;
    const values: Cartesian3[] = property._values;

    return {
      referenceFrame: ReferenceFrameParse.toJSON(instance?.referenceFrame),
      numberOfDerivatives: instance.numberOfDerivatives,
      times: times.map(item => JulianDateParse.toJSON(item)!),
      values: values.map(item => Cartesian3Parse.toJSON(item)!),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: SampledPositionPropertyJSON, result?: SampledPositionProperty): SampledPositionProperty | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);

    const instance = new SampledPositionProperty(
      ReferenceFrameParse.fromJSON(json?.referenceFrame),
      json.numberOfDerivatives ?? undefined,
    );
    if (!(result instanceof SampledPositionProperty)) {
      result = instance;
    }

    result.referenceFrame = instance.referenceFrame;
    result.numberOfDerivatives = instance.numberOfDerivatives;

    const times = json.times?.map(item => JulianDateParse.fromJSON(item)!);
    const values = json.values?.map(item => Cartesian3Parse.fromJSON(item)!);
    times?.forEach(item => result.removeSample(item));

    if (times?.length && values?.length) {
      result.addSamples(times, values);
    }

    return result;
  }
}
