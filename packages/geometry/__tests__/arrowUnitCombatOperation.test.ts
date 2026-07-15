import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowUnitCombatOperation } from '../src/arrowUnitCombatOperation';
import { dist, expectCoordArray, includesCoord, snapshotCoords } from './utils';

describe('arrowUnitCombatOperation', () => {
  it('should throw when input has less than 2 points', () => {
    expect(() => arrowUnitCombatOperation([])).toThrow('coords.length must >= 2');
    expect(() => arrowUnitCombatOperation([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should keep tip and not mutate input', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 50_000]];
    const before = snapshotCoords(coords);
    const result = arrowUnitCombatOperation(coords);

    expect(includesCoord(result, [100_000, 50_000])).toBe(true);
    expect(coords).toEqual(before);
    expectCoordArray(result);
  });

  it('should enlarge tail width when tailWidthFactor increases', () => {
    const coords: CoordArray[] = [[0, 0], [100_000, 0]];
    const thin = arrowUnitCombatOperation(coords, { tailWidthFactor: 0.05 });
    const fat = arrowUnitCombatOperation(coords, { tailWidthFactor: 0.2 });
    expect(dist(fat[0], fat.at(-1)!)).toBeGreaterThan(dist(thin[0], thin.at(-1)!));
  });
});
