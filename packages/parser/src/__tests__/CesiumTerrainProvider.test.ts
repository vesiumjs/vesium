import { describe, expect, it } from 'vitest';
import { CesiumTerrainProviderFromJSON, CesiumTerrainProviderToJSON, CesiumTerrainProviderZodSchema } from '../CesiumTerrainProvider';

describe('cesiumTerrainProvider', () => {
  it('serializes a terrain source', () => {
    const json = CesiumTerrainProviderToJSON({
      url: 'https://example.com/terrain',
      requestVertexNormals: true,
      requestWaterMask: true,
    });
    expect(json.value.url).toBe('https://example.com/terrain');
    expect(json.value.requestVertexNormals).toBe(true);
    expect(json.value.requestWaterMask).toBe(true);
  });

  it('parses valid JSON and rejects invalid input', () => {
    expect(CesiumTerrainProviderZodSchema().parse({ parser: 'CesiumTerrainProvider', value: { url: 'x' } }).value.url).toBe('x');
    expect(() => CesiumTerrainProviderZodSchema().parse({ parser: 'CesiumTerrainProvider', value: {} } as any)).toThrow();
  });

  it('returns undefined for nullish input', async () => {
    expect(await CesiumTerrainProviderFromJSON(undefined)).toBeUndefined();
  });
});
