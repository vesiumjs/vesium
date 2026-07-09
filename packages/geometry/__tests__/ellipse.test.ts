import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { ellipse } from '../src/ellipse';
import { FITTING_COUNT } from '../src/helper';
import { expectCoordArray } from './utils';

describe('ellipse', () => {
  it('should return FITTING_COUNT + 1 computed ellipse points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = ellipse(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    expect(coords.length).toBe(2);
  });

  it('should generate points forming an ellipse shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [20, 10],
    ];
    const result = ellipse(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    const center = [10, 5];
    const majorRadius = 10;
    const minorRadius = 5;
    result.forEach(([x, y]) => {
      const normalizedX = (x - center[0]) / majorRadius;
      const normalizedY = (y - center[1]) / minorRadius;
      const ellipseEquation = normalizedX ** 2 + normalizedY ** 2;
      expect(ellipseEquation).toBeCloseTo(1, 1);
    });
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => ellipse([])).toThrow('coords.length must >= 2');
    expect(() => ellipse([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [10, 10],
    ];
    const result = ellipse(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    expect(coords.length).toBe(2);
  });

  it('should handle radius 0 (identical points) by returning degenerate points at center', () => {
    const coords: CoordArray[] = [
      [5, 5],
      [5, 5],
    ];
    const result = ellipse(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach(([x, y]) => {
      expect(x).toBeCloseTo(5, 6);
      expect(y).toBeCloseTo(5, 6);
    });
  });

  it('should handle large coordinates', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [200000, 300000],
    ];
    const result = ellipse(coords);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = ellipse(coords);
    expectCoordArray(result);
  });
});
