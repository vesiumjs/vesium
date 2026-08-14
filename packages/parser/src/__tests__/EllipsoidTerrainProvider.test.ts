import { Ellipsoid, EllipsoidTerrainProvider } from 'cesium';
import { describe, expect, it } from 'vitest';
import { EllipsoidTerrainProviderFromJSON, EllipsoidTerrainProviderToJSON, EllipsoidTerrainProviderZodSchema } from '../EllipsoidTerrainProvider';

describe('ellipsoidTerrainProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(EllipsoidTerrainProviderZodSchema().parse({ parser: 'EllipsoidTerrainProvider', value: {} }).value).toBeDefined();
    expect(() => EllipsoidTerrainProviderZodSchema().parse({ parser: 'Cartesian3' } as any)).toThrow();
  });

  it('round-trips an instance', () => {
    const instance = new EllipsoidTerrainProvider({ ellipsoid: Ellipsoid.WGS84 });
    const json = EllipsoidTerrainProviderToJSON(instance);
    expect(json?.value.ellipsoid?.value.radii.value.x).toBe(Ellipsoid.WGS84.radii.x);

    const back = EllipsoidTerrainProviderFromJSON(json);
    expect(back).toBeInstanceOf(EllipsoidTerrainProvider);
    expect(back!.tilingScheme.ellipsoid.radii.z).toBe(Ellipsoid.WGS84.radii.z);
  });

  it('returns undefined for nullish input', () => {
    expect(EllipsoidTerrainProviderToJSON(undefined)).toBeUndefined();
    expect(EllipsoidTerrainProviderFromJSON(undefined)).toBeUndefined();
  });
});
