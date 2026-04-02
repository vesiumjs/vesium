import { Cartesian3, ClassificationType } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { clampToHeightMostDetailedByTilesetOrTerrain } from './clampToGround';

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
});
