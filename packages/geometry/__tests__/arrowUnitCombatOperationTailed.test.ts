import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowUnitCombatOperationTailed } from '../src/arrowUnitCombatOperationTailed';
import { expectCoordArray } from './utils';

describe('arrowUnitCombatOperationTailed', () => {
  it('should return coordinates with valid 2-point input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperationTailed(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowUnitCombatOperationTailed([])).toThrow('coords.length must >= 2');
    expect(() => arrowUnitCombatOperationTailed([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle degenerate input (identical points) without throwing', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = arrowUnitCombatOperationTailed(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should accept custom options with swallowTailFactor', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperationTailed(coords, {
      headWidthFactor: 0.35,
      headHeightFactor: 0.2,
      neckWidthFactor: 0.18,
      neckHeightFactor: 0.88,
      tailWidthFactor: 0.15,
      swallowTailFactor: 1.2,
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle zero swallowTailFactor', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperationTailed(coords, {
      swallowTailFactor: 0,
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle input with 3 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [50000, 25000],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperationTailed(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperationTailed(coords);
    if (result.length > 0) {
      expectCoordArray(result);
    }
  });
});
