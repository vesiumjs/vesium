import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { ellipse } from '../ellipse';
import { FITTING_COUNT } from '../helper';

describe('ellipse', () => {
  it('should throw error when input has less than 2 points', () => {
    expect(() => ellipse([])).toThrow('coords.length must >= 2');
    expect(() => ellipse([[5, 5]])).toThrow('coords.length must >= 2');
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
      expect(normalizedX ** 2 + normalizedY ** 2).toBeCloseTo(1, 1);
    });
  });

  it('should collapse to center when radii are 0', () => {
    const result = ellipse([[5, 5], [5, 5]]);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach(([x, y]) => {
      expect(x).toBeCloseTo(5, 6);
      expect(y).toBeCloseTo(5, 6);
    });
  });
});
