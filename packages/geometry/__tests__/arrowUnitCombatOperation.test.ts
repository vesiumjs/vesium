import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowUnitCombatOperation } from '../src/arrowUnitCombatOperation';
import { expectCoordArray } from './utils';

describe('arrowUnitCombatOperation', () => {
  it('should return coordinates with valid 2-point input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperation(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowUnitCombatOperation([])).toThrow('coords.length must >= 2');
    expect(() => arrowUnitCombatOperation([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle degenerate input (identical points) without throwing', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = arrowUnitCombatOperation(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should accept custom options', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperation(coords, {
      headWidthFactor: 0.35,
      headHeightFactor: 0.2,
      neckWidthFactor: 0.18,
      neckHeightFactor: 0.88,
      tailWidthFactor: 0.15,
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle input with 3 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [50000, 25000],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperation(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowUnitCombatOperation(coords);
    if (result.length > 0) {
      expectCoordArray(result);
    }
  });
});
