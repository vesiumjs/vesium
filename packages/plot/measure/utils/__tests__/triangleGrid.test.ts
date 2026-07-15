import { Cartesian3, ClassificationType } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { triangleGrid } from '../triangleGrid';

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

describe('triangleGrid', () => {
  it('generates a triangle grid from a square boundary', async () => {
    const result = await triangleGrid([
      fromDegrees(116, 39, 0),
      fromDegrees(116.01, 39, 0),
      fromDegrees(116.01, 39.01, 0),
      fromDegrees(116, 39.01, 0),
    ], { density: 5 });
    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach(triangle => expect(triangle).toHaveLength(3));
  });

  it('throws when positions length < 3', async () => {
    await expect(triangleGrid(
      [new Cartesian3(0, 0, 0), new Cartesian3(1, 1, 1)],
      { density: 5 },
    )).rejects.toThrow('positions must >= 3');
  });

  it('throws when density <= 0', async () => {
    await expect(triangleGrid([
      fromDegrees(116, 39, 0),
      fromDegrees(116.01, 39, 0),
      fromDegrees(116.01, 39.01, 0),
    ], { density: 0 })).rejects.toThrow('options.density must > 0');
  });

  it('generates more triangles with higher density', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.01, 39, 0),
      fromDegrees(116.01, 39.01, 0),
      fromDegrees(116, 39.01, 0),
    ];
    const lowDensity = await triangleGrid(positions, { density: 2 });
    const highDensity = await triangleGrid(positions, { density: 10 });
    expect(highDensity.length).toBeGreaterThanOrEqual(lowDensity.length);
  });

  it('throws when clampToGround is true but scene is not provided', async () => {
    await expect(triangleGrid([
      fromDegrees(116, 39, 0),
      fromDegrees(116.003, 39, 0),
      fromDegrees(116.003, 39.003, 0),
      fromDegrees(116, 39.003, 0),
    ], {
      density: 3,
      clampToGround: true,
    } as any)).rejects.toThrow('scene is required');
  });

  it('handles clampToGround option with a scene', async () => {
    const scene = {
      clampToHeightMostDetailed: vi.fn(async (positions: Cartesian3[]) => positions),
      terrainProvider: {},
    } as any;
    const result = await triangleGrid([
      fromDegrees(116, 39, 0),
      fromDegrees(116.003, 39, 0),
      fromDegrees(116.003, 39.003, 0),
      fromDegrees(116, 39.003, 0),
    ], {
      density: 3,
      scene,
      clampToGround: true,
      classificationType: ClassificationType.BOTH,
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
