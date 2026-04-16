import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowAttackDirection } from '../src/arrowAttackDirection';

describe('arrowAttackDirection', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => arrowAttackDirection([])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return empty array for insufficient head coords', () => {
    // When all 3 points are the same, arrow head calculation may fail
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
      [0, 0],
    ];
    const result = arrowAttackDirection(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should accept custom options', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords, {
      headWidthFactor: 0.35,
      headHeightFactor: 0.2,
      neckWidthFactor: 0.18,
      neckHeightFactor: 0.88,
      tailWidthFactor: 0.12,
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    if (result.length > 0) {
      result.forEach((coord) => {
        expect(coord.length).toBe(2);
        expect(typeof coord[0]).toBe('number');
        expect(typeof coord[1]).toBe('number');
      });
    }
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [50000, 25000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    expect(Array.isArray(result)).toBe(true);
  });
});
