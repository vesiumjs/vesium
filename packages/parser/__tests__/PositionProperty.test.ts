import { Cartesian3, ConstantPositionProperty, JulianDate, SampledPositionProperty } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PositionPropertyFromJSON, PositionPropertyToJSON, PositionPropertyZodSchema } from '../src/PositionProperty';

describe('positionProperty', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('positionPropertyZodSchema', () => {
    it('should parse valid JSON with ConstantPositionProperty', () => {
      const json = {
        parser: 'PositionProperty' as const,
        value: {
          parser: 'ConstantPositionProperty' as const,
          value: { x: 1, y: 2, z: 3 },
        },
      };
      const result = PositionPropertyZodSchema().parse(json);
      expect(result.value?.parser).toBe('ConstantPositionProperty');
    });

    it('should parse valid JSON with SampledPositionProperty', () => {
      const json = {
        parser: 'PositionProperty' as const,
        value: {
          parser: 'SampledPositionProperty' as const,
          value: {
            times: [
              { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
            ],
            values: [
              { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
            ],
          },
        },
      };
      const result = PositionPropertyZodSchema().parse(json);
      expect(result.value?.parser).toBe('SampledPositionProperty');
    });

    it('should parse JSON with undefined value', () => {
      const json = {
        parser: 'PositionProperty' as const,
      };
      const result = PositionPropertyZodSchema().parse(json);
      expect(result.value).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PositionPropertyZodSchema().parse(json)).toThrow();
    });
  });

  describe('positionPropertyToJSON', () => {
    it('should convert ConstantPositionProperty instance to JSON', () => {
      const instance = new ConstantPositionProperty(new Cartesian3(1, 2, 3));
      const result = PositionPropertyToJSON(instance);
      expect(result?.parser).toBe('PositionProperty');
      expect(result?.value?.parser).toBe('ConstantPositionProperty');
    });

    it('should convert SampledPositionProperty instance to JSON', () => {
      const instance = new SampledPositionProperty();
      instance.addSample(
        JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
        new Cartesian3(1, 2, 3),
      );
      const result = PositionPropertyToJSON(instance);
      expect(result?.parser).toBe('PositionProperty');
      expect(result?.value?.parser).toBe('SampledPositionProperty');
    });

    it('should handle undefined instance', () => {
      const result = PositionPropertyToJSON(undefined as any);
      expect(result?.parser).toBe('PositionProperty');
      expect(result?.value).toBeUndefined();
    });
  });

  describe('positionPropertyFromJSON', () => {
    it('should convert JSON to ConstantPositionProperty instance', () => {
      const json = {
        parser: 'PositionProperty' as const,
        value: {
          parser: 'ConstantPositionProperty' as const,
          value: { x: 1, y: 2, z: 3 },
        },
      };
      const result = PositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(ConstantPositionProperty);
    });

    it('should convert JSON to SampledPositionProperty instance', () => {
      const json = {
        parser: 'PositionProperty' as const,
        value: {
          parser: 'SampledPositionProperty' as const,
          value: {
            times: [
              { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
            ],
            values: [
              { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
            ],
          },
        },
      };
      const result = PositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(SampledPositionProperty);
    });

    it('should return undefined for undefined input', () => {
      const result = PositionPropertyFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for JSON with no value', () => {
      const json = {
        parser: 'PositionProperty' as const,
      };
      const result = PositionPropertyFromJSON(json);
      expect(result).toBeUndefined();
    });
  });
});
