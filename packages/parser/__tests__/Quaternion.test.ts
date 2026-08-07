import { Quaternion } from 'cesium';
import { describe, expect, it } from 'vitest';
import { QuaternionFromJSON, QuaternionToJSON, QuaternionZodSchema } from '../src/Quaternion';

describe('quaternion', () => {
  describe('quaternionZodSchema', () => {
    it('should parse valid JSON with full quaternion values', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 0, y: 0, z: 0, w: 1 },
      };
      QuaternionZodSchema().parse(json);
    });

    it('should reject JSON with missing required values', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 0 },
      };
      expect(() => QuaternionZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 0, y: 0, z: 0, w: 1 },
      };
      expect(() => QuaternionZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with non-number values', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 'invalid' as any, y: 0, z: 0, w: 1 },
      };
      expect(() => QuaternionZodSchema().parse(json)).toThrow();
    });
  });

  describe('quaternionToJSON', () => {
    it('should convert Quaternion instance to JSON', () => {
      const instance = new Quaternion(0, 0, 0, 1);
      const result = QuaternionToJSON(instance);
      expect(result).toEqual({
        parser: 'Quaternion',
        value: { x: 0, y: 0, z: 0, w: 1 },
      });
    });

    it('should return undefined for undefined input', () => {
      const result = QuaternionToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert Quaternion with negative values', () => {
      const instance = new Quaternion(-0.5, 0.5, -0.5, 0.5);
      const result = QuaternionToJSON(instance);
      expect(result?.value.x).toBeCloseTo(-0.5);
      expect(result?.value.y).toBeCloseTo(0.5);
      expect(result?.value.z).toBeCloseTo(-0.5);
      expect(result?.value.w).toBeCloseTo(0.5);
    });
  });

  describe('quaternionFromJSON', () => {
    it('should convert JSON to Quaternion instance', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 0, y: 0, z: 0, w: 1 },
      };
      const result = QuaternionFromJSON(json);
      expect(result).toBeInstanceOf(Quaternion);
      expect(result?.x).toBe(0);
      expect(result?.y).toBe(0);
      expect(result?.z).toBe(0);
      expect(result?.w).toBe(1);
    });

    it('should return undefined for undefined input', () => {
      const result = QuaternionFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should use result parameter for cloning', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 0, y: 0, z: 0, w: 1 },
      };
      const result = new Quaternion(1, 0, 0, 0);
      const output = QuaternionFromJSON(json, result);
      expect(output).toBe(result);
      expect(output?.x).toBe(0);
      expect(output?.y).toBe(0);
      expect(output?.z).toBe(0);
      expect(output?.w).toBe(1);
    });

    it('should reject JSON with missing required values', () => {
      const json = {
        parser: 'Quaternion' as const,
        value: { x: 0, y: 0 },
      };
      expect(() => QuaternionFromJSON(json as any)).toThrow();
    });
  });
});
