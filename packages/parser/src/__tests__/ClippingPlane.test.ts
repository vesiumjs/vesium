import { Cartesian3, ClippingPlane } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ClippingPlaneFromJSON, ClippingPlaneToJSON, ClippingPlaneZodSchema } from '../ClippingPlane';

describe('clippingPlane', () => {
  it('parses valid JSON and rejects invalid input', () => {
    const json = {
      parser: 'ClippingPlane' as const,
      value: { normal: { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } }, distance: 5 },
    };
    expect(ClippingPlaneZodSchema().parse(json).value.distance).toBe(5);
    expect(() => ClippingPlaneZodSchema().parse({ parser: 'ClippingPlane' } as any)).toThrow();
    expect(() => ClippingPlaneZodSchema().parse({ parser: 'Cartesian3', value: {} } as any)).toThrow();
  });

  it('serializes an instance whose normal is the internal wrapped object', () => {
    const instance = new ClippingPlane(new Cartesian3(1, 0, 0), 5);
    // Cesium 1.144+ wraps `normal` in a duck-typed UpdateChangedCartesian3,
    // which is not a Cartesian3 instance — it must still serialize.
    expect(instance.normal).not.toBeInstanceOf(Cartesian3);
    const json = ClippingPlaneToJSON(instance);
    expect(json?.value.normal).toEqual({ parser: 'Cartesian3', value: { x: 1, y: 0, z: 0 } });
    expect(json?.value.distance).toBe(5);
  });

  it('round-trips a ClippingPlane instance', () => {
    const instance = new ClippingPlane(new Cartesian3(0, 1, 0), 10);
    const back = ClippingPlaneFromJSON(ClippingPlaneToJSON(instance)!);
    expect(back).toBeInstanceOf(ClippingPlane);
    expect(back!.normal.x).toBe(0);
    expect(back!.normal.y).toBe(1);
    expect(back!.normal.z).toBe(0);
    expect(back!.distance).toBe(10);
  });

  it('returns undefined for nullish input', () => {
    expect(ClippingPlaneToJSON(undefined)).toBeUndefined();
    expect(ClippingPlaneFromJSON(undefined)).toBeUndefined();
  });
});
