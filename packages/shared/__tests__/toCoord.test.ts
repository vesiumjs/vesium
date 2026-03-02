import { Cartesian3, Cartographic } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { toCoord } from '../src/toCoord';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Cartesian3 {
    constructor(public x: number, public y: number, public z: number) {}
  }
  class Cartographic {
    constructor(public longitude: number, public latitude: number, public height: number = 0) {}
  }
  return {
    ...actual,
    Cartesian3,
    Cartographic,
    Ellipsoid: {
      WGS84: {
        cartesianToCartographic: vi.fn(c => new Cartographic(c.x, c.y, c.z)),
      },
    },
    Math: {
      toDegrees: vi.fn(r => r * 180 / 3.14159), // simplified
    },
  };
});

describe('toCoord', () => {
  it('should convert Cartesian3 to array', () => {
    const cartesian = new Cartesian3(1, 0, 0);
    const result = toCoord(cartesian);
    expect(Array.isArray(result)).toBe(true);
    expect(result![0]).toBeGreaterThan(0);
  });

  it('should convert Cartographic to object with alt', () => {
    const cartographic = new Cartographic(1, 0.5, 100);
    const result = toCoord(cartographic, { type: 'Object', alt: true });
    expect(result).toEqual({
      longitude: expect.any(Number),
      latitude: expect.any(Number),
      height: 100,
    });
  });

  it('should handle undefined input', () => {
    expect(toCoord(undefined)).toBeUndefined();
  });
});
