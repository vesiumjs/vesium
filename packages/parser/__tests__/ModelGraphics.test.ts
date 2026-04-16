import { ModelGraphics } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModelGraphicsFromJSON, ModelGraphicsToJSON, ModelGraphicsZodSchema } from '../src/ModelGraphics';

describe('modelGraphics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('modelGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: 'model.glb',
          scale: 1.0,
          minimumPixelSize: 1,
          maximumScale: 100,
          runAnimations: true,
          clampAnimations: true,
          shadows: { parser: 'ShadowMode' as const, value: 'CAST_ONLY' as const },
          heightReference: { parser: 'HeightReference' as const, value: 'NONE' as const },
          color: { parser: 'Color' as const, value: { red: 1, green: 1, blue: 1, alpha: 1 } },
          colorBlendMode: { parser: 'ColorBlendMode' as const, value: 'HIGHLIGHT' as const },
          colorBlendAmount: 0.5,
        },
      };
      const result = ModelGraphicsZodSchema().parse(json);
      expect(result.value.uri).toBe('model.glb');
      expect(result.value.scale).toBe(1.0);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: 'model.glb',
        },
      };
      const result = ModelGraphicsZodSchema().parse(json);
      expect(result.value.uri).toBe('model.glb');
      expect(result.value.scale).toBeUndefined();
    });

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {},
      };
      const result = ModelGraphicsZodSchema().parse(json);
      expect(result.value).toEqual({});
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => ModelGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('modelGraphicsToJSON', () => {
    it('should convert ModelGraphics instance to JSON', () => {
      const instance = new ModelGraphics({
        show: true,
        uri: 'model.glb',
        scale: 1.5,
      });
      const result = ModelGraphicsToJSON(instance);
      expect(result?.parser).toBe('ModelGraphics');
      expect(result?.value.uri).toBe('model.glb');
    });

    it('should return undefined for undefined input', () => {
      const result = ModelGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert ModelGraphics with animation settings', () => {
      const instance = new ModelGraphics({
        uri: 'animated.glb',
        runAnimations: false,
        clampAnimations: false,
      });
      const result = ModelGraphicsToJSON(instance);
      expect(result?.parser).toBe('ModelGraphics');
      expect(result?.value.uri).toBe('animated.glb');
    });
  });

  describe('modelGraphicsFromJSON', () => {
    it('should convert JSON to ModelGraphics instance', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
          uri: 'model.glb',
          scale: 1.5,
        },
      };
      const result = ModelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(ModelGraphics);
    });

    it('should return undefined for undefined input', () => {
      const result = ModelGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with partial values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {
          show: true,
        },
      };
      const result = ModelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(ModelGraphics);
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'ModelGraphics' as const,
        value: {},
      };
      const result = ModelGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(ModelGraphics);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => ModelGraphicsFromJSON(json as any)).toThrow();
    });
  });
});
