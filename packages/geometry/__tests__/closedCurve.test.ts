import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { closedCurve } from '../src/closedCurve';

describe('closedCurve', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return many interpolated points for a smooth closed curve', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => closedCurve([])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 5],
      [15, 0],
    ];
    const result = closedCurve(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [0, 10],
      [10, -10],
    ];
    const result = closedCurve(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = closedCurve(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [150000, 250000],
      [200000, 200000],
    ];
    const result = closedCurve(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle coordinates with decimal values', () => {
    const coords: CoordArray[] = [
      [0.5, 1.5],
      [2.5, 3.5],
      [4.5, 0.5],
    ];
    const result = closedCurve(coords);
    expect(Array.isArray(result)).toBe(true);
    result.forEach((coord) => {
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should close the curve (last point approximately equals first point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    const first = result[0];
    const last = result.at(-1);
    expect(first[0]).toBeCloseTo(last[0], 3);
    expect(first[1]).toBeCloseTo(last[1], 3);
  });
});
