import { Color, PointGraphics } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PointGraphicsFromJSON, PointGraphicsToJSON, PointGraphicsZodSchema } from '../src/PointGraphics';

describe('pointGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pointGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 10,
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          color: { parser: 'Color' as const, value: { red: 1, green: 0, blue: 0, alpha: 1 } },
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 2,
        },
      };
      const result = PointGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.pixelSize).toBe(10);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 5,
        },
      };
      const result = PointGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.pixelSize).toBe(5);
      expect(result.value.color).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {},
      };
      const result = PointGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PointGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('pointGraphicsToJSON', () => {
    it('should convert PointGraphics instance to JSON', () => {
      const instance = new PointGraphics({
        show: true,
        pixelSize: 10,
        color: new Color(1, 0, 0, 1),
      });
      const result = PointGraphicsToJSON(instance);
      expect(result?.parser).toBe('PointGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.pixelSize).toBe(10);
    });

    it('should return undefined for undefined input', () => {
      const result = PointGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert PointGraphics with outline', () => {
      const instance = new PointGraphics({
        pixelSize: 8,
        outlineColor: new Color(0, 0, 0, 1),
        outlineWidth: 2,
      });
      const result = PointGraphicsToJSON(instance);
      expect(result?.parser).toBe('PointGraphics');
      expect(result?.value.pixelSize).toBe(8);
    });
  });

  describe('pointGraphicsFromJSON', () => {
    it('should convert JSON to PointGraphics instance', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
          pixelSize: 10,
          color: { parser: 'Color' as const, value: { red: 1, green: 0, blue: 0, alpha: 1 } },
        },
      };
      const result = PointGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PointGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = PointGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = PointGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PointGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'PointGraphics' as const,
        value: {},
      };
      const result = PointGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PointGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PointGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
