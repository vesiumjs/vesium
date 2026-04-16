import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { assemblingPlace } from '../src/assemblingPlace';

describe('assemblingPlace', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = assemblingPlace(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return many interpolated points for a smooth shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = assemblingPlace(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => assemblingPlace([])).toThrow('coords.length must >= 3');
    expect(() => assemblingPlace([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => assemblingPlace([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 10],
      [15, 0],
    ];
    const result = assemblingPlace(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [0, 10],
      [10, -10],
    ];
    const result = assemblingPlace(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = assemblingPlace(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });
});
