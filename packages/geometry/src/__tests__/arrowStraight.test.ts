import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraight } from '../arrowStraight';
import { arrowStraightSharp } from '../arrowStraightSharp';
import { expectCoordArray, snapshotCoords } from './utils';

describe('arrowStraight', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowStraight([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraight([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should delegate to arrowStraightSharp with fixed options', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 0]];
    const before = snapshotCoords(coords);
    const result = arrowStraight(coords);
    const expected = arrowStraightSharp(coords, {
      tailWidthFactor: 0.05,
      neckWidthFactor: 0.1,
      headWidthFactor: 0.15,
      headAngle: Math.PI / 4,
      neckAngle: Math.PI * 0.17741,
    });

    expect(result).toHaveLength(7);
    expect(result).toEqual(expected);
    expect(result).not.toEqual(arrowStraightSharp(coords));
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });
});
