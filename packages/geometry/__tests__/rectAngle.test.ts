import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { rectAngle } from '../src/rectAngle';
import { expectCoordArray } from './utils';

describe('rectAngle', () => {
  it('should return 5 coordinates forming a closed rectangle', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result.length).toBe(5);
  });

  it('should return correct corner coordinates in order', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([0, 10]);
    expect(result[2]).toEqual([10, 10]);
    expect(result[3]).toEqual([10, 0]);
    expect(result[4]).toEqual([0, 0]);
  });

  it('should produce correct corners for non-square rectangle', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 20],
    ];
    const result = rectAngle(coords);
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([0, 20]);
    expect(result[2]).toEqual([10, 20]);
    expect(result[3]).toEqual([10, 0]);
    expect(result[4]).toEqual([0, 0]);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => rectAngle([])).toThrow('coords.length must >= 2');
    expect(() => rectAngle([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle negative coordinates', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expect(result.length).toBe(5);
  });

  it('should handle identical start and end points (degenerate)', () => {
    const coords: CoordArray[] = [
      [5, 5],
      [5, 5],
    ];
    const result = rectAngle(coords);
    expect(result.length).toBe(5);
    result.forEach((coord) => {
      expect(coord[0]).toBeCloseTo(5, 6);
      expect(coord[1]).toBeCloseTo(5, 6);
    });
  });

  it('should only use the first two coordinates from input', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
      [50, 50],
    ];
    const result = rectAngle(coords);
    expect(result[0]).toEqual([0, 0]);
    expect(result[2]).toEqual([10, 10]);
  });

  it('should return valid coordinate arrays', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const result = rectAngle(coords);
    expectCoordArray(result);
  });
});
