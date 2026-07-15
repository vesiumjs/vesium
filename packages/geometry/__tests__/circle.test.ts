import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { circle } from '../src/circle';
import { FITTING_COUNT } from '../src/helper';

describe('circle', () => {
  it('should throw error when input has less than 2 points', () => {
    expect(() => circle([])).toThrow('coords.length must >= 2');
    expect(() => circle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return points at distance radius from center', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach((coord) => {
      expect(Math.hypot(coord[0], coord[1])).toBeCloseTo(10, 5);
    });
  });

  it('should collapse to center when radius is 0', () => {
    const result = circle([[0, 0], [0, 0]]);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach(([x, y]) => {
      expect(x).toBeCloseTo(0, 6);
      expect(y).toBeCloseTo(0, 6);
    });
  });
});
