import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { FITTING_COUNT } from '../helper';
import { sector } from '../sector';
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
    expect(() => sector([])).toThrow('coords.length must >= 3');
    expect(() => sector([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => sector([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should return valid coordinate arrays for collinear input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [20, 0],
    ];
    const result = sector(coords);
    expect(result.length).toBe(FITTING_COUNT + 3);
    expectCoordArray(result);
  });
});
