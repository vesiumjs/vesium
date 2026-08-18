import { Ellipsoid } from 'cesium';
import { describe, expect, it } from 'vitest';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from '../Ellipsoid';

describe('ellipsoid', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(EllipsoidZodSchema().parse({
      parser: 'Ellipsoid',
      value: { radii: { parser: 'Cartesian3', value: { x: 1, y: 1, z: 1 } } },
    }).value.radii.value.x).toBe(1);
    expect(() => EllipsoidZodSchema().parse({ parser: 'Ellipsoid', value: {} } as any)).toThrow();
    expect(() => EllipsoidZodSchema().parse({
      parser: 'Ellipsoid',
      value: { radii: { parser: 'Cartesian3', value: { x: -1, y: 1, z: 1 } } },
    })).toThrow();
  });

  it('round-trips an Ellipsoid instance', () => {
    const instance = Ellipsoid.WGS84;
    const json = EllipsoidToJSON(instance);
    const back = EllipsoidFromJSON(json);
    expect(back).toBeInstanceOf(Ellipsoid);
    expect(back!.radii.x).toBe(instance.radii.x);
    expect(back!.radii.y).toBe(instance.radii.y);
    expect(back!.radii.z).toBe(instance.radii.z);
  });

  it('returns undefined for nullish input', () => {
    expect(EllipsoidToJSON(undefined)).toBeUndefined();
    expect(EllipsoidFromJSON(undefined)).toBeUndefined();
  });
});
