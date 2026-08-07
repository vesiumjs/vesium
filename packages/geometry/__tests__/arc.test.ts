import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arc } from '../src/arc';
import { FITTING_COUNT, getCircleCenterOfThreeCoords } from '../src/helper';
import { expectCoordArray } from './utils';

describe('arc', () => {
  it('should throw error when input has 2 or fewer points', () => {
    expect(() => arc([])).toThrow('coords.length must >= 3');
    expect(() => arc([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arc([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return FITTING_COUNT + 1 interpolated points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    expectCoordArray(result);
  });

  it('should draw the arc through the input points on their circle', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = arc(coords);
    // the arc starts at the second input point and ends at the first (not closed)
    expect(result[0][0]).toBeCloseTo(1, 5);
    expect(result[0][1]).toBeCloseTo(0, 5);
    expect(result.at(-1)![0]).toBeCloseTo(0, 5);
    expect(result.at(-1)![1]).toBeCloseTo(0, 5);
    expect(Math.hypot(result[0][0] - result.at(-1)![0], result[0][1] - result.at(-1)![1])).toBeGreaterThan(0.5);
    // all points lie on the circle through the three input points
    const center = getCircleCenterOfThreeCoords([0, 0], [1, 0], [0, 1]);
    const radius = Math.hypot(center[0], center[1]);
    result.forEach(([x, y]) => {
      expect(Math.hypot(x - center[0], y - center[1])).toBeCloseTo(radius, 3);
    });
    // the middle input point (0,1) lies on the arc (nearest sample is ~0.011 away)
    const nearest = result.reduce((min, [x, y]) => Math.min(min, Math.hypot(x, y - 1)), Infinity);
    expect(nearest).toBeLessThan(0.02);
  });
});
