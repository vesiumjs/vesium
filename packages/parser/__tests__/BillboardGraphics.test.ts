import { BillboardGraphics, Color } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillboardGraphicsFromJSON, BillboardGraphicsToJSON, BillboardGraphicsZodSchema } from '../src/BillboardGraphics';

describe('billboardGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('billboardGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: 'test.png',
          scale: 1.5,
          pixelOffset: { parser: 'Cartesian2' as const, value: { x: 0, y: 0 } },
          eyeOffset: { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
          horizontalOrigin: { parser: 'HorizontalOrigin' as const, value: 'CENTER' as const },
          verticalOrigin: { parser: 'VerticalOrigin' as const, value: 'CENTER' as const },
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          color: { parser: 'Color' as const, value: { red: 1, green: 1, blue: 1, alpha: 1 } },
          rotation: 0,
          alignedAxis: { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 1 } },
          sizeInMeters: false,
          width: 32,
          height: 32,
        },
      };
      const result = BillboardGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.image).toBe('test.png');
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: 'test.png',
        },
      };
      const result = BillboardGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.image).toBe('test.png');
      expect(result.value.scale).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {},
      };
      const result = BillboardGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BillboardGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('billboardGraphicsToJSON', () => {
    it('should convert BillboardGraphics instance to JSON', () => {
      const instance = new BillboardGraphics({
        show: true,
        image: 'test.png',
        scale: 1.5,
      });
      const result = BillboardGraphicsToJSON(instance);
      expect(result?.parser).toBe('BillboardGraphics');
      expect(result?.value.show).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      const result = BillboardGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert BillboardGraphics with all properties', () => {
      const instance = new BillboardGraphics({
        show: true,
        image: 'test.png',
        scale: 1.0,
        color: new Color(1, 0, 0, 1),
      });
      const result = BillboardGraphicsToJSON(instance);
      expect(result?.parser).toBe('BillboardGraphics');
      expect(result?.value.show).toBe(true);
    });
  });

  describe('billboardGraphicsFromJSON', () => {
    it('should convert JSON to BillboardGraphics instance', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: 'test.png',
          scale: 1.5,
        },
      };
      const result = BillboardGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BillboardGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = BillboardGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = BillboardGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BillboardGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {},
      };
      const result = BillboardGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BillboardGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BillboardGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
