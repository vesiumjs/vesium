import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { FITTING_COUNT } from '../helper';
import { lune } from '../lune';

describe('lune', () => {
  it('should throw error when input has less than 2 points', () => {
    expect(() => lune([])).toThrow('coords.length must >= 2');
    expect(() => lune([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return an arc spanning the two input points plus a closing point', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
    // the arc starts at the second input point and ends at the first
    expect(result[0][0]).toBeCloseTo(10, 5);
    expect(result[0][1]).toBeCloseTo(0, 5);
    expect(result[FITTING_COUNT][0]).toBeCloseTo(0, 5);
    expect(result[FITTING_COUNT][1]).toBeCloseTo(0, 5);
  });
});
