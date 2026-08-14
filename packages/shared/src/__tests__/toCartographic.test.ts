import { Cartesian3, Cartographic } from 'cesium';
import { describe, expect, it } from 'vitest';
import { toCartographic } from '../toCartographic';

describe('toCartographic', () => {
  describe('with Cartesian3 input', () => {
    it('should convert Cartesian3 to Cartographic with correct values', () => {
      const cartesian = Cartesian3.fromDegrees(120, 30, 100);
      const result = toCartographic(cartesian);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Cartographic);
      expect(result!.longitude).toBeCloseTo(2.0943951023931953, 5);
      expect(result!.latitude).toBeCloseTo(0.5235987755982988, 5);
      expect(result!.height).toBeCloseTo(100, 5);
    });
  });

  describe('with Cartographic input', () => {
    it('should clone the Cartographic with correct values', () => {
      const cartographic = Cartographic.fromDegrees(120, 30, 100);
      const result = toCartographic(cartographic);
      expect(result).toBeDefined();
      expect(result).not.toBe(cartographic);
      expect(result!.longitude).toBe(cartographic.longitude);
      expect(result!.latitude).toBe(cartographic.latitude);
      expect(result!.height).toBe(cartographic.height);
    });
  });

  describe('with array input', () => {
    it('should convert [lng, lat] to Cartographic', () => {
      const result = toCartographic([120, 30]);
      expect(result).toBeDefined();
      expect(result!.longitude).toBeCloseTo(Cartographic.fromDegrees(120, 30).longitude);
      expect(result!.latitude).toBeCloseTo(Cartographic.fromDegrees(120, 30).latitude);
    });

    it('should convert [lng, lat, alt] to Cartographic', () => {
      const result = toCartographic([120, 30, 100]);
      expect(result).toBeDefined();
      expect(result!.height).toBe(100);
    });
  });

  describe('with object input', () => {
    it('should convert { longitude, latitude } to Cartographic', () => {
      const result = toCartographic({ longitude: 120, latitude: 30 });
      expect(result).toBeDefined();
      expect(result!.longitude).toBeCloseTo(Cartographic.fromDegrees(120, 30).longitude);
      expect(result!.latitude).toBeCloseTo(Cartographic.fromDegrees(120, 30).latitude);
    });

    it('should convert { longitude, latitude, height } to Cartographic', () => {
      const result = toCartographic({ longitude: 120, latitude: 30, height: 100 });
      expect(result).toBeDefined();
      expect(result!.height).toBe(100);
    });
  });

  describe('with undefined or empty input', () => {
    it('should return undefined for undefined input', () => {
      expect(toCartographic(undefined)).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      expect(toCartographic(null as any)).toBeUndefined();
    });
  });

  describe('with malformed input', () => {
    it('should throw DeveloperError for empty array (NaN longitude)', () => {
      expect(() => toCartographic([])).toThrow();
    });

    it('should throw DeveloperError for object missing longitude field', () => {
      expect(() => toCartographic({ latitude: 30 } as any)).toThrow();
    });

    it('should throw DeveloperError for object missing both fields', () => {
      expect(() => toCartographic({} as any)).toThrow();
    });
  });
});
