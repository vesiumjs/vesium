import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraightFine } from '../src/arrowStraightFine';
import { expectCoordArray } from './utils';

describe('arrowStraightFine', () => {
  it('should return 5 points for a fine arrow shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightFine(coords);
    expect(result.length).toBe(5);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowStraightFine([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraightFine([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should produce different coordinates for different distances', () => {
    const coords1: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const coords2: CoordArray[] = [
      [0, 0],
      [200000, 0],
    ];
    const result1 = arrowStraightFine(coords1);
    const result2 = arrowStraightFine(coords2);
    // The left/right wing coordinates should differ
    const diff = Math.hypot(result1[2][0] - result2[2][0], result1[2][1] - result2[2][1]);
    expect(diff).toBeGreaterThan(0);
  });

  it('should handle vertical direction', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 100000],
    ];
    const result = arrowStraightFine(coords);
    expect(result.length).toBe(5);
  });

  it('should handle degenerate zero distance', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = arrowStraightFine(coords);
    expect(result.length).toBe(5);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightFine(coords);
    expectCoordArray(result);
  });
});
