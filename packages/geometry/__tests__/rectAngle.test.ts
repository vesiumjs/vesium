import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { rectAngle } from '../src/rectAngle';

describe('rectAngle', () => {
  it('should return an array of 5 coordinates forming a rectangle (closed)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });

  it('should return a closed rectangle (first and last points are the same)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result[0][0]).toBe(result[4][0]);
    expect(result[0][1]).toBe(result[4][1]);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => rectAngle([])).toThrow('coords.length must >= 2');
    expect(() => rectAngle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should produce correct corner coordinates', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 20],
    ];
    const result = rectAngle(coords);
    // Expected: [start, [startX, endY], end, [endX, startY], start]
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([0, 20]);
    expect(result[2]).toEqual([10, 20]);
    expect(result[3]).toEqual([10, 0]);
    expect(result[4]).toEqual([0, 0]);
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result.length).toBe(5);
  });

  it('should only use the first two coordinates from input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
      [50, 50],
    ];
    const result = rectAngle(coords);
    expect(result[0]).toEqual([0, 0]);
    expect(result[2]).toEqual([10, 10]);
  });
});
