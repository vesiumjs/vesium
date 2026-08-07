import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import {
  calculateFourthCoord,
  calculatePerpendicularCoord,
  calculatePerpendicularDistance,
  rectinclined1,
} from '../src/rectinclined1';

describe('rectinclined1', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => rectinclined1([])).toThrow('coords.length must >= 3');
    expect(() => rectinclined1([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => rectinclined1([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return a closed rectangle with the mouse point projected onto a perpendicular', () => {
    const result = rectinclined1([[0, 0], [10, 0], [5, 5]]);
    const expected: CoordArray[] = [
      [0, 0],
      [10, 0],
      [10, 5],
      [0, 5],
      [0, 0],
    ];
    expect(result).toHaveLength(5);
    result.forEach((point, index) => {
      expect(point[0]).toBeCloseTo(expected[index][0], 5);
      expect(point[1]).toBeCloseTo(expected[index][1], 5);
    });
  });
});

describe('calculatePerpendicularDistance', () => {
  it('should calculate the perpendicular distance from a point to a line', () => {
    expect(calculatePerpendicularDistance([0, 0], [10, 0], [5, 5])).toBeCloseTo(5, 5);
  });

  it('should return 0 when the point is on the line', () => {
    expect(calculatePerpendicularDistance([0, 0], [10, 0], [5, 0])).toBeCloseTo(0, 5);
  });
});

describe('calculateFourthCoord (rectinclined1)', () => {
  it('should calculate the fourth point of a rectangle', () => {
    expect(calculateFourthCoord([0, 0], [10, 0], [10, 10])).toEqual([0, 10]);
  });
});

describe('calculatePerpendicularCoord', () => {
  it('should return point at correct distance from p2', () => {
    const p2: CoordArray = [10, 0];
    const result = calculatePerpendicularCoord([0, 0], p2, 5);
    expect(Math.hypot(result[0] - p2[0], result[1] - p2[1])).toBeCloseTo(5, 5);
  });
});
