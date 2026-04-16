import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { calculateFourthCoord, calculatePerpendicularCoord, calculatePerpendicularDistance, calculatePositionRelativeToLine, rectinclined1 } from '../src/rectinclined1';

describe('rectinclined1', () => {
  it('should return an array of 5 coordinates forming an inclined rectangle', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = rectinclined1(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });

  it('should return a closed shape (first and last points are the same)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = rectinclined1(coords);
    expect(result[0][0]).toBeCloseTo(result[4][0], 5);
    expect(result[0][1]).toBeCloseTo(result[4][1], 5);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => rectinclined1([])).toThrow('coords.length must >= 3');
    expect(() => rectinclined1([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => rectinclined1([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [10, 0],
      [0, 10],
    ];
    const result = rectinclined1(coords);
    expect(result.length).toBe(5);
  });
});

describe('calculatePerpendicularDistance', () => {
  it('should calculate the perpendicular distance from a point to a line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, 5];
    const distance = calculatePerpendicularDistance(p1, p2, p3);
    expect(distance).toBeCloseTo(5, 5);
  });

  it('should return 0 when the point is on the line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, 0];
    const distance = calculatePerpendicularDistance(p1, p2, p3);
    expect(distance).toBeCloseTo(0, 5);
  });
});

describe('calculatePositionRelativeToLine', () => {
  it('should return 1 or -1 for a point off the line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, 5];
    const result = calculatePositionRelativeToLine(p1, p2, p3);
    expect(result).toBeOneOf([-1, 1]);
  });

  it('should return non-zero for points not on the line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [5, -5];
    const result = calculatePositionRelativeToLine(p1, p2, p3);
    expect(result).not.toBe(0);
  });
});

describe('calculateFourthCoord', () => {
  it('should calculate the fourth point of a rectangle', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const p3: CoordArray = [10, 10];
    const result = calculateFourthCoord(p1, p2, p3);
    expect(result).toEqual([0, 10]);
  });
});

describe('calculatePerpendicularCoord', () => {
  it('should return a coordinate perpendicular to the line', () => {
    const p1: CoordArray = [0, 0];
    const p2: CoordArray = [10, 0];
    const result = calculatePerpendicularCoord(p1, p2, 5);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });
});
