import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { assemblingPlace } from '../src/assemblingPlace';
import { expectCoordArray } from './utils';

describe('assemblingPlace', () => {
  it('should return many interpolated points for a smooth shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = assemblingPlace(coords);
    expect(result.length).toBeGreaterThan(coords.length);
    expectCoordArray(result);
  });

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
    const snapshot = coords.map(item => [...item] as CoordArray);
    assemblingPlace(coords);
    expect(coords).toEqual(snapshot);
    expect(coords).toHaveLength(3);
  });
});
