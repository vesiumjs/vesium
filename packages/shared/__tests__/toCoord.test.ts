import { Cartesian3, Cartographic } from 'cesium';
import { describe, expect, it } from 'vitest';
import { toCoord } from '../src/toCoord';

describe('toCoord', () => {
  describe('with Cartesian3 input', () => {
    it('should convert Cartesian3 to array without altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30);
      const result = toCoord(cartesian, { type: 'Array' }) as number[];
      expect(result).toHaveLength(2);
      expect(result[0]).toBeCloseTo(120);
      expect(result[1]).toBeCloseTo(30);
    });

    it('should convert Cartesian3 to array with altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCoord(cartesian, { type: 'Array', alt: true }) as number[];
      expect(result).toHaveLength(3);
      expect(result[0]).toBeCloseTo(120);
      expect(result[1]).toBeCloseTo(30);
      expect(result[2]).toBeCloseTo(100);
    });

    it('should convert Cartesian3 to object without altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30);
      const result = toCoord(cartesian, { type: 'Object' }) as Record<string, number>;
      expect(result.longitude).toBeCloseTo(120);
      expect(result.latitude).toBeCloseTo(30);
      expect(result).not.toHaveProperty('height');
    });

    it('should convert Cartesian3 to object with altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCoord(cartesian, { type: 'Object', alt: true }) as Record<string, number>;
      expect(result.longitude).toBeCloseTo(120);
      expect(result.latitude).toBeCloseTo(30);
      expect(result.height).toBeCloseTo(100);
    });
  });

  describe('with Cartographic input', () => {
    it('should convert Cartographic to array without altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Array' }) as number[];
      expect(result).toHaveLength(2);
      expect(result[0]).toBeCloseTo(120);
      expect(result[1]).toBeCloseTo(30);
    });

    it('should convert Cartographic to array with altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Array', alt: true }) as number[];
      expect(result).toHaveLength(3);
      expect(result[0]).toBeCloseTo(120);
      expect(result[1]).toBeCloseTo(30);
      expect(result[2]).toBeCloseTo(100);
    });

    it('should convert Cartographic to object with altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Object', alt: true }) as Record<string, number>;
      expect(result.longitude).toBeCloseTo(120);
      expect(result.latitude).toBeCloseTo(30);
      expect(result.height).toBeCloseTo(100);
    });
  });

  describe('with array input', () => {
    it.each([
      [[120, 30], { type: 'Array' } as const, [120, 30]],
      [[120, 30, 100], { type: 'Array', alt: true } as const, [120, 30, 100]],
      [[120, 30], { type: 'Object' } as const, { longitude: 120, latitude: 30 }],
      [[120, 30, 100], { type: 'Object', alt: true } as const, { longitude: 120, latitude: 30, height: 100 }],
    ])('should convert %s with %j to %j', (input, options, expected) => {
      expect(toCoord(input, options as any)).toEqual(expected);
    });

    it('should return undefined for empty array without alt', () => {
      const result = toCoord([], { type: 'Array' });
      expect(result).toEqual([undefined, undefined]);
    });
  });

  describe('with object input', () => {
    it.each([
      [{ longitude: 120, latitude: 30 }, { type: 'Array' } as const, [120, 30]],
      [{ longitude: 120, latitude: 30, height: 100 }, { type: 'Array', alt: true } as const, [120, 30, 100]],
      [{ longitude: 120, latitude: 30 }, { type: 'Object' } as const, { longitude: 120, latitude: 30 }],
      [{ longitude: 120, latitude: 30, height: 100 }, { type: 'Object', alt: true } as const, { longitude: 120, latitude: 30, height: 100 }],
    ])('should convert %j with %j to %j', (input, options, expected) => {
      expect(toCoord(input, options as any)).toEqual(expected);
    });
  });

  describe('with undefined or empty input', () => {
    it('should return undefined for undefined input', () => {
      expect(toCoord(undefined)).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      expect(toCoord(null as any)).toBeUndefined();
    });
  });

  describe('default options', () => {
    it('should default to Array type without altitude', () => {
      const result = toCoord([120, 30]);
      expect(result).toEqual([120, 30]);
    });

    it('should default to Array type without altitude when passing Cartesian3', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCoord(cartesian) as number[];
      expect(result).toHaveLength(2);
      expect(result[0]).toBeCloseTo(120);
      expect(result[1]).toBeCloseTo(30);
    });
  });
});
