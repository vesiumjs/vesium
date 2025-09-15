import type { JulianDate } from 'cesium';
import { notNullish } from '@vueuse/core';
import { ConstantPositionProperty } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON } from './Cartesian3';

/**
 * `Cesium.ConstantPositionProperty` JSON ZodSchema
 */
export function ConstantPositionPropertyZodSchema() {
  return z.object({
    parser: z.literal('ConstantPositionProperty'),
    value: z.object({
      x: z.number().optional(),
      y: z.number().optional(),
      z: z.number().optional(),
    }),
  });
}

export type ConstantPositionPropertyJSON = z.infer<ReturnType<typeof ConstantPositionPropertyZodSchema>>;

/**
 * Convert `Cesium.ConstantPositionProperty` instance to JSON
 */
export function ConstantPositionPropertyToJSON(instance?: ConstantPositionProperty, time?: JulianDate): ConstantPositionPropertyJSON | undefined {
  if (!notNullish(instance)) {
    return;
  }
  return Cartesian3ToJSON(instance.getValue(time));
}

/**
 * Convert JSON to `Cesium.ConstantPositionProperty` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ConstantPositionPropertyFromJSON(json?: ConstantPositionPropertyJSON, result?: ConstantPositionProperty): ConstantPositionProperty | undefined {
  if (!json) {
    return undefined;
  }
  json = ConstantPositionPropertyZodSchema().parse(result);
  const instance = new ConstantPositionProperty(Cartesian3FromJSON(json));
  result && instance.setValue(result.getValue());
  return instance;
}
