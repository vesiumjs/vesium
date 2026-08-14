import { CallbackProperty, Cartesian3, JulianDate, PolygonGraphics, PolygonHierarchy } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { PolygonGraphicsFromJSON, PolygonGraphicsToJSON, PolygonGraphicsZodSchema } from '../PolygonGraphics';

const HIERARCHY: any = {
  parser: 'PolygonHierarchy' as const,
  value: {
    positions: [
      { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
      { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } },
      { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } },
    ],
  },
};
const HEIGHT = 100;

describe('polygonGraphics', () => {
  describe('polygonGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          hierarchy: HIERARCHY,
          height: HEIGHT,
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
        },
      };
      const result = PolygonGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.height).toBe(HEIGHT);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          height: 50,
        },
      };
      const result = PolygonGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.height).toBe(50);
      expect(result.value.hierarchy).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolygonGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          outlineColor: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => PolygonGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('polygonGraphicsToJSON', () => {
    it('should convert PolygonGraphics instance to JSON', () => {
      const instance = new PolygonGraphics({
        show: true,
        hierarchy: new PolygonHierarchy([
          new Cartesian3(0, 0, 0),
          new Cartesian3(1, 0, 0),
          new Cartesian3(1, 1, 0),
        ]),
        height: HEIGHT,
        fill: true,
      });
      const result = PolygonGraphicsToJSON(instance);
      expect(result?.parser).toBe('PolygonGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.height).toBe(HEIGHT);
    });

    it('should return undefined for undefined input', () => {
      const result = PolygonGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new PolygonGraphics({ show: true, height: HEIGHT });
      const result = PolygonGraphicsToJSON(instance, undefined, ['height']);
      expect(result?.value.height).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new PolygonGraphics({ height: HEIGHT });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty(((time: JulianDate) => JulianDate.greaterThan(time, threshold)) as any, false);
      const before = PolygonGraphicsToJSON(instance, timeBefore);
      const after = PolygonGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('polygonGraphicsFromJSON', () => {
    it('should convert JSON to PolygonGraphics instance', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          hierarchy: HIERARCHY,
          height: HEIGHT,
          fill: true,
        },
      };
      const result = PolygonGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolygonGraphics);
      expect(toPropertyValue(result?.show)).toBe(true);
      expect(toPropertyValue(result?.height)).toBe(HEIGHT);
    });

    it('should return undefined for undefined input', () => {
      const result = PolygonGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: { show: true, height: HEIGHT },
      };
      const result = new PolygonGraphics({ show: false });
      const output = PolygonGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.height)).toBe(HEIGHT);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: { show: true, height: HEIGHT },
      };
      const result = PolygonGraphicsFromJSON(json, undefined, ['height']);
      expect(toPropertyValue(result?.height)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
