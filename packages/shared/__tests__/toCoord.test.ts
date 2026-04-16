import { Cartesian3, Cartographic } from 'cesium';
import { describe, expect, it } from 'vitest';
import { toCoord } from '../src/toCoord';

describe('toCoord', () => {
  describe('with Cartesian3 input', () => {
    it('should convert Cartesian3 to array without altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30);
      const result = toCoord(cartesian, { type: 'Array' });
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);

      expect((result as any)[0]).toBeCloseTo(120);

      expect((result as any)[1]).toBeCloseTo(30);
    });

    it('should convert Cartesian3 to array with altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCoord(cartesian, { type: 'Array', alt: true });
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);

      expect((result as any)[0]).toBeCloseTo(120);

      expect((result as any)[1]).toBeCloseTo(30);

      expect((result as any)[2]).toBeCloseTo(100);
    });

    it('should convert Cartesian3 to object without altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30);
      const result = toCoord(cartesian, { type: 'Object' });
      expect(result).toBeDefined();

      expect(result).toHaveProperty('longitude');

      expect(result).toHaveProperty('latitude');

      expect(result).not.toHaveProperty('height');
    });

    it('should convert Cartesian3 to object with altitude', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCoord(cartesian, { type: 'Object', alt: true });
      expect(result).toBeDefined();

      expect(result).toHaveProperty('longitude');

      expect(result).toHaveProperty('latitude');

      expect(result).toHaveProperty('height');
    });
  });

  describe('with Cartographic input', () => {
    it('should convert Cartographic to array without altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Array' });
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);

      expect((result as any)[0]).toBeCloseTo(120);

      expect((result as any)[1]).toBeCloseTo(30);
    });

    it('should convert Cartographic to array with altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Array', alt: true });
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);

      expect((result as any)[2]).toBeCloseTo(100);
    });

    it('should convert Cartographic to object with altitude', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCoord(cartographic, { type: 'Object', alt: true });
      expect(result).toBeDefined();

      expect((result as any).longitude).toBeCloseTo(120);

      expect((result as any).latitude).toBeCloseTo(30);

      expect((result as any).height).toBeCloseTo(100);
    });
  });

  describe('with array input', () => {
    it('should convert [lng, lat] array to array output', () => {
      const result = toCoord([120, 30], { type: 'Array' });
      expect(result).toEqual([120, 30]);
    });

    it('should convert [lng, lat, alt] array to array output with altitude', () => {
      const result = toCoord([120, 30, 100], { type: 'Array', alt: true });
      expect(result).toEqual([120, 30, 100]);
    });

    it('should convert [lng, lat] array to object output', () => {
      const result = toCoord([120, 30], { type: 'Object' });
      expect(result).toEqual({ longitude: 120, latitude: 30 });
    });

    it('should convert [lng, lat, alt] array to object output with altitude', () => {
      const result = toCoord([120, 30, 100], { type: 'Object', alt: true });
      expect(result).toEqual({ longitude: 120, latitude: 30, height: 100 });
    });
  });

  describe('with object input', () => {
    it('should convert { longitude, latitude } object to array output', () => {
      const result = toCoord({ longitude: 120, latitude: 30 }, { type: 'Array' });
      expect(result).toEqual([120, 30]);
    });

    it('should convert { longitude, latitude, height } object to array output with altitude', () => {
      const result = toCoord({ longitude: 120, latitude: 30, height: 100 }, { type: 'Array', alt: true });
      expect(result).toEqual([120, 30, 100]);
    });

    it('should convert { longitude, latitude } object to object output', () => {
      const result = toCoord({ longitude: 120, latitude: 30 }, { type: 'Object' });
      expect(result).toEqual({ longitude: 120, latitude: 30 });
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
      const result = toCoord(cartesian);
      expect(result).toHaveLength(2);
    });
  });
});
