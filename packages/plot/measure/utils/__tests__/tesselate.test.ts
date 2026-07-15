import { Cartesian3 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { tesselate } from '../tesselate';

describe('tesselate', () => {
  it('returns a single triangle when given exactly 3 positions', () => {
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(1, 0, 0);
    const p2 = new Cartesian3(0, 1, 0);
    const result = tesselate([p0, p1, p2]);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(3);
    expect(result[0][0]).not.toBe(p0);
  });

  it('tesselates a square into triangles', () => {
    const result = tesselate([
      new Cartesian3(0, 0, 0),
      new Cartesian3(10, 0, 0),
      new Cartesian3(10, 10, 0),
      new Cartesian3(0, 10, 0),
    ]);
    expect(result.length).toBeGreaterThanOrEqual(2);
    result.forEach(triangle => expect(triangle).toHaveLength(3));
  });

  it('throws when positions length < 3', () => {
    expect(() => tesselate([new Cartesian3(0, 0, 0)])).toThrow('positions must >= 3');
  });
});
