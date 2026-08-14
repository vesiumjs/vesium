import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import {
  arrowAttackDirection,
  getArrowBodyCoords,
  getArrowHeadCoords,
} from '../arrowAttackDirection';
import { dist, expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowAttackDirection', () => {
  it('should throw when input has less than 3 points', () => {
    expect(() => arrowAttackDirection([])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should keep tip and tail endpoints without mutating input', () => {
    const coords: CoordArray[] = [[0, 0], [0, 10_000], [100_000, 50_000]];
    const before = snapshotCoords(coords);
    const result = arrowAttackDirection(coords);

    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(includesCoord([result[0], result.at(-1)!], [0, 0])).toBe(true);
    expect(includesCoord([result[0], result.at(-1)!], [0, 10_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should normalize clockwise tail endpoints to the same orientation', () => {
    const ccw = arrowAttackDirection([[0, 0], [0, 10_000], [100_000, 50_000]]);
    const cw = arrowAttackDirection([[0, 10_000], [0, 0], [100_000, 50_000]]);
    expect(cw[0]).toEqual(ccw[0]);
    expect(cw.at(-1)).toEqual(ccw.at(-1));
  });

  describe('getArrowHeadCoords', () => {
    // Prefer a bent bone path; near-collinear shafts can hit azimuth edge cases.
    const bone: CoordArray[] = [[0, 0], [40_000, 30_000], [100_000, 20_000]];

    it('should return 5-point head with tip at the last bone point', () => {
      const head = getArrowHeadCoords(bone, {
        tailLeft: [0, -5_000],
        tailRight: [0, 5_000],
      });
      expect(head).toHaveLength(5);
      expect(head[2]).toEqual([100_000, 20_000]);
      expectCoordArray(head);
    });

    it('should enlarge head width when headWidthFactor increases', () => {
      const options = { tailLeft: [0, -5_000] as CoordArray, tailRight: [0, 5_000] as CoordArray };
      const narrow = getArrowHeadCoords(bone, { ...options, headWidthFactor: 0.2 });
      const wide = getArrowHeadCoords(bone, { ...options, headWidthFactor: 0.5 });
      expect(dist(wide[1], wide[3])).toBeGreaterThan(dist(narrow[1], narrow[3]));
    });
  });

  describe('getArrowBodyCoords', () => {
    it('should return two body points for one interior vertex', () => {
      const bone: CoordArray[] = [[0, 0], [40_000, 30_000], [100_000, 20_000]];
      const head = getArrowHeadCoords(bone, {
        tailLeft: [0, -5_000],
        tailRight: [0, 5_000],
      });
      const body = getArrowBodyCoords(bone, head[0], head[4], 0.1);
      expect(body).toHaveLength(2);
      expectCoordArray(body);
    });
  });
});
