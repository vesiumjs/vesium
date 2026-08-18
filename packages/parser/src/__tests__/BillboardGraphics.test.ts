import { BillboardGraphics, CallbackProperty, JulianDate, Resource } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { BillboardGraphicsFromJSON, BillboardGraphicsToJSON, BillboardGraphicsZodSchema } from '../BillboardGraphics';

const TEST_IMAGE = 'test.png';
const RED_COLOR = { parser: 'Color' as const, value: { red: 1, green: 0, blue: 0, alpha: 1 } };
const TIME_BEFORE = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
const TIME_AFTER = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
const TIME_THRESHOLD = JulianDate.fromIso8601('2025-01-01T00:00:00Z');

describe('billboardGraphics', () => {
  describe('billboardGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: TEST_IMAGE,
          scale: 1.5,
          color: RED_COLOR,
        },
      };
      const result = BillboardGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.image).toBe(TEST_IMAGE);
      expect(result.value.color?.value.red).toBe(1);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: TEST_IMAGE,
        },
      };
      const result = BillboardGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.image).toBe(TEST_IMAGE);
      expect(result.value.scale).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => BillboardGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested color type', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          color: { parser: 'Color' as const, value: { red: 'bad' as any } },
        },
      };
      expect(() => BillboardGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('billboardGraphicsToJSON', () => {
    it('should convert BillboardGraphics instance to JSON', () => {
      const instance = new BillboardGraphics({
        show: true,
        image: TEST_IMAGE,
        scale: 1.5,
      });
      const result = BillboardGraphicsToJSON(instance);
      expect(result?.parser).toBe('BillboardGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.image).toBe(TEST_IMAGE);
    });

    it('should return undefined for undefined input', () => {
      const result = BillboardGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new BillboardGraphics({ image: TEST_IMAGE });
      instance.show = new CallbackProperty(((time: JulianDate) => JulianDate.greaterThan(time, TIME_THRESHOLD)) as any, false);
      const before = BillboardGraphicsToJSON(instance, TIME_BEFORE);
      const after = BillboardGraphicsToJSON(instance, TIME_AFTER);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });

    it('should omit a field when omit is provided', () => {
      const instance = new BillboardGraphics({ show: true, image: TEST_IMAGE });
      const result = BillboardGraphicsToJSON(instance, undefined, ['image']);
      expect(result?.value.image).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should normalize a Resource image to its URL', () => {
      const instance = new BillboardGraphics({
        image: new Resource('https://example.test/icon.png?version=1') as any,
      });
      expect(BillboardGraphicsToJSON(instance)?.value.image).toBe('https://example.test/icon.png?version=1');
    });
  });

  describe('billboardGraphicsFromJSON', () => {
    it('should convert JSON to BillboardGraphics instance', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: {
          show: true,
          image: TEST_IMAGE,
          scale: 1.5,
        },
      };
      const result = BillboardGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(BillboardGraphics);
      expect(toPropertyValue(result?.image)).toBe(TEST_IMAGE);
    });

    it('should return undefined for undefined input', () => {
      const result = BillboardGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: { show: true, image: TEST_IMAGE },
      };
      const result = new BillboardGraphics({ show: false });
      const output = BillboardGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.image)).toBe(TEST_IMAGE);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'BillboardGraphics' as const,
        value: { show: true, image: TEST_IMAGE },
      };
      const result = BillboardGraphicsFromJSON(json, undefined, ['image']);
      expect(toPropertyValue(result?.image)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
