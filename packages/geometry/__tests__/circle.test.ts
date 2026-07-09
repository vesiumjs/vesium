import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { circle } from '../src/circle';
import { FITTING_COUNT } from '../src/helper';
import { expectCoordArray } from './utils';

describe('circle', () => {
  it('should return FITTING_COUNT + 1 points for 2-point input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should return points at distance radius from center', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach((coord) => {
      const dist = Math.hypot(coord[0], coord[1]);
      expect(dist).toBeCloseTo(10, 5);
    });
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => circle([])).toThrow('coords.length must >= 2');
    expect(() => circle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle negative center', () => {
    const coords: CoordArray[] = [
      [-5, -5],
      [5, -5],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle radius 0 (identical points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach(([x, y]) => {
      expect(x).toBeCloseTo(0, 6);
      expect(y).toBeCloseTo(0, 6);
    });
  });

  it('should handle large radius values', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [100000, 0],
    ];
    const result = circle(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = circle(coords);
    expectCoordArray(result);
  });
});
