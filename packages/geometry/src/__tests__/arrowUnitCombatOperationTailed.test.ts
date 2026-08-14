import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowUnitCombatOperationTailed } from '../arrowUnitCombatOperationTailed';
import { expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowUnitCombatOperationTailed', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowUnitCombatOperationTailed([])).toThrow('coords.length must >= 2');
    expect(() => arrowUnitCombatOperationTailed([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should include the tip and not mutate input', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 50_000]];
    const before = snapshotCoords(coords);
    const result = arrowUnitCombatOperationTailed(coords);

    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });
});
