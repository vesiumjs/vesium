import { BoxGraphics, Cartesian3 } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BoxGraphicsFromJSON, BoxGraphicsToJSON, BoxGraphicsZodSchema } from '../src/BoxGraphics';

describe('boxGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('boxGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } },
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
          shadows: { parser: 'ShadowMode' as const, value: 'CAST_ONLY' as const },
        },
      };
      const result = BoxGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.dimensions?.value.x).toBe(10);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } },
        },
      };
      const result = BoxGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.dimensions?.value.x).toBe(10);
      expect(result.value.fill).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {},
      };
      const result = BoxGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BoxGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('boxGraphicsToJSON', () => {
    it('should convert BoxGraphics instance to JSON', () => {
      const instance = new BoxGraphics({
        show: true,
        dimensions: new Cartesian3(10, 20, 30),
        fill: true,
        outline: true,
      });
      const result = BoxGraphicsToJSON(instance);
      expect(result?.parser).toBe('BoxGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.dimensions?.value.x).toBe(10);
      expect(result?.value.dimensions?.value.y).toBe(20);
      expect(result?.value.dimensions?.value.z).toBe(30);
    });

    it('should return undefined for undefined input', () => {
      const result = BoxGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert BoxGraphics with basic dimensions', () => {
      const instance = new BoxGraphics({
        dimensions: new Cartesian3(5, 5, 5),
      });
      const result = BoxGraphicsToJSON(instance);
      expect(result?.parser).toBe('BoxGraphics');
      expect(result?.value.dimensions?.value.x).toBe(5);
    });
  });

  describe('boxGraphicsFromJSON', () => {
    it('should convert JSON to BoxGraphics instance', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
          dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } },
          fill: true,
          outline: true,
        },
      };
      const result = BoxGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BoxGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = BoxGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = BoxGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BoxGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'BoxGraphics' as const,
        value: {},
      };
      const result = BoxGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BoxGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BoxGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
