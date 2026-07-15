import { Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { lerpArray } from '../lerpArray';

describe('lerpArray', () => {
  it('returns start, interpolated points, and end', async () => {
    const result = await lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(10, 0, 0),
      count: 2,
    });

    expect(result).toHaveLength(3);
    expect(result.map(item => item.x)).toEqual([0, 5, 10]);
    expect(result[0]).not.toBe(result[2]);
  });

  it('returns count + 1 points', async () => {
    const result = await lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(4, 0, 0),
      count: 4,
    });

    expect(result).toHaveLength(5);
    expect(result.map(item => item.x)).toEqual([0, 1, 2, 3, 4]);
  });

  it('throws when count <= 0', async () => {
    await expect(lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(1, 0, 0),
      count: 0,
    })).rejects.toThrow('options.count must > 0');
  });

  it('throws when clampToGround is true without scene', async () => {
    await expect(lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(1, 0, 0),
      count: 2,
      clampToGround: true,
    })).rejects.toThrow('scene is required on `clampToGround == true`.');
  });

  it('clamps interpolated points when clampToGround is true', async () => {
    const scene = {
      clampToHeightMostDetailed: vi.fn(async (positions: Cartesian3[]) =>
        positions.map(item => new Cartesian3(item.x, item.y, 10))),
      terrainProvider: {},
    } as any;

    const result = await lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(10, 0, 0),
      count: 2,
      clampToGround: true,
      scene,
    });

    expect(result).toHaveLength(3);
    expect(result.every(item => item.z === 10)).toBe(true);
    expect(scene.clampToHeightMostDetailed).toHaveBeenCalled();
  });
});
