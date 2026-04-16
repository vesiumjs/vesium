import { Cartesian3, PolygonGraphics, PolygonHierarchy } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PolygonGraphicsFromJSON, PolygonGraphicsToJSON, PolygonGraphicsZodSchema } from '../src/PolygonGraphics';

describe('polygonGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('polygonGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          hierarchy: {
            parser: 'PolygonHierarchy' as const,
            value: {
              positions: [
                { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } },
              ],
            },
          },
          height: 100,
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
        },
      };
      const result = PolygonGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.height).toBe(100);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          height: 50,
        },
      };
      const result = PolygonGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.height).toBe(50);
      expect(result.value.hierarchy).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {},
      };
      const result = PolygonGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolygonGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('polygonGraphicsToJSON', () => {
    it('should convert PolygonGraphics instance to JSON', () => {
      const instance = new PolygonGraphics({
        show: true,
        hierarchy: new PolygonHierarchy([
          new Cartesian3(0, 0, 0),
          new Cartesian3(1, 0, 0),
          new Cartesian3(1, 1, 0),
        ]),
        height: 100,
        fill: true,
      });
      const result = PolygonGraphicsToJSON(instance);
      expect(result?.parser).toBe('PolygonGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.height).toBe(100);
    });

    it('should return undefined for undefined input', () => {
      const result = PolygonGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('polygonGraphicsFromJSON', () => {
    it('should convert JSON to PolygonGraphics instance', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
          hierarchy: {
            parser: 'PolygonHierarchy' as const,
            value: {
              positions: [
                { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } },
              ],
            },
          },
          height: 100,
          fill: true,
        },
      };
      const result = PolygonGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolygonGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = PolygonGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = PolygonGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolygonGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'PolygonGraphics' as const,
        value: {},
      };
      const result = PolygonGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolygonGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolygonGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
