import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowClamped } from '../src/arrowClamped';
import { expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowClamped', () => {
  it('should throw error when input has less than 3 points', () => {
    expect(() => arrowClamped([])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should keep attack tip and not mutate input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10_000],
      [100_000, 50_000],
    ];
    const before = snapshotCoords(coords);
    const result = arrowClamped(coords);
    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });
});
