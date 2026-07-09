import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { closedCurve } from '../src/closedCurve';
import { expectCoordArray } from './utils';

describe('closedCurve', () => {
  it('should return many interpolated points for a smooth closed curve', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
    expectCoordArray(result);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => closedCurve([])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[5, 5]])).toThrow('coords.length must >= 3');
    expect(() => closedCurve([[0, 0], [10, 10]])).toThrow('coords.length must >= 3');
  });

  it('should handle input with 4 or more points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 5],
      [15, 0],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [0, 10],
      [10, -10],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should close the curve (last point approximately equals first point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = closedCurve(coords);
    const first = result[0];
    const last = result.at(-1)!;
    expect(first[0]).toBeCloseTo(last[0], 3);
    expect(first[1]).toBeCloseTo(last[1], 3);
  });

  it('should handle collinear points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 10],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [150000, 250000],
      [200000, 200000],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle decimal coordinates', () => {
    const coords: CoordArray[] = [
      [0.5, 1.5],
      [2.5, 3.5],
      [4.5, 0.5],
    ];
    const result = closedCurve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = closedCurve(coords);
    expectCoordArray(result);
  });
});
