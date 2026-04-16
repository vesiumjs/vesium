import { JulianDate, TimeInterval } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TimeIntervalFromJSON, TimeIntervalToJSON, TimeIntervalZodSchema } from '../src/TimeInterval';

describe('timeInterval', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
      const result = TimeIntervalZodSchema().parse(json);
      expect(result).toEqual(json);
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

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {},
      };
      const result = TimeIntervalZodSchema().parse(json);
      expect(result.value).toEqual({});
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
    it('should convert TimeInterval instance to JSON', () => {
      const instance = new TimeInterval({
        start: JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
        stop: JulianDate.fromIso8601('2024-12-31T23:59:59Z'),
        isStartIncluded: true,
        isStopIncluded: false,
        data: { test: 123 },
      });
      const result = TimeIntervalToJSON(instance);
      expect(result?.parser).toBe('TimeInterval');
      expect(result?.value.start).toEqual({
        parser: 'JulianDate',
        value: '2024-01-01T00:00:00Z',
      });
      expect(result?.value.stop).toEqual({
        parser: 'JulianDate',
        value: '2024-12-31T23:59:59Z',
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
        start: JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
        stop: JulianDate.fromIso8601('2024-12-31T23:59:59Z'),
      });
      const result = TimeIntervalToJSON(instance);
      // Cesium TimeInterval default values
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
    });

    it('should create new instance when result is not provided', () => {
      const json = {
        parser: 'TimeInterval' as const,
        value: {
          start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
        },
      };
      const output = TimeIntervalFromJSON(json);
      expect(output).toBeInstanceOf(TimeInterval);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => TimeIntervalFromJSON(json as any)).toThrow();
    });
  });
});
