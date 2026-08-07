import { BoxGraphics, CallbackProperty, Cartesian3, JulianDate } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { BoxGraphicsFromJSON, BoxGraphicsToJSON, BoxGraphicsZodSchema } from '../src/BoxGraphics';

const DIM = { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } };

describe('boxGraphics', () => {
  describe('boxGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: DIM,
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
          shadows: { parser: 'ShadowMode' as const, value: 'CAST_ONLY' as const },
        },
      };
      const result = BoxGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.dimensions?.value.x).toBe(10);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: DIM,
        },
      };
      const result = BoxGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.dimensions?.value.x).toBe(10);
      expect(result.value.fill).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BoxGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested dimensions type', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          dimensions: { parser: 'Cartesian3' as const, value: { x: 'bad' as any } },
        },
      };
      expect(() => BoxGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('boxGraphicsToJSON', () => {
    it('should convert BoxGraphics instance to JSON', () => {
      const instance = new BoxGraphics({
        show: true,
        dimensions: new Cartesian3(10, 20, 30),
        fill: true,
        outline: true,
      });
      const result = BoxGraphicsToJSON(instance);
      expect(result?.parser).toBe('BoxGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.dimensions?.value.x).toBe(10);
      expect(result?.value.dimensions?.value.y).toBe(20);
      expect(result?.value.dimensions?.value.z).toBe(30);
    });

    it('should return undefined for undefined input', () => {
      const result = BoxGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new BoxGraphics({ show: true, fill: true });
      const result = BoxGraphicsToJSON(instance, undefined, 'fill');
      expect(result?.value.fill).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new BoxGraphics({ dimensions: new Cartesian3(10, 20, 30) });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty((time: JulianDate) => JulianDate.greaterThan(time, threshold), false);
      const before = BoxGraphicsToJSON(instance, timeBefore);
      const after = BoxGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('boxGraphicsFromJSON', () => {
    it('should convert JSON to BoxGraphics instance', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: DIM,
          fill: true,
          outline: true,
        },
      };
      const result = BoxGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BoxGraphics);
      expect(toPropertyValue(result?.show)).toBe(true);
      expect(toPropertyValue(result?.fill)).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      const result = BoxGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: { show: true, dimensions: DIM },
      };
      const result = new BoxGraphics({ show: false });
      const output = BoxGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.show)).toBe(true);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: { show: true, fill: true },
      };
      const result = BoxGraphicsFromJSON(json, undefined, 'fill');
      expect(toPropertyValue(result?.fill)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
