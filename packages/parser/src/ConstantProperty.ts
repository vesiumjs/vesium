import type { JulianDate, Property } from 'cesium';
import { notNullish } from '@vueuse/core';
import { ConstantProperty } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.ConstantProperty` JSON ZodSchema
 */
export function ConstantPropertyZodSchema<TValueSchema extends z.ZodType>(valueSchema: TValueSchema) {
  return z.object({
    parser: z.literal('ConstantProperty'),
    value: valueSchema,
  });
}

export interface ConstantPropertyJSON<TValueJSON> {
  parser: 'ConstantProperty';
  value?: TValueJSON;
}

/**
 * Convert `Cesium.ConstantProperty` instance to JSON
 */
export function ConstantPropertyToJSON<TValueJSON>(
  valueToJSON: (value: any) => TValueJSON | undefined,
  instance?: ConstantProperty | Property,
  time?: JulianDate,
): ConstantPropertyJSON<TValueJSON> | undefined {
  if (!notNullish(instance)) {
    return;
  }
  return {
    parser: 'ConstantProperty',
    value: valueToJSON(instance.getValue(time)),
  };
}

/**
 * Convert JSON to `Cesium.ConstantProperty` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ConstantPropertyFromJSON<TValueJSON, T>(
  valueFromJSON: (value?: TValueJSON) => T | undefined,
  json?: ConstantPropertyJSON<TValueJSON>,
  result?: ConstantProperty | Property,
): ConstantProperty | undefined {
  const value = valueFromJSON(json.value);
  const instance = (result instanceof ConstantProperty) ? result : new ConstantProperty();
  instance.setValue(value);
  return instance;
}
