import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { rectAngle } from '../rectAngle';

describe('rectAngle', () => {
  it('should throw error when input has less than 2 points', () => {
    expect(() => rectAngle([])).toThrow('coords.length must >= 2');
    expect(() => rectAngle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return correct corner coordinates in order', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result).toEqual([
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0],
      [0, 0],
    ]);
  });

  it('should produce correct corners for non-square rectangle', () => {
    const result = rectAngle([[0, 0], [10, 20]]);
    expect(result).toEqual([
      [0, 0],
      [0, 20],
      [10, 20],
      [10, 0],
      [0, 0],
    ]);
  });

  it('should only use the first two coordinates from input', () => {
    const result = rectAngle([[0, 0], [10, 10], [50, 50]]);
    expect(result[0]).toEqual([0, 0]);
    expect(result[2]).toEqual([10, 10]);
  });

  it('should collapse when start and end are identical', () => {
    const result = rectAngle([[5, 5], [5, 5]]);
    result.forEach((coord) => {
      expect(coord[0]).toBeCloseTo(5, 6);
      expect(coord[1]).toBeCloseTo(5, 6);
    });
  });
});
