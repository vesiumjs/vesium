import { Matrix4 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from '../Matrix4';

describe('matrix4', () => {
  describe('matrix4ZodSchema', () => {
    it('should parse valid JSON with 16-element array', () => {
      const values = Array.from({ length: 16 }).fill(0).map((_, i) => i);
      const json = {
        parser: 'Matrix4' as const,
        value: values,
      };
      Matrix4ZodSchema().parse(json);
    });

    it('should parse JSON with identity matrix values', () => {
      const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      const json = {
        parser: 'Matrix4' as const,
        value: identity,
      };
      const result = Matrix4ZodSchema().parse(json);
      expect(result.value).toEqual(identity);
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: Array.from({ length: 16 }).fill(0),
      };
      expect(() => Matrix4ZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-array value', () => {
      const json = {
        parser: 'Matrix4' as const,
        value: 'not an array' as any,
      };
      expect(() => Matrix4ZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-number array elements', () => {
      const json = {
        parser: 'Matrix4' as const,
        value: [1, 2, 'invalid' as any, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      };
      expect(() => Matrix4ZodSchema().parse(json)).toThrow();
    });
  });

  describe('matrix4ToJSON', () => {
    it('should convert Matrix4 instance to JSON', () => {
      const values = Array.from({ length: 16 }).fill(0).map((_, i) => i);
      const instance = new Matrix4(...values);
      const result = Matrix4ToJSON(instance);
      expect(result).toEqual({
        parser: 'Matrix4',
        value: Array.from(instance),
      });
    });

    it('should return undefined for undefined input', () => {
      const result = Matrix4ToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert identity Matrix4', () => {
      const instance = Matrix4.clone(Matrix4.IDENTITY);
      const result = Matrix4ToJSON(instance);
      expect(result?.value).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    });
  });

  describe('matrix4FromJSON', () => {
    const COL_MAJOR = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];

    it('should convert JSON to Matrix4 instance', () => {
      const values = Array.from({ length: 16 }).fill(0).map((_, i) => i);
      const json = {
        parser: 'Matrix4' as const,
        value: values,
      };
      const result = Matrix4FromJSON(json);
      expect(result).toBeInstanceOf(Matrix4);
      expect(Array.from(result!)).toEqual(COL_MAJOR);
    });

    it('should return undefined for undefined input', () => {
      const result = Matrix4FromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use result parameter for cloning', () => {
      const values = Array.from({ length: 16 }).fill(0).map((_, i) => i);
      const json = {
        parser: 'Matrix4' as const,
        value: values,
      };
      const result = new Matrix4();
      const output = Matrix4FromJSON(json, result);
      expect(output).toBe(result);
      expect(Array.from(output!)).toEqual(COL_MAJOR);
    });
  });
});
