import { CallbackProperty, EllipseGraphics, JulianDate } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { EllipseGraphicsFromJSON, EllipseGraphicsToJSON, EllipseGraphicsZodSchema } from '../src/EllipseGraphics';

const MAJOR = 1000;
const MINOR = 500;

describe('ellipseGraphics', () => {
  describe('ellipseGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: MAJOR,
          semiMinorAxis: MINOR,
          height: 100,
          rotation: 0,
          stRotation: 0,
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
          numberOfVerticalLines: 16,
        },
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.semiMajorAxis).toBe(MAJOR);
      expect(result.value.semiMinorAxis).toBe(MINOR);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: MAJOR,
          semiMinorAxis: MINOR,
        },
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.semiMajorAxis).toBe(MAJOR);
      expect(result.value.semiMinorAxis).toBe(MINOR);
      expect(result.value.height).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {},
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EllipseGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          outlineColor: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => EllipseGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('ellipseGraphicsToJSON', () => {
    it('should convert EllipseGraphics instance to JSON', () => {
      const instance = new EllipseGraphics({
        show: true,
        semiMajorAxis: MAJOR,
        semiMinorAxis: MINOR,
        height: 100,
        fill: true,
        outline: true,
      });
      const result = EllipseGraphicsToJSON(instance);
      expect(result?.parser).toBe('EllipseGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.semiMajorAxis).toBe(MAJOR);
      expect(result?.value.semiMinorAxis).toBe(MINOR);
    });

    it('should return undefined for undefined input', () => {
      const result = EllipseGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      const result = EllipseGraphicsToJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should convert EllipseGraphics with rotation', () => {
      const instance = new EllipseGraphics({
        semiMajorAxis: 2000,
        semiMinorAxis: 1000,
        rotation: Math.PI / 4,
      });
      const result = EllipseGraphicsToJSON(instance);
      expect(result?.parser).toBe('EllipseGraphics');
      expect(result?.value.semiMajorAxis).toBe(2000);
    });

    it('should omit a field when omit is provided', () => {
      const instance = new EllipseGraphics({ show: true, semiMajorAxis: MAJOR });
      const result = EllipseGraphicsToJSON(instance, undefined, 'semiMajorAxis');
      expect(result?.value.semiMajorAxis).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new EllipseGraphics({ semiMajorAxis: MAJOR });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty((time: JulianDate) => JulianDate.greaterThan(time, threshold), false);
      const before = EllipseGraphicsToJSON(instance, timeBefore);
      const after = EllipseGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('ellipseGraphicsFromJSON', () => {
    it('should convert JSON to EllipseGraphics instance', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: MAJOR,
          semiMinorAxis: MINOR,
          height: 100,
          fill: true,
          outline: true,
        },
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
      expect(toPropertyValue(result?.show)).toBe(true);
      expect(toPropertyValue(result?.semiMajorAxis)).toBe(MAJOR);
    });

    it('should return undefined for undefined input', () => {
      const result = EllipseGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      const result = EllipseGraphicsFromJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {},
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: { show: true, semiMajorAxis: MAJOR },
      };
      const result = new EllipseGraphics({ show: false });
      const output = EllipseGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.show)).toBe(true);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: { show: true, semiMajorAxis: MAJOR },
      };
      const result = EllipseGraphicsFromJSON(json, undefined, 'semiMajorAxis');
      expect(toPropertyValue(result?.semiMajorAxis)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EllipseGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
