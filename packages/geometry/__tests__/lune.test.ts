import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import { lune } from '../src/lune';

describe('lune', () => {
  it('should throw error when input has less than 2 points', () => {
    expect(() => lune([])).toThrow('coords.length must >= 2');
    expect(() => lune([[5, 5]])).toThrow('coords.length must >= 2');
  });

  it('should close the shape', () => {
    const coords: CoordArray[] = [
      [0, 0],
      [10, 0],
    ];
    const result = lune(coords);
    const first = result[0];
    const last = result.at(-1)!;
    expect(first[0]).toBeCloseTo(last[0], 5);
    expect(first[1]).toBeCloseTo(last[1], 5);
  });
});
