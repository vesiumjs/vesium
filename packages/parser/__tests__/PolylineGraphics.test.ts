import { Cartesian3, PolylineGraphics } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PolylineGraphicsFromJSON, PolylineGraphicsToJSON, PolylineGraphicsZodSchema } from '../src/PolylineGraphics';

describe('polylineGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('polylineGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          positions: [
            { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
            { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } },
          ],
          width: 2,
          arcType: { parser: 'ArcType' as const, value: 'GEODESIC' as const },
          clampToGround: false,
          shadows: { parser: 'ShadowMode' as const, value: 'DISABLED' as const },
        },
      };
      const result = PolylineGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.positions).toHaveLength(2);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          width: 3,
        },
      };
      const result = PolylineGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.width).toBe(3);
      expect(result.value.positions).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {},
      };
      const result = PolylineGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolylineGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('polylineGraphicsToJSON', () => {
    it('should convert PolylineGraphics instance to JSON', () => {
      const instance = new PolylineGraphics({
        show: true,
        positions: [
          new Cartesian3(0, 0, 0),
          new Cartesian3(1, 1, 1),
        ],
        width: 2,
      });
      const result = PolylineGraphicsToJSON(instance);
      expect(result?.parser).toBe('PolylineGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.width).toBe(2);
    });

    it('should return undefined for undefined input', () => {
      const result = PolylineGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('polylineGraphicsFromJSON', () => {
    it('should convert JSON to PolylineGraphics instance', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          positions: [
            { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
            { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } },
          ],
          width: 2,
        },
      };
      const result = PolylineGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolylineGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = PolylineGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = PolylineGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolylineGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {},
      };
      const result = PolylineGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolylineGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolylineGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
