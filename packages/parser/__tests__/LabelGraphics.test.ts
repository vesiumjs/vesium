import { LabelGraphics } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LabelGraphicsFromJSON, LabelGraphicsToJSON, LabelGraphicsZodSchema } from '../src/LabelGraphics';

describe('labelGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('labelGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
          text: 'Hello World',
          font: '14pt sans-serif',
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
      expect(result.value.text).toBe('Hello World');
      expect(result.value.font).toBe('14pt sans-serif');
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

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {},
      };
      const result = LabelGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => LabelGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('labelGraphicsToJSON', () => {
    it('should convert LabelGraphics instance to JSON', () => {
      const instance = new LabelGraphics({
        show: true,
        text: 'Hello World',
      });
      const result = LabelGraphicsToJSON(instance);
      expect(result?.parser).toBe('LabelGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.text).toBe('Hello World');
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
  });

  describe('labelGraphicsFromJSON', () => {
    it('should convert JSON to LabelGraphics instance', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
          text: 'Hello World',
          font: '14pt sans-serif',
        },
      };
      const result = LabelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(LabelGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = LabelGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = LabelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(LabelGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'LabelGraphics' as const,
        value: {},
      };
      const result = LabelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(LabelGraphics);
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
