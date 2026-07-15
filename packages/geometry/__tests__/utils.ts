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

export function snapshotCoords(coords: CoordArray[]): CoordArray[] {
  return coords.map(item => [item[0], item[1]] as CoordArray);
}

export function dist(a: CoordArray, b: CoordArray): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function includesCoord(poly: CoordArray[], point: CoordArray, eps = 1e-6): boolean {
  return poly.some(item => Math.abs(item[0] - point[0]) < eps && Math.abs(item[1] - point[1]) < eps);
}
