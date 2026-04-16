import { EllipseGraphics } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EllipseGraphicsFromJSON, EllipseGraphicsToJSON, EllipseGraphicsZodSchema } from '../src/EllipseGraphics';

describe('ellipseGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ellipseGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: 1000,
          semiMinorAxis: 500,
          height: 100,
          rotation: 0,
          stRotation: 0,
          fill: true,
          outline: true,
          outlineColor: { parser: 'Color' as const, value: { red: 0, green: 0, blue: 0, alpha: 1 } },
          outlineWidth: 1,
          numberOfVerticalLines: 16,
        },
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.semiMajorAxis).toBe(1000);
      expect(result.value.semiMinorAxis).toBe(500);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: 1000,
          semiMinorAxis: 500,
        },
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.semiMajorAxis).toBe(1000);
      expect(result.value.semiMinorAxis).toBe(500);
      expect(result.value.height).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {},
      };
      const result = EllipseGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EllipseGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('ellipseGraphicsToJSON', () => {
    it('should convert EllipseGraphics instance to JSON', () => {
      const instance = new EllipseGraphics({
        show: true,
        semiMajorAxis: 1000,
        semiMinorAxis: 500,
        height: 100,
        fill: true,
        outline: true,
      });
      const result = EllipseGraphicsToJSON(instance);
      expect(result?.parser).toBe('EllipseGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.semiMajorAxis).toBe(1000);
      expect(result?.value.semiMinorAxis).toBe(500);
    });

    it('should return undefined for undefined input', () => {
      const result = EllipseGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert EllipseGraphics with rotation', () => {
      const instance = new EllipseGraphics({
        semiMajorAxis: 2000,
        semiMinorAxis: 1000,
        rotation: Math.PI / 4,
      });
      const result = EllipseGraphicsToJSON(instance);
      expect(result?.parser).toBe('EllipseGraphics');
      expect(result?.value.semiMajorAxis).toBe(2000);
    });
  });

  describe('ellipseGraphicsFromJSON', () => {
    it('should convert JSON to EllipseGraphics instance', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
          semiMajorAxis: 1000,
          semiMinorAxis: 500,
          height: 100,
          fill: true,
          outline: true,
        },
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = EllipseGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'EllipseGraphics' as const,
        value: {},
      };
      const result = EllipseGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(EllipseGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EllipseGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
