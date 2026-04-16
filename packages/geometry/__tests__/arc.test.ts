import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arc } from '../src/arc';

describe('arc', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return 101 points (interpolated arc)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(101);
  });

  it('should throw error when input has 2 or fewer points', () => {
    expect(() => arc([])).toThrow('coords.length must >= 3');
    expect(() => arc([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arc([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [0, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = arc(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle collinear points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 0],
      [10, 0],
    ];
    const result = arc(coords);
    expect(Array.isArray(result)).toBe(true);
  });
});
