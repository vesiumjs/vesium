import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowAttackDirectionTailed } from '../arrowAttackDirectionTailed';
import { dist, expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowAttackDirectionTailed', () => {
  it('should throw when input has less than 3 points', () => {
    expect(() => arrowAttackDirectionTailed([])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirectionTailed([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirectionTailed([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return a closed polygon with tip present', () => {
    const coords: CoordArray[] = [[0, 0], [0, 10_000], [100_000, 50_000]];
    const before = snapshotCoords(coords);
    const result = arrowAttackDirectionTailed(coords);

    expect(result.at(-1)).toEqual(result[0]);
    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should deepen swallow tail when swallowTailFactor increases', () => {
    const coords: CoordArray[] = [[0, 0], [0, 10_000], [100_000, 50_000]];
    const short = arrowAttackDirectionTailed(coords, { swallowTailFactor: 0.5 });
    const long = arrowAttackDirectionTailed(coords, { swallowTailFactor: 2 });
    const mid: CoordArray = [0, 5_000];
    expect(dist(long.at(-2)!, mid)).toBeGreaterThan(dist(short.at(-2)!, mid));
  });
});
