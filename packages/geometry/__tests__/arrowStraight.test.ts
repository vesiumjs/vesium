import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraight } from '../src/arrowStraight';

describe('arrowStraight', () => {
  it('should return an array of coordinates with valid input (2 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = arrowStraight(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return 7 points for a standard arrow shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowStraight([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraight([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraight(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle vertical arrow direction', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 100000],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should handle large distance coordinates', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [1000000, 1000000],
    ];
    const result = arrowStraight(coords);
    expect(Array.isArray(result)).toBe(true);
  });
});
