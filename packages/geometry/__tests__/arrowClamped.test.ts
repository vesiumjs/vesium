import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowClamped } from '../src/arrowClamped';
import { dist, expectCoordArray, includesCoord, snapshotCoords } from './utils';

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

  it('should build the pincer from two arrow heads and three bezier bodies', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10_000],
      [100_000, 50_000],
    ];
    const result = arrowClamped(coords);
    // 3 bezier bodies of 101 points each + 2 arrow heads of 5 points each
    expect(result.length).toBe(3 * 101 + 2 * 5);
    // the left arrow head ends at the attack tip
    const tipIndex = result.findIndex(p => Math.abs(p[0] - 100_000) < 1 && Math.abs(p[1] - 50_000) < 1);
    expect(tipIndex).toBeGreaterThan(1);
    expect(tipIndex).toBeLessThan(result.length - 1);
    // the head is symmetric: headLeft and headRight are equally far from the tip
    expect(dist(result[tipIndex - 1], result[tipIndex])).toBeCloseTo(dist(result[tipIndex + 1], result[tipIndex]), 3);
    expect(dist(result[tipIndex - 1], result[tipIndex])).toBeGreaterThan(0);
  });
});
