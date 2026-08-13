import { CallbackProperty, Color, JulianDate, PointGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { PointGraphicsFromJSON, PointGraphicsToJSON, PointGraphicsZodSchema } from '../PointGraphics';

const RED = { parser: 'Color' as const, value: { red: 1, green: 0, blue: 0, alpha: 1 } };

describe('pointGraphics', () => {
  describe('pointGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 10,
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          color: RED,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 2,
        },
      };
      const result = PointGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.pixelSize).toBe(10);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 5,
        },
      };
      const result = PointGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.pixelSize).toBe(5);
      expect(result.value.color).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PointGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          color: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => PointGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('pointGraphicsToJSON', () => {
    it('should convert PointGraphics instance to JSON', () => {
      const instance = new PointGraphics({
        show: true,
        pixelSize: 10,
        color: new Color(1, 0, 0, 1),
      });
      const result = PointGraphicsToJSON(instance);
      expect(result?.parser).toBe('PointGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.pixelSize).toBe(10);
    });

    it('should return undefined for undefined input', () => {
      const result = PointGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new PointGraphics({ show: true, pixelSize: 10 });
      const result = PointGraphicsToJSON(instance, undefined, 'pixelSize');
      expect(result?.value.pixelSize).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new PointGraphics({ pixelSize: 10 });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty(((time: JulianDate) => JulianDate.greaterThan(time, threshold)) as any, false);
      const before = PointGraphicsToJSON(instance, timeBefore);
      const after = PointGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('pointGraphicsFromJSON', () => {
    it('should convert JSON to PointGraphics instance', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 10,
          color: RED,
        },
      };
      const result = PointGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PointGraphics);
      expect(toPropertyValue(result?.show)).toBe(true);
      expect(toPropertyValue(result?.pixelSize)).toBe(10);
    });

    it('should return undefined for undefined input', () => {
      const result = PointGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: { show: true, pixelSize: 15 },
      };
      const result = new PointGraphics({ show: false });
      const output = PointGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.pixelSize)).toBe(15);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: { show: true, pixelSize: 10 },
      };
      const result = PointGraphicsFromJSON(json, undefined, 'pixelSize');
      expect(toPropertyValue(result?.pixelSize)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
