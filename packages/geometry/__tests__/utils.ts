import type { CoordArray } from '@vesium/shared';
import { expect } from 'vitest';

export function expectCoordArray(coords: unknown): asserts coords is CoordArray[] {
  expect(Array.isArray(coords)).toBe(true);
  (coords as CoordArray[]).forEach((coord) => {
    expect(Array.isArray(coord)).toBe(true);
    expect(coord.length).toBe(2);
    expect(typeof coord[0]).toBe('number');
    expect(typeof coord[1]).toBe('number');
    expect(Number.isFinite(coord[0])).toBe(true);
    expect(Number.isFinite(coord[1])).toBe(true);
  });
}
