import { describe, expect, it } from 'vitest';
import { degreesToDms, dmsDecode, dmsEncode, dmsToDegrees } from '../src/convertDMS';

describe('convertDMS', () => {
  describe('dmsEncode', () => {
    it('should encode degrees to DMS format', () => {
      const result = dmsEncode(120.5125);
      expect(result).toContain('°');
      expect(result).toContain('′');
      expect(result).toContain('″');
    });

    it('should encode integer degrees', () => {
      const result = dmsEncode(120);
      expect(result).toBe('120°0′0″');
    });

    it('should encode with custom precision', () => {
      const result = dmsEncode(120.5, 2);
      expect(result).toMatch(/″$/);
    });

    it('should use absolute value for degrees in output', () => {
      const result = dmsEncode(-120.5);
      expect(result).toContain('120°');
    });
  });

  describe('dmsDecode', () => {
    it('should decode DMS string to decimal degrees', () => {
      const result = dmsDecode('120°30′45″');
      expect(result).toBeGreaterThan(120);
      expect(result).toBeLessThan(121);
    });

    it('should decode DMS with direction indicator (N/E)', () => {
      const result = dmsDecode('120°30′45″E');
      expect(result).toBeGreaterThan(0);
    });

    it('should decode DMS with direction indicator (S/W) as negative', () => {
      const result = dmsDecode('120°30′45″W');
      expect(result).toBeLessThan(0);
    });

    it('should decode DMS with direction indicator (s) as negative', () => {
      const result = dmsDecode('120°30′45″s');
      expect(result).toBeLessThan(0);
    });

    it('should return 0 for empty or invalid input', () => {
      expect(dmsDecode('')).toBe(0);
      expect(dmsDecode('invalid')).toBe(0);
    });

    it('should handle partial DMS strings', () => {
      const result = dmsDecode('120°');
      expect(result).toBe(120);
    });
  });

  describe('degreesToDms', () => {
    it('should convert array coordinates to DMS', () => {
      const result = degreesToDms([120, 30]);
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result![0]).toContain('E');
      expect(result![1]).toContain('N');
    });

    it('should convert object coordinates to DMS', () => {
      const result = degreesToDms({ longitude: 120, latitude: 30 });
      expect(result).toBeDefined();
      expect(result![0]).toContain('E');
      expect(result![1]).toContain('N');
    });

    it('should handle negative coordinates with W/S indicators', () => {
      const result = degreesToDms([-120, -30]);
      expect(result).toBeDefined();
      expect(result![0]).toContain('W');
      expect(result![1]).toContain('S');
    });

    it('should include height when provided', () => {
      const result = degreesToDms([120, 30, 100]);
      expect(result).toBeDefined();
      expect(result![2]).toBe(100);
    });

    it('should return undefined for undefined input', () => {
      expect(degreesToDms(undefined as any)).toBeUndefined();
    });
  });

  describe('dmsToDegrees', () => {
    it('should convert DMS array back to decimal degrees', () => {
      const result = dmsToDegrees(['120°30′45″E', '30°15′30″N', 100]);
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result![0]).toBeGreaterThan(120);
      expect(result![1]).toBeGreaterThan(30);
      expect(result![2]).toBe(100);
    });

    it('should handle W/S direction indicators', () => {
      const result = dmsToDegrees(['120°30′45″W', '30°15′30″S', 100]);
      expect(result).toBeDefined();
      expect(result![0]).toBeLessThan(0);
      expect(result![1]).toBeLessThan(0);
    });
  });
});
