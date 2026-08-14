import { WebMapTileServiceImageryProvider } from 'cesium';
import { describe, expect, it } from 'vitest';
import { WebMapTileServiceImageryProviderFromJSON, WebMapTileServiceImageryProviderToJSON, WebMapTileServiceImageryProviderZodSchema } from '../WebMapTileServiceImageryProvider';

describe('webMapTileServiceImageryProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(WebMapTileServiceImageryProviderZodSchema().parse({
      parser: 'WebMapTileServiceImageryProvider',
      value: { url: 'x', layer: 'l', style: 's', tileMatrixSetID: 't' },
    }).value.layer).toBe('l');
    expect(() => WebMapTileServiceImageryProviderZodSchema().parse({ parser: 'WebMapTileServiceImageryProvider', value: { url: 'x' } } as any)).toThrow();
    expect(() => WebMapTileServiceImageryProviderZodSchema().parse({ parser: 'WebMapTileServiceImageryProvider' } as any)).toThrow();
  });

  it('round-trips an instance with KVP query parameters', () => {
    const instance = new WebMapTileServiceImageryProvider({
      url: 'https://example.com/wmts',
      layer: 'my-layer',
      style: 'default',
      format: 'image/png',
      tileMatrixSetID: 'EPSG:3857',
    });
    const json = WebMapTileServiceImageryProviderToJSON(instance);
    expect(json?.value.layer).toBe('my-layer');
    expect(json?.value.style).toBe('default');
    expect(json?.value.tileMatrixSetID).toBe('EPSG:3857');
    expect(json?.value.format).toBe('image/png');

    const back = WebMapTileServiceImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(WebMapTileServiceImageryProvider);
    expect(back!.url).toBe(instance.url);
    expect(back!.format).toBe('image/png');
  });

  it('round-trips an instance with REST template placeholders', () => {
    const instance = new WebMapTileServiceImageryProvider({
      url: 'https://example.com/wmts/{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
      layer: 'my-layer',
      style: 'default',
      tileMatrixSetID: 'EPSG:3857',
    });
    const json = WebMapTileServiceImageryProviderToJSON(instance);
    expect(json?.value.layer).toBe('my-layer');
    expect(json?.value.style).toBe('default');

    const back = WebMapTileServiceImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(WebMapTileServiceImageryProvider);
  });

  it('returns undefined for nullish input', () => {
    expect(WebMapTileServiceImageryProviderToJSON(undefined)).toBeUndefined();
    expect(WebMapTileServiceImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
