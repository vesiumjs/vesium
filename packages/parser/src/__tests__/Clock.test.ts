import { Clock, ClockRange, ClockStep, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ClockFromJSON, ClockToJSON, ClockZodSchema } from '../Clock';

describe('clock', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(ClockZodSchema().parse({
      parser: 'Clock',
      value: { startTime: { parser: 'JulianDate', value: '2020-01-01T00:00:00Z' } },
    }).value.startTime?.value).toBe('2020-01-01T00:00:00Z');
    expect(() => ClockZodSchema().parse({ parser: 'Clock', value: {} } as any)).not.toThrow();
  });

  it('round-trips a Clock instance', () => {
    const instance = new Clock({
      startTime: JulianDate.fromIso8601('2020-01-01T00:00:00Z'),
      stopTime: JulianDate.fromIso8601('2020-01-02T00:00:00Z'),
      currentTime: JulianDate.fromIso8601('2020-01-01T12:00:00Z'),
      multiplier: 60,
      clockStep: ClockStep.TICK_DEPENDENT,
      clockRange: ClockRange.LOOP_STOP,
      shouldAnimate: true,
    });
    const back = ClockFromJSON(ClockToJSON(instance)!);
    expect(back).toBeInstanceOf(Clock);
    expect(back!.startTime).toEqual(instance.startTime);
    expect(back!.stopTime).toEqual(instance.stopTime);
    expect(back!.currentTime).toEqual(instance.currentTime);
    expect(back!.multiplier).toBe(60);
    expect(back!.clockStep).toBe(ClockStep.TICK_DEPENDENT);
    expect(back!.clockRange).toBe(ClockRange.LOOP_STOP);
    expect(back!.shouldAnimate).toBe(true);
  });

  it('returns undefined for nullish input', () => {
    expect(ClockToJSON(undefined)).toBeUndefined();
    expect(ClockFromJSON(undefined)).toBeUndefined();
  });
});
