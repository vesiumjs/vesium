import type { JulianDate, PositionProperty } from 'cesium';
import { ConstantPositionProperty, SampledPositionProperty } from 'cesium';
import { z } from 'zod';
import { ConstantPositionPropertyFromJSON, ConstantPositionPropertyToJSON, ConstantPositionPropertyZodSchema } from './ConstantPositionProperty';
import { SampledPositionPropertyFromJSON, SampledPositionPropertyToJSON, SampledPositionPropertyZodSchema } from './SampledPositionProperty';

/**
 * `Cesium.PositionProperty` JSON ZodSchema
 */
export function PositionPropertyZodSchema() {
  return z.object({
    parser: z.literal('PositionProperty'),
    value: z.union([ConstantPositionPropertyZodSchema(), SampledPositionPropertyZodSchema()]).optional(),
  });
}

export type PositionPropertyJSON = z.infer<ReturnType<typeof PositionPropertyZodSchema>>;

/**
 * Convert `Cesium.PositionProperty` instance to JSON
 */
export function PositionPropertyToJSON(instance?: PositionProperty, time?: JulianDate): PositionPropertyJSON | undefined {
  let value: any;
  if (z.instanceof(ConstantPositionProperty).parse(instance)) {
    value = ConstantPositionPropertyToJSON(instance as ConstantPositionProperty, time);
  }
  if (z.instanceof(SampledPositionProperty).parse(instance)) {
    value = SampledPositionPropertyToJSON(instance as SampledPositionProperty);
  };
  return {
    parser: 'PositionProperty',
    value,
  };
}

/**
 * Convert JSON to `Cesium.PositionProperty` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PositionPropertyFromJSON(json?: PositionPropertyJSON, result?: PositionProperty): PositionProperty | undefined {
  if (!json) {
    return;
  }
  json = PositionPropertyZodSchema().parse(json);

  if (json.value.parser === 'ConstantPositionProperty') {
    return ConstantPositionPropertyFromJSON(json.value, result as ConstantPositionProperty);
  }
  if (json.value.parser === 'SampledPositionProperty') {
    return SampledPositionPropertyFromJSON(json.value, result as SampledPositionProperty);
  }
}
