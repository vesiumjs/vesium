import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { arrowClamped } from '../src/arrowClamped';
import { expectCoordArray } from './utils';

describe('arrowClamped', () => {
  it('should return coordinates with valid 3-point input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expect(result.length).toBeGreaterThan(0);
    expectCoordArray(result);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => arrowClamped([])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => arrowClamped([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle input with 4 points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
      [100000, 0],
    ];
    const result = arrowClamped(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle input with 5 points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
      [100000, 0],
      [50000, 25000],
    ];
    const result = arrowClamped(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle clockwise point order', () => {
    const coords: CoordArray[] = [
      [0, 10000],
      [0, 0],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle degenerate collinear 3rd and 4th points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [0, 20000],
    ];
    const result = arrowClamped(coords);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [0, 10000],
      [100000, 50000],
    ];
    const result = arrowClamped(coords);
    expectCoordArray(result);
  });
});
