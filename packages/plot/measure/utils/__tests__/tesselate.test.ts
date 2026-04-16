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
  });

  it('returned triangle points are clones of original positions', () => {
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(1, 0, 0);
    const p2 = new Cartesian3(0, 1, 0);

    const result = tesselate([p0, p1, p2]);

    // Verify they are clones (different references)
    expect(result[0][0]).not.toBe(p0);
    expect(result[0][1]).not.toBe(p1);
    expect(result[0][2]).not.toBe(p2);
  });

  it('tesselates a square into triangles', () => {
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(10, 0, 0);
    const p2 = new Cartesian3(10, 10, 0);
    const p3 = new Cartesian3(0, 10, 0);

    const result = tesselate([p0, p1, p2, p3]);

    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach((triangle) => {
      expect(triangle).toHaveLength(3);
      triangle.forEach((point) => {
        expect(point instanceof Cartesian3).toBe(true);
      });
    });
  });

  it('tesselates a polygon with more than 4 vertices', () => {
    // Pentagon
    const positions = [
      new Cartesian3(0, 0, 0),
      new Cartesian3(5, 0, 0),
      new Cartesian3(10, 5, 0),
      new Cartesian3(5, 10, 0),
      new Cartesian3(0, 5, 0),
    ];

    const result = tesselate(positions);

    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach((triangle) => {
      expect(triangle).toHaveLength(3);
    });
  });

  it('throws when positions length < 3', () => {
    expect(() => tesselate([new Cartesian3(0, 0, 0)])).toThrow(
      'positions must >= 3',
    );
  });

  it('throws when positions is empty', () => {
    expect(() => tesselate([])).toThrow('positions must >= 3');
  });

  it('tesselates a hexagon', () => {
    // Regular hexagon centered at origin
    const radius = 10;
    const positions: Cartesian3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      positions.push(new Cartesian3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }

    const result = tesselate(positions);

    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(10); // Should be a reasonable number
  });

  it('handles positions with different Z values', () => {
    const positions = [
      new Cartesian3(0, 0, 0),
      new Cartesian3(10, 0, 1),
      new Cartesian3(10, 10, 2),
      new Cartesian3(0, 10, 1),
    ];

    const result = tesselate(positions);

    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
