import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { calculateFourthCoord, calculateIntersectionCoord, rectinclined2 } from '../src/rectinclined2';
import { expectCoordArray } from './utils';

describe('rectinclined2', () => {
  it('should return 5 coordinates forming an inclined rectangle', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = rectinclined2(coords);
    expect(result.length).toBe(5);
  });

  it('should return a closed shape (first and last points match)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = rectinclined2(coords);
    expect(result[0][0]).toBeCloseTo(result[4][0], 5);
    expect(result[0][1]).toBeCloseTo(result[4][1], 5);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => rectinclined2([])).toThrow('coords.length must >= 3');
    expect(() => rectinclined2([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => rectinclined2([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [10, 0],
      [0, 10],
    ];
    const result = rectinclined2(coords);
    expect(result.length).toBe(5);
  });

  it('should handle point on the line (zero height rectangle)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 0],
    ];
    const result = rectinclined2(coords);
    expect(result.length).toBe(5);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = rectinclined2(coords);
    expectCoordArray(result);
  });
});

describe('calculateIntersectionCoord', () => {
  it('should calculate the perpendicular projection of p3 onto line p1-p2', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, 5];
    const result = calculateIntersectionCoord(p1, p2, p3);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(0, 5);
  });

  it('should return the point itself when it lies on the line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, 0];
    const result = calculateIntersectionCoord(p1, p2, p3);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(0, 5);
  });
});

describe('calculateFourthCoord (rectinclined2)', () => {
  it('should calculate the fourth point of a rectangle', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [10, 10];
    const result = calculateFourthCoord(p1, p2, p3);
    expect(result).toEqual([0, 10]);
  });
});
