import { Clock } from 'cesium';
import { z } from 'zod';
import { JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema } from './JulianDate';

/**
 * `Cesium.Clock` JSON ZodSchema
 */
export function ClockZodSchema() {
  return z.object({
    parser: z.literal('Clock'),
    value: z.object({
      startTime: JulianDateZodSchema().optional(),
      stopTime: JulianDateZodSchema().optional(),
      currentTime: JulianDateZodSchema().optional(),
      multiplier: z.number().optional(),
      clockStep: z.number().optional(),
      clockRange: z.number().optional(),
      canAnimate: z.boolean().optional(),
      shouldAnimate: z.boolean().optional(),
    }),
  });
}

export type ClockJSON = z.infer<ReturnType<typeof ClockZodSchema>>;

/**
 * Convert `Cesium.Clock` instance to JSON
 */
export function ClockToJSON(instance?: Clock): ClockJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Clock).parse(instance);
  return {
    parser: 'Clock',
    value: {
      startTime: JulianDateToJSON(instance.startTime),
      stopTime: JulianDateToJSON(instance.stopTime),
      currentTime: JulianDateToJSON(instance.currentTime),
      multiplier: instance.multiplier,
      clockStep: instance.clockStep,
      clockRange: instance.clockRange,
      canAnimate: instance.canAnimate,
      shouldAnimate: instance.shouldAnimate,
    },
  };
}

/**
 * Convert JSON to `Cesium.Clock` instance
 */
export function ClockFromJSON(json?: ClockJSON): Clock | undefined {
  if (!json) {
    return undefined;
  }
  json = ClockZodSchema().parse(json);
  return new Clock({
    startTime: JulianDateFromJSON(json.value.startTime),
    stopTime: JulianDateFromJSON(json.value.stopTime),
    currentTime: JulianDateFromJSON(json.value.currentTime),
    multiplier: json.value.multiplier,
    clockStep: json.value.clockStep,
    clockRange: json.value.clockRange,
    canAnimate: json.value.canAnimate,
    shouldAnimate: json.value.shouldAnimate,
  });
}
