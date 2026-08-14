import { Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { area } from '../area';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    sampleTerrainMostDetailed: vi.fn(async () => [
      { longitude: 120, latitude: 30, height: 0 },
      { longitude: 120, latitude: 30, height: 0 },
      { longitude: 120, latitude: 30, height: 0 },
    ]),
  };
});

function fromDegrees(lng: number, lat: number, height = 0): Cartesian3 {
  return Cartesian3.fromDegrees(lng, lat, height);
}

describe('area', () => {
  it('calculates area of a triangle', async () => {
    const result = await area([
      new Cartesian3(0, 0, 0),
      new Cartesian3(3, 0, 0),
      new Cartesian3(3, 4, 0),
    ]);
    expect(result).toBeCloseTo(6, 5);
  });

  it('calculates area of a square in XY plane', async () => {
    const result = await area([
      new Cartesian3(0, 0, 0),
      new Cartesian3(10, 0, 0),
      new Cartesian3(10, 10, 0),
      new Cartesian3(0, 10, 0),
    ]);
    expect(result).toBeCloseTo(100, 5);
  });

  it('throws when positions length < 2', async () => {
    await expect(area([new Cartesian3(0, 0, 0)])).rejects.toThrow('positions.length must >= 2');
  });

  it('throws when density <= 0', async () => {
    await expect(area(
      [new Cartesian3(0, 0, 0), new Cartesian3(3, 4, 0)],
      { density: 0 },
    )).rejects.toThrow('options.density must > 0');
  });

  it('calculates area with clampToGround option', async () => {
    const scene = {
      clampToHeightMostDetailed: vi.fn(async (positions: Cartesian3[]) => positions),
      terrainProvider: {},
    } as any;
    const result = await area([
      fromDegrees(116, 39, 0),
      fromDegrees(116.003, 39, 0),
      fromDegrees(116.003, 39.003, 0),
      fromDegrees(116, 39.003, 0),
    ], {
      clampToGround: true,
      scene,
      density: 10,
    });
    expect(result).toBeGreaterThan(1e4);
    expect(Number.isFinite(result)).toBe(true);
  });
});
