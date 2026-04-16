import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { ellipse } from '../src/ellipse';

describe('ellipse', () => {
  it('should return ellipse coordinates with valid input (2 points)', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 10],
    ];
    const inputCoords = [...coords];
    const result = ellipse(coords);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(coords.length).toBeGreaterThan(inputCoords.length);
  });

  it('should push FITTING_COUNT + 1 points to input array', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [20, 10],
    ];
    const originalLength = coords.length;
    ellipse(coords);

    expect(coords.length - originalLength).toBe(101);
  });

  it('should throw error when input has less than 2 points', () => {
    expect(() => ellipse([])).toThrow('coords.length must >= 2');
    expect(() => ellipse([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should handle coordinates with negative values', () => {
    const coords: CoordArray[] = [
      [-10, -10],
      [10, 10],
    ];
    const originalLength = coords.length;
    const result = ellipse(coords);

    expect(Array.isArray(result)).toBe(true);
    expect(coords.length - originalLength).toBe(101);
  });

  it('should handle coordinates with large values', () => {
    const coords: CoordArray[] = [
      [100000, 200000],
      [200000, 300000],
    ];
    const originalLength = coords.length;
    ellipse(coords);

    expect(coords.length - originalLength).toBe(101);
  });

  it('should generate points forming an ellipse shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [20, 10],
    ];
    const originalLength = coords.length;
    ellipse(coords);
    const ellipsePoints = coords.slice(originalLength);

    expect(ellipsePoints.length).toBe(101);

    const center = [10, 5];
    const majorRadius = 10;
    const minorRadius = 5;

    ellipsePoints.forEach(([x, y]) => {
      const normalizedX = (x - center[0]) / majorRadius;
      const normalizedY = (y - center[1]) / minorRadius;
      const ellipseEquation = normalizedX ** 2 + normalizedY ** 2;
      expect(ellipseEquation).toBeCloseTo(1, 1);
    });
  });
});
