import { Cartesian3 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { distance } from '../distance';

describe('distance', () => {
  it('calculates distance between two points', async () => {
    const result = await distance([new Cartesian3(0, 0, 0), new Cartesian3(3, 4, 0)]);
    expect(result.stages).toEqual([5]);
    expect(result.count).toBe(5);
  });

  it('calculates distance across multiple points', async () => {
    const result = await distance([
      new Cartesian3(0, 0, 0),
      new Cartesian3(3, 0, 0),
      new Cartesian3(3, 4, 0),
    ]);
    expect(result.stages).toEqual([3, 4]);
    expect(result.count).toBe(7);
  });

  it('throws when positions length < 2', async () => {
    await expect(distance([new Cartesian3(0, 0, 0)])).rejects.toThrow('positions.length must >= 2');
  });

  it('throws when density <= 0 with clampToGround enabled', async () => {
    await expect(distance(
      [new Cartesian3(0, 0, 0), new Cartesian3(3, 4, 0)],
      { clampToGround: true, density: 0, scene: {} as any },
    )).rejects.toThrow('options.density must > 0');
  });

  it('calculates total count as sum of all stages', async () => {
    const result = await distance([
      new Cartesian3(0, 0, 0),
      new Cartesian3(5, 0, 0),
      new Cartesian3(5, 12, 0),
    ]);
    expect(result.count).toBe(result.stages.reduce((sum, current) => sum + current, 0));
  });
});
