import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowClamped } from '../src/arrowClamped';

describe('arrowClamped', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => arrowClamped([])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle input with 3 points (auto-generates 4th point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle input with 4 points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
      [100000, 0],
    ];
    const result = arrowClamped(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle input with 5 points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
      [100000, 0],
      [50000, 25000],
    ];
    const result = arrowClamped(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle clockwise point order', () => {
    const coords: CoordArray[] = [
      [0, 10000],
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expect(Array.isArray(result)).toBe(true);
  });
});
