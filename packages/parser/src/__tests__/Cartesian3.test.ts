import { Cartesian3 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from '../Cartesian3';

describe('cartesian3', () => {
  describe('cartesian3ZodSchema', () => {
    it('should parse valid JSON with full coordinates', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      Cartesian3ZodSchema().parse(json);
    });

    it('should parse JSON with partial coordinates', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1 },
      };
      const result = Cartesian3ZodSchema().parse(json);
      expect(result.value.x).toBe(1);
      expect(result.value.y).toBeUndefined();
      expect(result.value.z).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian2' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      expect(() => Cartesian3ZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-number coordinates', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 'invalid' as any, y: 2, z: 3 },
      };
      expect(() => Cartesian3ZodSchema().parse(json)).toThrow();
    });
  });

  describe('cartesian3ToJSON', () => {
    const X = 1;
    const Y = 2;
    const Z = 3;

    it('should convert Cartesian3 instance to JSON', () => {
      const instance = new Cartesian3(X, Y, Z);
      const result = Cartesian3ToJSON(instance);
      expect(result).toEqual({
        parser: 'Cartesian3',
        value: { x: X, y: Y, z: Z },
      });
    });

    it('should return undefined for undefined input', () => {
      const result = Cartesian3ToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('cartesian3FromJSON', () => {
    it('should convert JSON to Cartesian3 instance', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      const result = Cartesian3FromJSON(json);
      expect(result).toBeInstanceOf(Cartesian3);
      expect(result?.x).toBe(1);
      expect(result?.y).toBe(2);
      expect(result?.z).toBe(3);
    });

    it('should return undefined for undefined input', () => {
      const result = Cartesian3FromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use default values for missing coordinates', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1 },
      };
      const result = Cartesian3FromJSON(json);
      expect(result?.x).toBe(1);
      expect(result?.y).toBe(0);
      expect(result?.z).toBe(0);
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      const result = new Cartesian3(0, 0, 0);
      const output = Cartesian3FromJSON(json, result);
      expect(output).toBe(result);
      expect(output?.x).toBe(1);
      expect(output?.y).toBe(2);
      expect(output?.z).toBe(3);
    });
  });
});
