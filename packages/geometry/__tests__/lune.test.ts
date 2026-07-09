import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { FITTING_COUNT } from '../src/helper';
import { lune } from '../src/lune';
import { expectCoordArray } from './utils';

describe('lune', () => {
  it('should return FITTING_COUNT + 2 points (arc + closing point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
  });

  it('should have last point equal to first point (closed shape)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    const first = result[0];
    const last = result.at(-1)!;
    expect(first[0]).toBeCloseTo(last[0], 5);
    expect(first[1]).toBeCloseTo(last[1], 5);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => lune([])).toThrow('coords.length must >= 2');
    expect(() => lune([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle input with 3 points (uses them directly)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
  });

  it('should handle collinear points (3 points on same line)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [20, 0],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
  });

  it('should handle identical points (radius 0 degeneracy)', () => {
    const coords: CoordArray[] = [
      [5, 5],
      [5, 5],
    ];
    const result = lune(coords);
    expect(result.length).toBe(FITTING_COUNT + 2);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    expectCoordArray(result);
  });
});
