import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraightSharp } from '../src/arrowStraightSharp';
import { dist, expectCoordArray, snapshotCoords } from './utils';

describe('arrowStraightSharp', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowStraightSharp([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraightSharp([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return 7-point arrow with tip at end and y-symmetry', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 0]];
    const before = snapshotCoords(coords);
    const result = arrowStraightSharp(coords);

    expect(result).toHaveLength(7);
    expect(result[3]).toEqual([100_000, 0]);
    expect(result[0][1]).toBeCloseTo(-result[6][1], 5);
    expect(result[1][1]).toBeCloseTo(-result[5][1], 5);
    expect(result[2][1]).toBeCloseTo(-result[4][1], 5);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should enlarge tail/head width when width factors increase', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 0]];
    const narrow = arrowStraightSharp(coords, {
      tailWidthFactor: 0.05,
      headWidthFactor: 0.1,
    });
    const wide = arrowStraightSharp(coords, {
      tailWidthFactor: 0.2,
      headWidthFactor: 0.4,
    });

    expect(dist(wide[0], wide[6])).toBeGreaterThan(dist(narrow[0], narrow[6]));
    expect(dist(wide[2], wide[4])).toBeGreaterThan(dist(narrow[2], narrow[4]));
  });
});
