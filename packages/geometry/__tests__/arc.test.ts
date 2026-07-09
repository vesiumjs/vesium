import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arc } from '../src/arc';
import { FITTING_COUNT } from '../src/helper';
import { expectCoordArray } from './utils';

describe('arc', () => {
  it('should return FITTING_COUNT + 1 interpolated points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    expectCoordArray(result);
  });

  it('should throw error when input has 2 or fewer points', () => {
    expect(() => arc([])).toThrow('coords.length must >= 3');
    expect(() => arc([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arc([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, 0],
      [0, 10],
      [10, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle collinear points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 0],
      [10, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle reversed point order', () => {
    const coords: CoordArray[] = [
      [10, 0],
      [5, 10],
      [0, 0],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle startAngle nearly equal to endAngle (degenerate arc)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0.001],
    ];
    const result = arc(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    expect(typeof result[0][0]).toBe('number');
    expect(typeof result[0][1]).toBe('number');
    expect(Number.isFinite(result[0][0])).toBe(true);
    expect(Number.isFinite(result[0][1])).toBe(true);
  });
});
