import { Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { area } from '../area';

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

describe('area', () => {
  it('calculates area of a triangle', async () => {
    // Right triangle in XY plane with legs of 3 and 4
    // Expected area: 0.5 * 3 * 4 = 6
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(3, 0, 0);
    const p2 = new Cartesian3(3, 4, 0);

    const result = await area([p0, p1, p2]);

    expect(result).toBeCloseTo(6, 5);
  });

  it('calculates area of a square in XY plane', async () => {
    // Square with side length 10, expected area = 100
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(10, 0, 0);
    const p2 = new Cartesian3(10, 10, 0);
    const p3 = new Cartesian3(0, 10, 0);

    const result = await area([p0, p1, p2, p3]);

    expect(result).toBeCloseTo(100, 5);
  });

  it('throws when positions length < 2', async () => {
    await expect(area([new Cartesian3(0, 0, 0)])).rejects.toThrow(
      'positions.length must >= 2',
    );
  });

  it('throws when positions is empty', async () => {
    await expect(area([])).rejects.toThrow('positions.length must >= 2');
  });

  it('throws when density <= 0', async () => {
    await expect(
      area(
        [new Cartesian3(0, 0, 0), new Cartesian3(3, 4, 0)],
        { density: 0 },
      ),
    ).rejects.toThrow('options.density must > 0');
  });

  it('calculates area with clampToGround option (uses triangleGrid path)', async () => {
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

    const result = await area(positions, {
      clampToGround: true,
      scene,
      density: 10,
    });

    // Rough ground square ~0.003° ≈ 330m side; area should be large and finite.
    expect(result).toBeGreaterThan(1e4);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('handles triangle in 3D space', async () => {
    // Triangle in 3D: (0,0,0), (3,0,0), (0,4,0)
    const p0 = new Cartesian3(0, 0, 0);
    const p1 = new Cartesian3(3, 0, 0);
    const p2 = new Cartesian3(0, 4, 0);

    const result = await area([p0, p1, p2]);

    // Area = 0.5 * |v0 x v1| = 0.5 * 12 = 6
    expect(result).toBeCloseTo(6, 5);
  });
});
