import { Cartesian2 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from '../src/Cartesian2';

describe('cartesian2', () => {
  describe('cartesian2ZodSchema', () => {
    it('should parse valid JSON with full coordinates', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1, y: 2 },
      };
      const result = Cartesian2ZodSchema().parse(json);
      expect(result).toEqual(json);
    });

    it('should parse JSON with partial coordinates', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1 },
      };
      const result = Cartesian2ZodSchema().parse(json);
      expect(result.value.x).toBe(1);
      expect(result.value.y).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2 },
      };
      expect(() => Cartesian2ZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-number coordinates', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 'invalid' as any, y: 2 },
      };
      expect(() => Cartesian2ZodSchema().parse(json)).toThrow();
    });
  });

  describe('cartesian2ToJSON', () => {
    const X = 1;
    const Y = 2;

    it('should convert Cartesian2 instance to JSON', () => {
      const instance = new Cartesian2(X, Y);
      const result = Cartesian2ToJSON(instance);
      expect(result).toEqual({
        parser: 'Cartesian2',
        value: { x: X, y: Y },
      });
    });

    it('should return undefined for undefined input', () => {
      const result = Cartesian2ToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('cartesian2FromJSON', () => {
    it('should convert JSON to Cartesian2 instance', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1, y: 2 },
      };
      const result = Cartesian2FromJSON(json);
      expect(result).toBeInstanceOf(Cartesian2);
      expect(result?.x).toBe(1);
      expect(result?.y).toBe(2);
    });

    it('should return undefined for undefined input', () => {
      const result = Cartesian2FromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use default values for missing coordinates', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1 },
      };
      const result = Cartesian2FromJSON(json);
      expect(result?.x).toBe(1);
      expect(result?.y).toBe(0);
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1, y: 2 },
      };
      const result = new Cartesian2(0, 0);
      const output = Cartesian2FromJSON(json, result);
      expect(output).toBe(result);
      expect(output?.x).toBe(1);
      expect(output?.y).toBe(2);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      expect(() => Cartesian2FromJSON(json as any)).toThrow();
    });
  });
});
