import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowStraightSharp } from '../src/arrowStraightSharp';
import { expectCoordArray } from './utils';

describe('arrowStraightSharp', () => {
  it('should return 7 points for a standard sharp arrow shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightSharp(coords);
    expect(result.length).toBe(7);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => arrowStraightSharp([])).toThrow('coords.length must >= 2');
    expect(() => arrowStraightSharp([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should accept custom options', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightSharp(coords, {
      tailWidthFactor: 0.15,
      neckWidthFactor: 0.25,
      headWidthFactor: 0.3,
      headAngle: Math.PI / 6,
      neckAngle: Math.PI / 10,
    });
    expect(result.length).toBe(7);
  });

  it('should handle zero tail/head width factors', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightSharp(coords, {
      tailWidthFactor: 0,
      headWidthFactor: 0,
      neckWidthFactor: 0,
    });
    expect(result.length).toBe(7);
  });

  it('should handle vertical direction', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 100000],
    ];
    const result = arrowStraightSharp(coords);
    expect(result.length).toBe(7);
  });

  it('should handle large distance coordinates', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [1000000, 1000000],
    ];
    const result = arrowStraightSharp(coords);
    expect(result.length).toBe(7);
  });

  it('should handle degenerate zero distance', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = arrowStraightSharp(coords);
    expect(result.length).toBe(7);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = arrowStraightSharp(coords);
    expectCoordArray(result);
  });
});
