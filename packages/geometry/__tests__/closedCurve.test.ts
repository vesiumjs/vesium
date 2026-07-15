import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { closedCurve } from '../src/closedCurve';
import { expectCoordArray } from './utils';

describe('closedCurve', () => {
  it('should return many interpolated points for a smooth closed curve', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
    expectCoordArray(result);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => closedCurve([])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should close the curve without mutating input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const snapshot = coords.map(item => [...item] as CoordArray);
    const result = closedCurve(coords);
    const first = result[0];
    const last = result.at(-1)!;
    expect(first[0]).toBeCloseTo(last[0], 3);
    expect(first[1]).toBeCloseTo(last[1], 3);
    expect(coords).toEqual(snapshot);
    expect(coords).toHaveLength(3);
  });
});
