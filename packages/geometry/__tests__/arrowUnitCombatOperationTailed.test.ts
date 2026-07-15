import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowUnitCombatOperationTailed } from '../src/arrowUnitCombatOperationTailed';
import { expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowUnitCombatOperationTailed', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowUnitCombatOperationTailed([])).toThrow('coords.length must >= 2');
    expect(() => arrowUnitCombatOperationTailed([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should return a closed polygon with tip present and no mutation', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 50_000]];
    const before = snapshotCoords(coords);
    const result = arrowUnitCombatOperationTailed(coords);

    expect(result.length).toBeGreaterThan(0);
    expect(result.at(-1)).toEqual(result[0]);
    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });
});
