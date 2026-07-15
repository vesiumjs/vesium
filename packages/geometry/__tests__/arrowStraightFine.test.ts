import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraightFine } from '../src/arrowStraightFine';
import { dist, expectCoordArray, snapshotCoords } from './utils';

describe('arrowStraightFine', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowStraightFine([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraightFine([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return 5-point arrow with equal wing length and no mutation', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 0]];
    const before = snapshotCoords(coords);
    const result = arrowStraightFine(coords);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([100_000, 0]);
    expect(result[3]).toEqual(result[1]);
    expect(dist(result[1], result[2])).toBeCloseTo(20_000, 5);
    expect(dist(result[1], result[4])).toBeCloseTo(20_000, 5);
    expect(result[2][1]).toBeCloseTo(-result[4][1], 5);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should clamp wing length to max arrow length', () => {
    const result = arrowStraightFine([[0, 0], [100_000_000, 0]]);
    expect(dist(result[1], result[2])).toBeCloseTo(3_000_000, 3);
    expect(dist(result[1], result[4])).toBeCloseTo(3_000_000, 3);
  });
});
