import type { TimeIntervalJSON } from '../src/TimeInterval';
import { JulianDate, TimeInterval, TimeIntervalCollection } from 'cesium';
import { describe, expect, it } from 'vitest';
import { TimeIntervalCollectionFromJSON, TimeIntervalCollectionToJSON, TimeIntervalCollectionZodSchema } from '../src/TimeIntervalCollection';

describe('timeIntervalCollection', () => {
  describe('timeIntervalCollectionZodSchema', () => {
    it('should parse valid JSON with intervals array', () => {
      const json = {
        parser: 'TimeIntervalCollection' as const,
        value: {
          intervals: [
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-06-30T23:59:59Z' },
              },
            },
          ],
        },
      };
      const result = TimeIntervalCollectionZodSchema().parse(json);
      expect(result.value.intervals).toHaveLength(1);
    });

    it('should parse JSON with multiple intervals', () => {
      const json = {
        parser: 'TimeIntervalCollection' as const,
        value: {
          intervals: [
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-06-30T23:59:59Z' },
              },
            },
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-07-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
              },
            },
          ],
        },
      };
      const result = TimeIntervalCollectionZodSchema().parse(json);
      expect(result.value.intervals).toHaveLength(2);
    });

    it('should reject JSON with wrong parser type', () => {
      const json: { parser: 'Cartesian3'; value: { intervals: TimeIntervalJSON[] } } = {
        parser: 'Cartesian3' as const,
        value: { intervals: [] },
      };
      expect(() => TimeIntervalCollectionZodSchema().parse(json as any)).toThrow();
    });
  });

  describe('timeIntervalCollectionToJSON', () => {
    it('should convert TimeIntervalCollection instance to JSON', () => {
      const collection = new TimeIntervalCollection([
        new TimeInterval({
          start: JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
          stop: JulianDate.fromIso8601('2024-06-30T23:59:59Z'),
        }),
      ]);
      const result = TimeIntervalCollectionToJSON(collection);
      expect(result?.parser).toBe('TimeIntervalCollection');
      expect(result?.value.intervals).toHaveLength(1);
    });

    it('should return undefined for undefined input', () => {
      const result = TimeIntervalCollectionToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert TimeIntervalCollection with multiple intervals', () => {
      const collection = new TimeIntervalCollection([
        new TimeInterval({
          start: JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
          stop: JulianDate.fromIso8601('2024-06-30T23:59:59Z'),
        }),
        new TimeInterval({
          start: JulianDate.fromIso8601('2024-07-01T00:00:00Z'),
          stop: JulianDate.fromIso8601('2024-12-31T23:59:59Z'),
        }),
      ]);
      const result = TimeIntervalCollectionToJSON(collection);
      expect(result?.value.intervals).toHaveLength(2);
    });
  });

  describe('timeIntervalCollectionFromJSON', () => {
    it('should convert JSON to TimeIntervalCollection instance', () => {
      const json = {
        parser: 'TimeIntervalCollection' as const,
        value: {
          intervals: [
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-06-30T23:59:59Z' },
              },
            },
          ],
        },
      };
      const result = TimeIntervalCollectionFromJSON(json);
      expect(result).toBeInstanceOf(TimeIntervalCollection);
      expect(result.length).toBe(1);
    });

    it('should return undefined for undefined input', () => {
      const result = TimeIntervalCollectionFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with multiple intervals', () => {
      const json = {
        parser: 'TimeIntervalCollection' as const,
        value: {
          intervals: [
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-06-30T23:59:59Z' },
              },
            },
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-07-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
              },
            },
          ],
        },
      };
      const result = TimeIntervalCollectionFromJSON(json);
      expect(result.length).toBe(2);
    });

    it('should reuse result parameter when provided', () => {
      const json = {
        parser: 'TimeIntervalCollection' as const,
        value: {
          intervals: [
            {
              parser: 'TimeInterval' as const,
              value: {
                start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                stop: { parser: 'JulianDate' as const, value: '2024-06-30T23:59:59Z' },
              },
            },
          ],
        },
      };
      const result = new TimeIntervalCollection();
      const output = TimeIntervalCollectionFromJSON(json, result);
      expect(output).toBe(result);
      expect(output!.length).toBe(1);
    });

    it('should reject invalid JSON structure', () => {
      const json: { parser: 'Cartesian3'; value: { intervals: TimeIntervalJSON[] } } = {
        parser: 'Cartesian3' as const,
        value: { intervals: [] },
      };
      expect(() => TimeIntervalCollectionFromJSON(json as any)).toThrow();
    });
  });
});
