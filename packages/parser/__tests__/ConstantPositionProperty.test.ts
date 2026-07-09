import { Cartesian3, ConstantPositionProperty } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ConstantPositionPropertyFromJSON, ConstantPositionPropertyToJSON, ConstantPositionPropertyZodSchema } from '../src/ConstantPositionProperty';

describe('constantPositionProperty', () => {
  describe('constantPositionPropertyZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      const result = ConstantPositionPropertyZodSchema().parse(json);
      expect(result.value?.x).toBe(1);
      expect(result.value?.y).toBe(2);
      expect(result.value?.z).toBe(3);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: { x: 1 },
      };
      const result = ConstantPositionPropertyZodSchema().parse(json);
      expect(result.value?.x).toBe(1);
      expect(result.value?.y).toBeUndefined();
      expect(result.value?.z).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: {},
      };
      const result = ConstantPositionPropertyZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should parse JSON with undefined value', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
      };
      const result = ConstantPositionPropertyZodSchema().parse(json);
      expect(result.value).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      expect(() => ConstantPositionPropertyZodSchema().parse(json)).toThrow();
    });
  });

  describe('constantPositionPropertyToJSON', () => {
    it('should convert ConstantPositionProperty instance to JSON', () => {
      const instance = new ConstantPositionProperty(new Cartesian3(1, 2, 3));
      const result = ConstantPositionPropertyToJSON(instance);
      expect(result?.parser).toBe('ConstantPositionProperty');
      expect(result?.value?.x).toBe(1);
      expect(result?.value?.y).toBe(2);
      expect(result?.value?.z).toBe(3);
    });

    it('should return undefined for nullish input', () => {
      const result = ConstantPositionPropertyToJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const result = ConstantPositionPropertyToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('constantPositionPropertyFromJSON', () => {
    it('should convert JSON to ConstantPositionProperty instance', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      const result = ConstantPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(ConstantPositionProperty);
    });

    it('should return undefined for undefined input', () => {
      const result = ConstantPositionPropertyFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      const result = ConstantPositionPropertyFromJSON(null as any);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: { x: 1 },
      };
      const result = ConstantPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(ConstantPositionProperty);
    });

    it('should convert JSON with empty value', () => {
      const json = {
        parser: 'ConstantPositionProperty' as const,
        value: {},
      };
      const result = ConstantPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(ConstantPositionProperty);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: { x: 1, y: 2, z: 3 },
      };
      expect(() => ConstantPositionPropertyFromJSON(json as any)).toThrow();
    });
  });
});
