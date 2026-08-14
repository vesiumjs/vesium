import { JulianDate, TimeInterval } from 'cesium';
import { describe, expect, it } from 'vitest';
import { TimeIntervalFromJSON, TimeIntervalToJSON, TimeIntervalZodSchema } from '../TimeInterval';

describe('timeInterval', () => {
  describe('timeIntervalZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
          isStartIncluded: true,
          isStopIncluded: true,
          data: { foo: 'bar' },
        },
      };
      TimeIntervalZodSchema().parse(json);
    });

    it('should parse JSON with optional values omitted', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
        },
      };
      const result = TimeIntervalZodSchema().parse(json);
      expect(result.value.isStartIncluded).toBeUndefined();
      expect(result.value.isStopIncluded).toBeUndefined();
      expect(result.value.data).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => TimeIntervalZodSchema().parse(json)).toThrow();
    });
  });

  describe('timeIntervalToJSON', () => {
    const START = '2024-01-01T00:00:00Z';
    const STOP = '2024-12-31T23:59:59Z';

    it('should convert TimeInterval instance to JSON', () => {
      const instance = new TimeInterval({
        start: JulianDate.fromIso8601(START),
        stop: JulianDate.fromIso8601(STOP),
        isStartIncluded: true,
        isStopIncluded: false,
        data: { test: 123 },
      });
      const result = TimeIntervalToJSON(instance);
      expect(result?.parser).toBe('TimeInterval');
      expect(result?.value.start).toEqual({
        parser: 'JulianDate',
        value: START,
      });
      expect(result?.value.stop).toEqual({
        parser: 'JulianDate',
        value: STOP,
      });
      expect(result?.value.isStartIncluded).toBe(true);
      expect(result?.value.isStopIncluded).toBe(false);
      expect(result?.value.data).toEqual({ test: 123 });
    });

    it('should return undefined for undefined input', () => {
      const result = TimeIntervalToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert TimeInterval with default flags', () => {
      const instance = new TimeInterval({
        start: JulianDate.fromIso8601(START),
        stop: JulianDate.fromIso8601(STOP),
      });
      const result = TimeIntervalToJSON(instance);
      expect(result?.value.isStartIncluded).toBe(true);
      expect(result?.value.isStopIncluded).toBe(true);
    });
  });

  describe('timeIntervalFromJSON', () => {
    it('should convert JSON to TimeInterval instance', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
          isStartIncluded: true,
          isStopIncluded: true,
          data: { foo: 'bar' },
        },
      };
      const result = TimeIntervalFromJSON(json);
      expect(result).toBeInstanceOf(TimeInterval);
      expect(result?.isStartIncluded).toBe(true);
      expect(result?.isStopIncluded).toBe(true);
      expect((result as any)?.data).toEqual({ foo: 'bar' });
    });

    it('should return undefined for undefined input', () => {
      const result = TimeIntervalFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use default values for optional fields', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
        },
      };
      const result = TimeIntervalFromJSON(json);
      expect(result).toBeInstanceOf(TimeInterval);
      expect(result?.isStartIncluded).toBe(true);
      expect(result?.isStopIncluded).toBe(true);
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
        },
      };
      const result = new TimeInterval({
        start: JulianDate.fromIso8601('2020-01-01T00:00:00Z'),
        stop: JulianDate.fromIso8601('2020-12-31T23:59:59Z'),
      });
      const output = TimeIntervalFromJSON(json, result);
      expect(output).toBe(result);
      expect(JulianDate.toIso8601(output!.start)).toBe('2024-01-01T00:00:00Z');
      expect(JulianDate.toIso8601(output!.stop)).toBe('2024-12-31T23:59:59Z');
    });
  });
});
