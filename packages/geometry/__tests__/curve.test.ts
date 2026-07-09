import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { curve } from '../src/curve';
import { expectCoordArray } from './utils';

describe('curve', () => {
  it('should return more points than input (interpolated curve)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
    expectCoordArray(result);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => curve([])).toThrow('coords.length must >= 2');
    expect(() => curve([[5, 5]])).toThrow('coords.length must >= 2');
    expect(() => curve([[0, 0], [10, 10]])).toThrow('coords.length must >= 2');
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [3, 8],
      [7, 8],
      [10, 0],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [0, 10],
      [10, -10],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle collinear points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 10],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [150000, 250000],
      [200000, 200000],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle decimal coordinates', () => {
    const coords: CoordArray[] = [
      [0.5, 1.5],
      [2.5, 3.5],
      [4.5, 0.5],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = curve(coords);
    expectCoordArray(result);
  });
});
