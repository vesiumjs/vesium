import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { sector } from '../src/sector';

describe('sector', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return 103 points (101 arc points + center + first point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    // getArcCoords returns 101 points, then push center and pList[0] = 101 + 2 = 103
    expect(result.length).toBe(103);
  });

  it('should close the sector shape (last point should equal first point)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [5, 5],
    ];
    const result = sector(coords);
    const first = result[0];
    const last = result.at(-1);
    expect(first[0]).toBeCloseTo(last[0], 5);
    expect(first[1]).toBeCloseTo(last[1], 5);
  });

  it('should throw error when input has less than 3 points', () => {
    expect(() => sector([])).toThrow('coords.length must >= 2');
    expect(() => sector([[5, 5]])).toThrow('coords.length must >= 2');
    expect(() => sector([[0, 0], [10, 10]])).toThrow('coords.length must >= 2');
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-5, -5],
      [5, -5],
      [-5, 5],
    ];
    const result = sector(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should include the center point in the result', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    // Center is at index 101 (after 101 arc points, center pushed at 101)
    const centerInResult = result[101];
    expect(centerInResult[0]).toBeCloseTo(0, 5);
    expect(centerInResult[1]).toBeCloseTo(0, 5);
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 100000],
      [200000, 100000],
      [100000, 200000],
    ];
    const result = sector(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(103);
  });

  it('should handle coordinates with decimal values', () => {
    const coords: CoordArray[] = [
      [0.5, 0.5],
      [10.5, 0.5],
      [0.5, 10.5],
    ];
    const result = sector(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
      [0, 10],
    ];
    const result = sector(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });
});
