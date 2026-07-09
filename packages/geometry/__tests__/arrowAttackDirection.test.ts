import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowAttackDirection } from '../src/arrowAttackDirection';
import { expectCoordArray } from './utils';

describe('arrowAttackDirection', () => {
  it('should return coordinates with valid 3-point input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => arrowAttackDirection([])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowAttackDirection([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle degenerate input (all same points) without throwing', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
      [0, 0],
    ];
    const result = arrowAttackDirection(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should accept custom options', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords, {
      headWidthFactor: 0.35,
      headHeightFactor: 0.2,
      neckWidthFactor: 0.18,
      neckHeightFactor: 0.88,
      tailWidthFactor: 0.12,
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [50000, 25000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowAttackDirection(coords);
    if (result.length > 0) {
      expectCoordArray(result);
    }
  });
});
