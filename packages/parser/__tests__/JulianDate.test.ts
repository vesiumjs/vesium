import { JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema } from '../src/JulianDate';

describe('julianDate', () => {
  describe('julianDateZodSchema', () => {
    it('should parse valid JSON with ISO 8601 string', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-01-01T00:00:00Z',
      };
      const result = JulianDateZodSchema().parse(json);
      expect(result).toEqual(json);
    });

    it('should parse JSON with date string including milliseconds', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-06-15T12:30:45.123Z',
      };
      const result = JulianDateZodSchema().parse(json);
      expect(result.value).toBe('2024-06-15T12:30:45.123Z');
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: '2024-01-01T00:00:00Z',
      };
      expect(() => JulianDateZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-string value', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: 12345 as any,
      };
      expect(() => JulianDateZodSchema().parse(json)).toThrow();
    });
  });

  describe('julianDateToJSON', () => {
    it('should convert JulianDate instance to JSON', () => {
      const instance = JulianDate.fromIso8601('2024-01-01T00:00:00Z');
      const result = JulianDateToJSON(instance);
      expect(result?.parser).toBe('JulianDate');
      expect(result?.value).toBe('2024-01-01T00:00:00Z');
    });

    it('should return undefined for undefined input', () => {
      const result = JulianDateToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      const result = JulianDateToJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should convert JulianDate with current time', () => {
      const instance = JulianDate.now();
      const result = JulianDateToJSON(instance);
      expect(result?.parser).toBe('JulianDate');
      expect(typeof result?.value).toBe('string');
      expect(result?.value?.length).toBeGreaterThan(0);
    });
  });

  describe('julianDateFromJSON', () => {
    it('should convert JSON to JulianDate instance', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-01-01T00:00:00Z',
      };
      const result = JulianDateFromJSON(json);
      expect(result).toBeInstanceOf(JulianDate);
      expect(JulianDate.toIso8601(result!)).toBe('2024-01-01T00:00:00Z');
    });

    it('should return undefined for undefined input', () => {
      const result = JulianDateFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      const result = JulianDateFromJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-01-01T00:00:00Z',
      };
      const result = new JulianDate();
      const output = JulianDateFromJSON(json, result);
      expect(output).toBe(result);
      expect(JulianDate.toIso8601(output!)).toBe('2024-01-01T00:00:00Z');
    });

    it('should create new instance when result is not provided', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-06-15T12:30:45Z',
      };
      const output = JulianDateFromJSON(json);
      expect(output).toBeInstanceOf(JulianDate);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: '2024-01-01T00:00:00Z',
      };
      expect(() => JulianDateFromJSON(json as any)).toThrow();
    });

    it('should parse dates with different formats', () => {
      const json = {
        parser: 'JulianDate' as const,
        value: '2024-12-31T23:59:59Z',
      };
      const result = JulianDateFromJSON(json);
      expect(result).toBeInstanceOf(JulianDate);
    });
  });
});
