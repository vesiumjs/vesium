import { Ellipsoid, GeographicTilingScheme, WebMercatorTilingScheme } from 'cesium';
import { describe, expect, it } from 'vitest';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from '../TilingScheme';

describe('tilingScheme', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(TilingSchemeZodSchema().parse({ parser: 'TilingScheme', value: { type: 'Geographic' } }).value.type).toBe('Geographic');
    expect(() => TilingSchemeZodSchema().parse({ parser: 'TilingScheme', value: { type: 'BAD' as any } })).toThrow();
  });

  it('round-trips a GeographicTilingScheme', () => {
    const instance = new GeographicTilingScheme({ ellipsoid: Ellipsoid.WGS84 });
    const back = TilingSchemeFromJSON(TilingSchemeToJSON(instance)!);
    expect(back).toBeInstanceOf(GeographicTilingScheme);
    expect(back!.ellipsoid.radii.x).toBe(Ellipsoid.WGS84.radii.x);
  });

  it('round-trips a WebMercatorTilingScheme type', () => {
    const instance = new WebMercatorTilingScheme({ ellipsoid: Ellipsoid.WGS84 });
    const back = TilingSchemeFromJSON(TilingSchemeToJSON(instance)!);
    expect(back).toBeInstanceOf(WebMercatorTilingScheme);
    expect(back!.ellipsoid.radii.z).toBe(Ellipsoid.WGS84.radii.z);
  });

  it('returns undefined for nullish input', () => {
    expect(TilingSchemeToJSON(undefined)).toBeUndefined();
    expect(TilingSchemeFromJSON(undefined)).toBeUndefined();
  });
});
