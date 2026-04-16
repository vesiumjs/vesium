import { Cartesian3, JulianDate, ReferenceFrame, SampledPositionProperty } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SampledPositionPropertyFromJSON, SampledPositionPropertyToJSON, SampledPositionPropertyZodSchema } from '../src/SampledPositionProperty';

describe('sampledPositionProperty', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sampledPositionPropertyZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {
          referenceFrame: { parser: 'ReferenceFrame' as const, value: 'FIXED' as const },
          numberOfDerivatives: 0,
          times: [
            { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          ],
          values: [
            { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
          ],
        },
      };
      const result = SampledPositionPropertyZodSchema().parse(json);
      expect(result.value.referenceFrame?.value).toBe('FIXED');
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {
          times: [
            { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          ],
          values: [
            { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
          ],
        },
      };
      const result = SampledPositionPropertyZodSchema().parse(json);
      expect(result.value.times).toHaveLength(1);
      expect(result.value.values).toHaveLength(1);
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {},
      };
      const result = SampledPositionPropertyZodSchema().parse(json);
      expect(result.value.times).toBeUndefined();
      expect(result.value.values).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => SampledPositionPropertyZodSchema().parse(json)).toThrow();
    });
  });

  describe('sampledPositionPropertyToJSON', () => {
    it('should convert SampledPositionProperty instance to JSON', () => {
      const instance = new SampledPositionProperty();
      instance.addSample(
        JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
        new Cartesian3(1, 2, 3),
      );
      const result = SampledPositionPropertyToJSON(instance);
      expect(result?.parser).toBe('SampledPositionProperty');
      expect(result?.value.times).toHaveLength(1);
      expect(result?.value.values).toHaveLength(1);
    });

    it('should return undefined for undefined input', () => {
      const result = SampledPositionPropertyToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert SampledPositionProperty with multiple samples', () => {
      const instance = new SampledPositionProperty();
      instance.addSample(
        JulianDate.fromIso8601('2024-01-01T00:00:00Z'),
        new Cartesian3(1, 2, 3),
      );
      instance.addSample(
        JulianDate.fromIso8601('2024-06-01T00:00:00Z'),
        new Cartesian3(4, 5, 6),
      );
      const result = SampledPositionPropertyToJSON(instance);
      expect(result?.value.times).toHaveLength(2);
      expect(result?.value.values).toHaveLength(2);
    });
  });

  describe('sampledPositionPropertyFromJSON', () => {
    it('should convert JSON to SampledPositionProperty instance', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {
          times: [
            { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          ],
          values: [
            { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
          ],
        },
      };
      const result = SampledPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(SampledPositionProperty);
    });

    it('should return undefined for undefined input', () => {
      const result = SampledPositionPropertyFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with reference frame', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {
          referenceFrame: { parser: 'ReferenceFrame' as const, value: 'FIXED' as const },
          times: [
            { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
          ],
          values: [
            { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
          ],
        },
      };
      const result = SampledPositionPropertyFromJSON(json);
      expect(result?.referenceFrame).toBe(ReferenceFrame.FIXED);
    });

    it('should convert JSON with multiple samples', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {
          times: [
            { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
            { parser: 'JulianDate' as const, value: '2024-06-01T00:00:00Z' },
          ],
          values: [
            { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 3 } },
            { parser: 'Cartesian3' as const, value: { x: 4, y: 5, z: 6 } },
          ],
        },
      };
      const result = SampledPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(SampledPositionProperty);
    });

    it('should convert JSON with empty samples', () => {
      const json = {
        parser: 'SampledPositionProperty' as const,
        value: {},
      };
      const result = SampledPositionPropertyFromJSON(json);
      expect(result).toBeInstanceOf(SampledPositionProperty);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => SampledPositionPropertyFromJSON(json as any)).toThrow();
    });
  });
});
