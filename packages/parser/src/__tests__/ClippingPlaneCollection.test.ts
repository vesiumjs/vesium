import { Cartesian3, ClippingPlane, ClippingPlaneCollection } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ClippingPlaneCollectionFromJSON, ClippingPlaneCollectionToJSON, ClippingPlaneCollectionZodSchema } from '../ClippingPlaneCollection';

describe('clippingPlaneCollection', () => {
  it('parses valid JSON and rejects invalid input', () => {
    const json = {
      parser: 'ClippingPlaneCollection' as const,
      value: {
        planes: [{ parser: 'ClippingPlane' as const, value: { normal: { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } }, distance: 5 } }],
        enabled: true,
        modelMatrix: { parser: 'Matrix4' as const, value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
        unionClippingRegions: false,
        edgeColor: { parser: 'Color' as const, value: { red: 1, green: 1, blue: 1, alpha: 1 } },
        edgeWidth: 0,
      },
    };
    expect(ClippingPlaneCollectionZodSchema().parse(json).value.planes).toHaveLength(1);
    expect(() => ClippingPlaneCollectionZodSchema().parse({ parser: 'ClippingPlaneCollection' } as any)).toThrow();
  });

  it('serializes every plane, not just the first one', () => {
    const instance = new ClippingPlaneCollection({
      planes: [
        new ClippingPlane(new Cartesian3(1, 0, 0), 1),
        new ClippingPlane(new Cartesian3(0, 1, 0), 2),
        new ClippingPlane(new Cartesian3(0, 0, 1), 3),
      ],
    });
    const json = ClippingPlaneCollectionToJSON(instance);
    expect(json?.value.planes).toHaveLength(3);
    expect(json?.value.planes[2].value.distance).toBe(3);
  });

  it('round-trips a ClippingPlaneCollection instance', () => {
    const instance = new ClippingPlaneCollection({
      planes: [
        new ClippingPlane(new Cartesian3(1, 0, 0), 1),
        new ClippingPlane(new Cartesian3(0, 1, 0), 2),
      ],
      unionClippingRegions: true,
    });
    const back = ClippingPlaneCollectionFromJSON(ClippingPlaneCollectionToJSON(instance)!);
    expect(back).toBeInstanceOf(ClippingPlaneCollection);
    expect(back!.length).toBe(2);
    expect(back!.get(0)!.distance).toBe(1);
    expect(back!.get(1)!.normal.y).toBe(1);
    expect(back!.unionClippingRegions).toBe(true);
  });

  it('returns undefined for nullish input', () => {
    expect(ClippingPlaneCollectionToJSON(undefined)).toBeUndefined();
    expect(ClippingPlaneCollectionFromJSON(undefined)).toBeUndefined();
  });
});
