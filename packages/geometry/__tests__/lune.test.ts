import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { lune } from '../src/lune';

describe('lune', () => {
  it('should return an array of coordinates with valid input (2 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return an array with the shape closed (last point equals first)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    const first = result[0];
    const last = result.at(-1);
    expect(first[0]).toBeCloseTo(last[0], 5);
    expect(first[1]).toBeCloseTo(last[1], 5);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => lune([])).toThrow('coords.length must >= 2');
    expect(() => lune([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle input with 3 points (uses them directly)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = lune(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });
});
