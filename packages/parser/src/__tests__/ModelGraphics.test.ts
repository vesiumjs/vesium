import { CallbackProperty, JulianDate, ModelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { ModelGraphicsFromJSON, ModelGraphicsToJSON, ModelGraphicsZodSchema } from '../ModelGraphics';

const URI = 'model.glb';
const SCALE = 1.5;

describe('modelGraphics', () => {
  describe('modelGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: URI,
          scale: 1.0,
          minimumPixelSize: 1,
          maximumScale: 100,
          runAnimations: true,
          clampAnimations: true,
          shadows: { parser: 'ShadowMode' as const, value: 'CAST_ONLY' as const },
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          color: { parser: 'Color' as const, value: { red: 1, green: 1, blue: 1, alpha: 1 } },
          colorBlendMode: { parser: 'ColorBlendMode' as const, value: 'HIGHLIGHT' as const },
          colorBlendAmount: 0.5,
        },
      };
      const result = ModelGraphicsZodSchema().parse(json);
      expect(result.value.uri).toBe(URI);
      expect(result.value.scale).toBe(1.0);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: URI,
        },
      };
      const result = ModelGraphicsZodSchema().parse(json);
      expect(result.value.uri).toBe(URI);
      expect(result.value.scale).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => ModelGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          color: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => ModelGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('modelGraphicsToJSON', () => {
    it('should convert ModelGraphics instance to JSON', () => {
      const instance = new ModelGraphics({
        show: true,
        uri: URI,
        scale: SCALE,
      });
      const result = ModelGraphicsToJSON(instance);
      expect(result?.parser).toBe('ModelGraphics');
      expect(result?.value.uri).toBe(URI);
    });

    it('should return undefined for undefined input', () => {
      const result = ModelGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new ModelGraphics({ show: true, uri: URI });
      const result = ModelGraphicsToJSON(instance, undefined, 'uri');
      expect(result?.value.uri).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new ModelGraphics({ uri: URI });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty(((time: JulianDate) => JulianDate.greaterThan(time, threshold)) as any, false);
      const before = ModelGraphicsToJSON(instance, timeBefore);
      const after = ModelGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('modelGraphicsFromJSON', () => {
    it('should convert JSON to ModelGraphics instance', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: URI,
          scale: SCALE,
        },
      };
      const result = ModelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(ModelGraphics);
      expect(toPropertyValue(result?.uri)).toBe(URI);
      expect(toPropertyValue(result?.scale)).toBe(SCALE);
    });

    it('should return undefined for undefined input', () => {
      const result = ModelGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: { show: true, uri: URI },
      };
      const result = new ModelGraphics({ show: false });
      const output = ModelGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.uri)).toBe(URI);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: { show: true, uri: URI },
      };
      const result = ModelGraphicsFromJSON(json, undefined, 'uri');
      expect(toPropertyValue(result?.uri)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
