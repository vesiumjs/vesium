import { CallbackProperty, JulianDate, LabelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { LabelGraphicsFromJSON, LabelGraphicsToJSON, LabelGraphicsZodSchema } from '../src/LabelGraphics';

const TEXT = 'Hello World';
const FONT = '14pt sans-serif';

describe('labelGraphics', () => {
  describe('labelGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
          text: TEXT,
          font: FONT,
          style: { parser: 'LabelStyle' as const, value: 'FILL' as const },
          scale: 1.0,
          showBackground: false,
          backgroundColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          fillColor: { parser: 'Color' as const, value: { red: 1, green: 1, blue: 1, alpha: 1 } },
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
        },
      };
      const result = LabelGraphicsZodSchema().parse(json);
      expect(result.value.text).toBe(TEXT);
      expect(result.value.font).toBe(FONT);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
          text: 'Test',
        },
      };
      const result = LabelGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.text).toBe('Test');
      expect(result.value.font).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => LabelGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          fillColor: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => LabelGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('labelGraphicsToJSON', () => {
    it('should convert LabelGraphics instance to JSON', () => {
      const instance = new LabelGraphics({
        show: true,
        text: TEXT,
      });
      const result = LabelGraphicsToJSON(instance);
      expect(result?.parser).toBe('LabelGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.text).toBe(TEXT);
    });

    it('should return undefined for undefined input', () => {
      const result = LabelGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert LabelGraphics with font and style', () => {
      const instance = new LabelGraphics({
        text: 'Test Label',
        font: '16pt monospace',
      });
      const result = LabelGraphicsToJSON(instance);
      expect(result?.parser).toBe('LabelGraphics');
      expect(result?.value.text).toBe('Test Label');
    });

    it('should omit a field when omit is provided', () => {
      const instance = new LabelGraphics({ show: true, text: TEXT });
      const result = LabelGraphicsToJSON(instance, undefined, 'text');
      expect(result?.value.text).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new LabelGraphics({ text: TEXT });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty((time: JulianDate) => JulianDate.greaterThan(time, threshold), false);
      const before = LabelGraphicsToJSON(instance, timeBefore);
      const after = LabelGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('labelGraphicsFromJSON', () => {
    it('should convert JSON to LabelGraphics instance', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
          text: TEXT,
          font: FONT,
        },
      };
      const result = LabelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(LabelGraphics);
      expect(toPropertyValue(result?.text)).toBe(TEXT);
      expect(toPropertyValue(result?.font)).toBe(FONT);
    });

    it('should return undefined for undefined input', () => {
      const result = LabelGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: { show: true, text: TEXT },
      };
      const result = new LabelGraphics({ show: false });
      const output = LabelGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.text)).toBe(TEXT);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: { show: true, text: TEXT },
      };
      const result = LabelGraphicsFromJSON(json, undefined, 'text');
      expect(toPropertyValue(result?.text)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => LabelGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
