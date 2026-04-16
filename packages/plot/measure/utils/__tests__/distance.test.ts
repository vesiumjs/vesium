import { Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { distance } from '../distance';

const mocks = vi.hoisted(() => ({
  sampleTerrainMostDetailed: vi.fn(async () => [
    { longitude: 120, latitude: 30, height: 0 },
    { longitude: 120, latitude: 30, height: 0 },
    { longitude: 120, latitude: 30, height: 0 },
  ]),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    sampleTerrainMostDetailed: mocks.sampleTerrainMostDetailed,
  };
});

describe('distance', () => {
  it('calculates distance between two points', async () => {
    const start = new Cartesian3(0, 0, 0);
    const end = new Cartesian3(3, 4, 0);

    const result = await distance([start, end]);

    expect(result.stages).toHaveLength(1);
    expect(result.stages[0]).toBe(5);
    expect(result.count).toBe(5);
  });

  it('calculates distance across multiple points', async () => {
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(3, 0, 0);
    const p2 = new Cartesian3(3, 4, 0);

    const result = await distance([p0, p1, p2]);

    // 3 + 4 = 7
    expect(result.stages).toHaveLength(2);
    expect(result.stages[0]).toBe(3);
    expect(result.stages[1]).toBe(4);
    expect(result.count).toBe(7);
  });

  it('throws when positions length < 2', async () => {
    await expect(distance([new Cartesian3(0, 0, 0)])).rejects.toThrow(
      'positions.length must >= 2',
    );
  });

  it('throws when positions is empty', async () => {
    await expect(distance([])).rejects.toThrow('positions.length must >= 2');
  });

  it('throws when density <= 0 with clampToGround enabled', async () => {
    const scene = {} as any;
    await expect(
      distance(
        [new Cartesian3(0, 0, 0), new Cartesian3(3, 4, 0)],
        { clampToGround: true, density: 0, scene },
      ),
    ).rejects.toThrow('options.density must > 0');
  });

  it('returns correct stages count equal to positions.length - 1', async () => {
    const positions = [
      new Cartesian3(0, 0, 0),
      new Cartesian3(1, 0, 0),
      new Cartesian3(2, 0, 0),
      new Cartesian3(3, 0, 0),
    ];

    const result = await distance(positions);

    expect(result.stages).toHaveLength(3);
    expect(result.count).toBe(3);
  });

  it('all stage distances are positive numbers', async () => {
    const positions = [
      new Cartesian3(100, 200, 300),
      new Cartesian3(150, 250, 350),
      new Cartesian3(200, 300, 400),
    ];

    const result = await distance(positions);

    result.stages.forEach((stage) => {
      expect(stage).toBeGreaterThan(0);
    });
    expect(result.count).toBeGreaterThan(0);
  });

  it('calculates total count as sum of all stages', async () => {
    const positions = [
      new Cartesian3(0, 0, 0),
      new Cartesian3(5, 0, 0),
      new Cartesian3(5, 12, 0),
    ];

    const result = await distance(positions);

    const stagesSum = result.stages.reduce((sum, current) => sum + current, 0);
    expect(result.count).toBe(stagesSum);
  });
});
