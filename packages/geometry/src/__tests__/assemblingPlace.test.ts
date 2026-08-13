import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { assemblingPlace } from '../assemblingPlace';
import { FITTING_COUNT } from '../helper';
import { snapshotCoords } from './utils';

describe('assemblingPlace', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => assemblingPlace([])).toThrow('coords.length must >= 3');
    expect(() => assemblingPlace([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => assemblingPlace([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should not mutate input coordinates', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const snapshot = snapshotCoords(coords);
    const result = assemblingPlace(coords);
    expect(result.length).toBeGreaterThan(coords.length);
    expect(coords).toEqual(snapshot);
  });

  it('should pass through the input points and the computed midpoint', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = assemblingPlace(coords);
    // one cubic segment per point, each segment is FITTING_COUNT + 3 points
    const stride = FITTING_COUNT + 3;
    expect(result.length).toBe((coords.length + 1) * stride);
    expect(result[0]).toEqual([0, 0]);
    expect(result[stride]).toEqual([5, 10]);
    expect(result[stride * 2]).toEqual([10, 0]);
    // the curve closes through mid(coord[0], coord[2])
    expect(result[stride * 3]).toEqual([5, 0]);
    expect(result.at(-1)).toEqual([0, 0]);
  });
});
