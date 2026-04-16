import { Color } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from '../src/Color';

describe('color', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('colorZodSchema', () => {
    it('should parse valid JSON with full color values', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 1, green: 0, blue: 0, alpha: 1 },
      };
      const result = ColorZodSchema().parse(json);
      expect(result).toEqual(json);
    });

    it('should parse JSON with partial color values', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 1 },
      };
      const result = ColorZodSchema().parse(json);
      expect(result.value.red).toBe(1);
      expect(result.value.green).toBeUndefined();
      expect(result.value.blue).toBeUndefined();
      expect(result.value.alpha).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'Color' as const,
        value: {},
      };
      const result = ColorZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { red: 1, green: 0, blue: 0, alpha: 1 },
      };
      expect(() => ColorZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-number color values', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 'invalid' as any, green: 0, blue: 0, alpha: 1 },
      };
      expect(() => ColorZodSchema().parse(json)).toThrow();
    });
  });

  describe('colorToJSON', () => {
    it('should convert Color instance to JSON', () => {
      const instance = new Color(1, 0, 0, 0.5);
      const result = ColorToJSON(instance);
      expect(result).toEqual({
        parser: 'Color',
        value: { red: 1, green: 0, blue: 0, alpha: 0.5 },
      });
    });

    it('should return undefined for undefined input', () => {
      const result = ColorToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert Color with default alpha', () => {
      const instance = new Color(0.5, 0.5, 0.5, 1);
      const result = ColorToJSON(instance);
      expect(result?.value.alpha).toBe(1);
    });

    it('should convert Color with zero values', () => {
      const instance = new Color(0, 0, 0, 0);
      const result = ColorToJSON(instance);
      expect(result?.value.red).toBe(0);
      expect(result?.value.green).toBe(0);
      expect(result?.value.blue).toBe(0);
      expect(result?.value.alpha).toBe(0);
    });
  });

  describe('colorFromJSON', () => {
    it('should convert JSON to Color instance', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 1, green: 0, blue: 0, alpha: 0.5 },
      };
      const result = ColorFromJSON(json);
      expect(result).toBeInstanceOf(Color);
      expect(result?.red).toBe(1);
      expect(result?.green).toBe(0);
      expect(result?.blue).toBe(0);
      expect(result?.alpha).toBe(0.5);
    });

    it('should return undefined for undefined input', () => {
      const result = ColorFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use default values for missing color components', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 1 },
      };
      const result = ColorFromJSON(json);
      expect(result?.red).toBe(1);
      // Cesium Color constructor defaults to 1 for all missing components (white)
      expect(result?.green).toBe(1);
      expect(result?.blue).toBe(1);
      expect(result?.alpha).toBe(1);
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 1, green: 0, blue: 0, alpha: 1 },
      };
      const result = new Color(0, 0, 0, 0);
      const output = ColorFromJSON(json, result);
      expect(output).toBe(result);
      expect(output?.red).toBe(1);
      expect(output?.green).toBe(0);
      expect(output?.blue).toBe(0);
      expect(output?.alpha).toBe(1);
    });

    it('should create new instance when result is not provided', () => {
      const json = {
        parser: 'Color' as const,
        value: { red: 0, green: 1, blue: 0, alpha: 1 },
      };
      const output = ColorFromJSON(json);
      expect(output).toBeInstanceOf(Color);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      expect(() => ColorFromJSON(json as any)).toThrow();
    });
  });
});
