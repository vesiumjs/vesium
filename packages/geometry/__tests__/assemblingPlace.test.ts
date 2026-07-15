import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { assemblingPlace } from '../src/assemblingPlace';
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
});
