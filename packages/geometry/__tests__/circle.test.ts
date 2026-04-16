import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { circle } from '../src/circle';

describe('circle', () => {
  it('should return an array of coordinates with valid input (2 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return 101 points (100 iterations + 1)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(101);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => circle([])).toThrow('coords.length must >= 2');
    expect(() => circle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return coordinates forming a circle shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    // All points should be approximately distance 10 from center (0,0)
    const radius = 10;
    result.forEach((coord) => {
      const dist = Math.sqrt(coord[0] ** 2 + coord[1] ** 2);
      expect(dist).toBeCloseTo(radius, 0);
    });
  });

  it('should handle coordinates with negative center', () => {
    const coords: CoordArray[] = [
      [-5, -5],
      [5, -5],
    ];
    const result = circle(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(101);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle large radius values', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(101);
  });
});
