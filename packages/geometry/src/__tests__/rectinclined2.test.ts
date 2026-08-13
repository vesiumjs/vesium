import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { calculateFourthCoord, calculateIntersectionCoord, rectinclined2 } from '../rectinclined2';

describe('rectinclined2', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => rectinclined2([])).toThrow('coords.length must >= 3');
    expect(() => rectinclined2([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => rectinclined2([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return a closed rectangle with the mouse point as a corner', () => {
    const result = rectinclined2([[0, 0], [10, 0], [5, 5]]);
    const expected: CoordArray[] = [
      [0, 0],
      [5, 0],
      [5, 5],
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

describe('calculateIntersectionCoord', () => {
  it('should calculate the perpendicular projection of p3 onto line p1-p2', () => {
    const result = calculateIntersectionCoord([0, 0], [10, 0], [5, 5]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(0, 5);
  });
});

describe('calculateFourthCoord (rectinclined2)', () => {
  it('should calculate the fourth point of a rectangle', () => {
    expect(calculateFourthCoord([0, 0], [10, 0], [10, 10])).toEqual([0, 10]);
  });
});
