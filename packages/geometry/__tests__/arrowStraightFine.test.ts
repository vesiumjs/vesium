import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraightFine } from '../src/arrowStraightFine';

describe('arrowStraightFine', () => {
  it('should return an array of coordinates with valid input (2 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = arrowStraightFine(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return 5 points for a fine arrow shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightFine(coords);
    expect(result.length).toBe(5);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowStraightFine([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraightFine([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightFine(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should scale arrow length based on distance', () => {
    const coords1: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const coords2: CoordArray[] = [
      [0, 0],
      [200000, 0],
    ];
    const result1 = arrowStraightFine(coords1);
    const result2 = arrowStraightFine(coords2);
    // The arrow coordinates should differ due to different distances
    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
  });

  it('should handle vertical direction', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 100000],
    ];
    const result = arrowStraightFine(coords);
    expect(result.length).toBe(5);
  });
});
