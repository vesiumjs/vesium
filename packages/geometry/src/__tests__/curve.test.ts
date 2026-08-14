import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { curve } from '../curve';
import { FITTING_COUNT } from '../helper';
import { expectCoordArray, snapshotCoords } from './utils';

describe('curve', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => curve([])).toThrow('coords.length must >= 3');
    expect(() => curve([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => curve([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should interpolate with exact count, endpoints and no mutation', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const before = snapshotCoords(coords);
    const result = curve(coords);

    expect(result).toHaveLength((coords.length - 1) * (FITTING_COUNT + 2));
    expect(result[0]).toEqual([0, 0]);
    expect(result.at(-1)).toEqual([10, 0]);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should scale point count with more control points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [3, 8],
      [7, 8],
      [10, 0],
    ];
    expect(curve(coords)).toHaveLength((coords.length - 1) * (FITTING_COUNT + 2));
  });
});
