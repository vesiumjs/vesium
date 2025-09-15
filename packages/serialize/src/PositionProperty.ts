import type { ConstantPositionProperty, JulianDate, PositionProperty, SampledPositionProperty } from 'cesium';
import { z } from 'zod';
import { ConstantPositionPropertyFromJSON, ConstantPositionPropertyInstanceSchema, ConstantPositionPropertyToJSON, ConstantPositionPropertyZodSchema } from './ConstantPositionProperty';
import { SampledPositionPropertyFromJSON, SampledPositionPropertyInstanceSchema, SampledPositionPropertyToJSON, SampledPositionPropertyZodSchema } from './SampledPositionProperty';

export interface PositionPropertyJSON {
  type: 'ConstantPositionProperty' | 'SampledPositionProperty';
  content: any;
}

/**
 * `Cesium.PositionProperty` JSON ZodSchema
 */
export function PositionPropertyZodSchema() {
  return z.object({
    parser: z.literal('PositionProperty'),
    value: z.object({
      type: z.enum(['ConstantPositionProperty', 'SampledPositionProperty'] as const),
      content: z.union([ConstantPositionPropertyZodSchema, SampledPositionPropertyZodSchema]),
    }),
  });
}

export const PositionPropertyInstanceSchema = () => z.union([ConstantPositionPropertyInstanceSchema, SampledPositionPropertyInstanceSchema]);

/**
 * Convert `Cesium.PositionProperty` instance to JSON
 */
export function PositionPropertyToJSON(instance?: PositionProperty, time?: JulianDate): PositionPropertyJSON | undefined {
  if (ConstantPositionPropertyInstanceSchema.safeParse(instance)) {
    return {
      type: 'ConstantPositionProperty',
      content: ConstantPositionPropertyToJSON(instance as ConstantPositionProperty, time),
    };
  }

  if (SampledPositionPropertyInstanceSchema.safeParse(instance)) {
    return {
      type: 'SampledPositionProperty',
      content: SampledPositionPropertyToJSON(instance as SampledPositionProperty),
    };
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
  if (json.value.type === 'ConstantPositionProperty') {
    return ConstantPositionPropertyFromJSON(json.value.content, result as ConstantPositionProperty);
  }
  if (json.value.type === 'SampledPositionProperty') {
    return SampledPositionPropertyFromJSON(json.value.content, result as SampledPositionProperty);
  }
}
