import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraight } from '../src/arrowStraight';
import { expectCoordArray } from './utils';

describe('arrowStraight', () => {
  it('should return 7 points for a standard arrow shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowStraight([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraight([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle vertical arrow direction', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 100000],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should handle large distance coordinates', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [1000000, 1000000],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should handle degenerate zero distance', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = arrowStraight(coords);
    expect(result.length).toBe(7);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraight(coords);
    expectCoordArray(result);
  });
});
