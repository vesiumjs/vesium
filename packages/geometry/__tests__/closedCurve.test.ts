import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { closedCurve } from '../src/closedCurve';
import { FITTING_COUNT } from '../src/helper';
import { snapshotCoords } from './utils';

describe('closedCurve', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => closedCurve([])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should pass through the input points without mutating input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const snapshot = snapshotCoords(coords);
    const result = closedCurve(coords);
    // one cubic segment per input point, each segment is FITTING_COUNT + 3 points
    const stride = FITTING_COUNT + 3;
    expect(result.length).toBe(coords.length * stride);
    expect(result[0]).toEqual([0, 0]);
    expect(result[stride]).toEqual([5, 10]);
    expect(result[stride * 2]).toEqual([10, 0]);
    expect(coords).toEqual(snapshot);
  });
});
