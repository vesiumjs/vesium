import { Cartesian3, Math as CesiumMath, ClassificationType } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { clampToHeightMostDetailedByTilesetOrTerrain } from '../clampToGround';

const mocks = vi.hoisted(() => ({
  sampleTerrainMostDetailed: vi.fn(async () => [{ longitude: 120, latitude: 30, height: 999 }]),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    sampleTerrainMostDetailed: mocks.sampleTerrainMostDetailed,
  };
});

describe('clampToHeightMostDetailedByTilesetOrTerrain', () => {
  it('prefers tileset positions when both tileset and terrain return values', async () => {
    mocks.sampleTerrainMostDetailed.mockClear();
    const scene = {
      clampToHeightMostDetailed: vi.fn(async () => [new Cartesian3(1, 2, 3)]),
      terrainProvider: {},
    } as any;

    const result = await clampToHeightMostDetailedByTilesetOrTerrain({
      scene,
      positions: [new Cartesian3(0, 0, 0)],
      classificationType: ClassificationType.BOTH,
    });

    expect(result[0]).toEqual(expect.objectContaining({ x: 1, y: 2, z: 3 }));
    expect(mocks.sampleTerrainMostDetailed).toHaveBeenCalled();
  });

  it('falls back to terrain when tileset returns empty', async () => {
    mocks.sampleTerrainMostDetailed.mockResolvedValueOnce([
      { longitude: CesiumMath.toRadians(120), latitude: CesiumMath.toRadians(30), height: 50 },
    ] as any);
    const original = Cartesian3.fromDegrees(120, 30, 0);
    const scene = {
      clampToHeightMostDetailed: vi.fn(async () => []),
      terrainProvider: {},
    } as any;

    const result = await clampToHeightMostDetailedByTilesetOrTerrain({
      scene,
      positions: [original],
      classificationType: ClassificationType.BOTH,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).not.toBe(original);
    expect(Cartesian3.distance(result[0], Cartesian3.fromDegrees(120, 30, 50))).toBeCloseTo(0, 1);
  });

  it('keeps original clone when both tileset and terrain fail', async () => {
    mocks.sampleTerrainMostDetailed.mockResolvedValueOnce([] as any);
    const original = new Cartesian3(9, 8, 7);
    const scene = {
      clampToHeightMostDetailed: vi.fn(async () => []),
      terrainProvider: {},
    } as any;

    const result = await clampToHeightMostDetailedByTilesetOrTerrain({
      scene,
      positions: [original],
      classificationType: ClassificationType.BOTH,
    });

    expect(result[0]).toEqual(original);
    expect(result[0]).not.toBe(original);
  });

  it('skips tileset sampling for TERRAIN classification', async () => {
    mocks.sampleTerrainMostDetailed.mockClear();
    const scene = {
      clampToHeightMostDetailed: vi.fn(async () => [new Cartesian3(1, 2, 3)]),
      terrainProvider: {},
    } as any;

    await clampToHeightMostDetailedByTilesetOrTerrain({
      scene,
      positions: [new Cartesian3(0, 0, 0)],
      classificationType: ClassificationType.TERRAIN,
    });

    expect(scene.clampToHeightMostDetailed).not.toHaveBeenCalled();
    expect(mocks.sampleTerrainMostDetailed).toHaveBeenCalled();
  });
});
