import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { FITTING_COUNT } from '../src/helper';
import { sector } from '../src/sector';
import { expectCoordArray } from './utils';

describe('sector', () => {
  it('should return 103 points (FITTING_COUNT+1 arc + center + first point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
  });

  it('should close the sector shape (last point equals first)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = sector(coords);
    const first = result[0];
    const last = result.at(-1)!;
    expect(first[0]).toBeCloseTo(last[0], 5);
    expect(first[1]).toBeCloseTo(last[1], 5);
  });

  it('should include the center point at index FITTING_COUNT+1', () => {
    const center: CoordArray = [0, 0];
    const coords: CoordArray[] = [
      center,
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    const centerInResult = result[FITTING_COUNT + 1];
    expect(centerInResult[0]).toBeCloseTo(center[0], 5);
    expect(centerInResult[1]).toBeCloseTo(center[1], 5);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => sector([])).toThrow('coords.length must >= 2');
    expect(() => sector([[5, 5]])).toThrow('coords.length must >= 2');
    expect(() => sector([[0, 0], [10, 10]])).toThrow('coords.length must >= 2');
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-5, -5],
      [5, -5],
      [-5, 5],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
  });

  it('should handle collinear points (angle 0)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [20, 0],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
    expectCoordArray(result);
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 100000],
      [200000, 100000],
      [100000, 200000],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
  });

  it('should handle decimal coordinates', () => {
    const coords: CoordArray[] = [
      [0.5, 0.5],
      [10.5, 0.5],
      [0.5, 10.5],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    expectCoordArray(result);
  });
});
