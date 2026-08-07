import { describe, expect, it } from 'vitest';
import { degreesToDms, dmsDecode, dmsEncode, dmsToDegrees } from '../src/convertDMS';

describe('convertDMS', () => {
  describe('dmsEncode', () => {
    it('should encode degrees to DMS format', () => {
      expect(dmsEncode(120.5125)).toBe('120°30′45″');
    });

    it('should encode integer degrees', () => {
      expect(dmsEncode(120)).toBe('120°0′0″');
    });

    it('should encode with custom precision', () => {
      expect(dmsEncode(120.5125, 2)).toBe('120°30′45″');
      expect(dmsEncode(120.5126, 2)).toBe('120°30′45.36″');
      expect(dmsEncode(120.5126, 3)).toBe('120°30′45.36″');
      expect(dmsEncode(120.51265, 3)).toBe('120°30′45.54″');
    });

    it.each([
      [-120.5, '120°30′0″'],
      [120.5, '120°30′0″'],
      [120.9999999, '121°0′0″'],
    ])('should handle %s -> %s', (input, expected) => {
      expect(dmsEncode(input)).toBe(expected);
    });
  });

  describe('dmsDecode', () => {
    it.each([
      ['120°30′45″', 120.5125],
      ['120°30′45″E', 120.5125],
      ['30°15′30″N', 30.258333333333333],
      ['120°30′45″W', -120.5125],
      ['120°30′45″s', -120.5125],
    ])('should decode %s to %d', (input, expected) => {
      expect(dmsDecode(input)).toBeCloseTo(expected, 4);
    });

    it('should return 0 for empty or invalid input', () => {
      expect(dmsDecode('')).toBe(0);
      expect(dmsDecode('invalid')).toBe(0);
    });

    it('should handle partial DMS strings', () => {
      expect(dmsDecode('120°')).toBe(120);
    });
  });

  describe('degreesToDms', () => {
    it.each([
      [[120, 30], ['120°0′0″E', '30°0′0″N', undefined]],
      [{ longitude: 120, latitude: 30 }, ['120°0′0″E', '30°0′0″N', undefined]],
      [[-120, -30], ['120°0′0″W', '30°0′0″S', undefined]],
      [[120, 30, 100], ['120°0′0″E', '30°0′0″N', 100]],
    ])('should convert %s to DMS %s', (input, expected) => {
      expect(degreesToDms(input as any)).toEqual(expected);
    });

    it('should return undefined for undefined input', () => {
      expect(degreesToDms(undefined as any)).toBeUndefined();
    });
  });

  describe('dmsToDegrees', () => {
    it.each([
      [['120°30′45″E', '30°15′30″N', 100], [120.5125, 30.258333333333333, 100]],
      [['120°30′45″W', '30°15′30″S', 100], [-120.5125, -30.258333333333333, 100]],
    ])('should convert %s to %s', (input, expected) => {
      const result = dmsToDegrees(input as any);
      expect(result![0]).toBeCloseTo(expected[0], 4);
      expect(result![1]).toBeCloseTo(expected[1], 4);
      expect(result![2]).toBe(expected[2]);
    });
  });
});
