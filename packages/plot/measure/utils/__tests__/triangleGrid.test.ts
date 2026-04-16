import { Cartesian3, ClassificationType } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { triangleGrid } from '../triangleGrid';

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

// Helper: create Cartesian3 from degrees for proper Earth-surface coordinates
function fromDegrees(lng: number, lat: number, height = 0): Cartesian3 {
  return Cartesian3.fromDegrees(lng, lat, height);
}

describe('triangleGrid', () => {
  it('generates a triangle grid from a square boundary', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.01, 39, 0),
      fromDegrees(116.01, 39.01, 0),
      fromDegrees(116, 39.01, 0),
    ];

    const result = await triangleGrid(positions, { density: 5 });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach((triangle) => {
      expect(triangle).toHaveLength(3);
      triangle.forEach((point) => {
        expect(point instanceof Cartesian3).toBe(true);
      });
    });
  });

  it('throws when positions length < 3', async () => {
    await expect(
      triangleGrid([new Cartesian3(0, 0, 0), new Cartesian3(1, 1, 1)], { density: 5 }),
    ).rejects.toThrow('positions must >= 3');
  });

  it('throws when positions is empty', async () => {
    await expect(triangleGrid([], { density: 5 })).rejects.toThrow('positions must >= 3');
  });

  it('throws when density <= 0', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.01, 39, 0),
      fromDegrees(116.01, 39.01, 0),
    ];

    await expect(
      triangleGrid(positions, { density: 0 }),
    ).rejects.toThrow('options.density must > 0');
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

  it('handles clampToGround option with a scene', async () => {
    const scene = {
      clampToHeightMostDetailed: vi.fn(async (positions: Cartesian3[]) => positions),
      terrainProvider: {},
    } as any;

    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.003, 39, 0),
      fromDegrees(116.003, 39.003, 0),
      fromDegrees(116, 39.003, 0),
    ];

    const result = await triangleGrid(positions, {
      density: 3,
      scene,
      clampToGround: true,
      classificationType: ClassificationType.BOTH,
    });

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('throws when clampToGround is true but scene is not provided', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.003, 39, 0),
      fromDegrees(116.003, 39.003, 0),
      fromDegrees(116, 39.003, 0),
    ];

    await expect(
      triangleGrid(positions, {
        density: 3,
        clampToGround: true,
      } as any),
    ).rejects.toThrow('scene is required');
  });

  it('generates triangles from a triangle boundary', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.005, 39, 0),
      fromDegrees(116.005, 39.005, 0),
    ];

    const result = await triangleGrid(positions, { density: 5 });

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('each triangle in result is an array of exactly 3 Cartesian3 points', async () => {
    const positions = [
      fromDegrees(116, 39, 0),
      fromDegrees(116.008, 39, 0),
      fromDegrees(116.008, 39.008, 0),
      fromDegrees(116, 39.008, 0),
    ];

    const result = await triangleGrid(positions, { density: 4 });

    result.forEach((triangle) => {
      expect(Array.isArray(triangle)).toBe(true);
      expect(triangle).toHaveLength(3);
    });
  });
});
