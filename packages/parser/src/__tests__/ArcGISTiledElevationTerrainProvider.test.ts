import { describe, expect, it } from 'vitest';
import { ArcGISTiledElevationTerrainProviderFromJSON, ArcGISTiledElevationTerrainProviderToJSON, ArcGISTiledElevationTerrainProviderZodSchema } from '../ArcGISTiledElevationTerrainProvider';

describe('arcGISTiledElevationTerrainProvider', () => {
  it('serializes a terrain source', () => {
    const json = ArcGISTiledElevationTerrainProviderToJSON({ url: 'https://example.com/elevation', token: 'abc' });
    expect(json.value.url).toBe('https://example.com/elevation');
    expect(json.value.token).toBe('abc');
  });

  it('parses valid JSON and rejects invalid input', () => {
    expect(ArcGISTiledElevationTerrainProviderZodSchema().parse({ parser: 'ArcGISTiledElevationTerrainProvider', value: { url: 'x' } }).value.url).toBe('x');
    expect(() => ArcGISTiledElevationTerrainProviderZodSchema().parse({ parser: 'ArcGISTiledElevationTerrainProvider', value: {} } as any)).toThrow();
  });

  it('returns undefined for nullish input', async () => {
    expect(await ArcGISTiledElevationTerrainProviderFromJSON(undefined)).toBeUndefined();
  });
});
