import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { curve } from '../src/curve';

describe('curve', () => {
  it('should return an array of coordinates with valid input (3 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = curve(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return more points than input (interpolated curve)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = curve(coords);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should throw error when input has less than 3 points', () => {
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
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(coords.length);
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [0, 10],
      [10, -10],
    ];
    const result = curve(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return coordinates in [x, y] format', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = curve(coords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle collinear points', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 10],
    ];
    const result = curve(coords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle large coordinate values', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [150000, 250000],
      [200000, 200000],
    ];
    const result = curve(coords);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle coordinates with decimal values', () => {
    const coords: CoordArray[] = [
      [0.5, 1.5],
      [2.5, 3.5],
      [4.5, 0.5],
    ];
    const result = curve(coords);
    expect(Array.isArray(result)).toBe(true);
  });
});
