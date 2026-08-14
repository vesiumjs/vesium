import { describe, expect, it } from 'vitest';
import { ArcGisMapServerImageryProviderZodSchema } from '../ArcGisMapServerImageryProvider';
import { TileMapServiceImageryProviderZodSchema } from '../TileMapServiceImageryProvider';

describe('async imagery providers', () => {
  it('tileMapServiceImageryProvider schema accepts url-based JSON', () => {
    expect(TileMapServiceImageryProviderZodSchema().parse({
      parser: 'TileMapServiceImageryProvider',
      value: { url: 'https://example.com/tms' },
    }).value.url).toBe('https://example.com/tms');
    expect(() => TileMapServiceImageryProviderZodSchema().parse({ parser: 'TileMapServiceImageryProvider' } as any)).toThrow();
  });

  it('arcGisMapServerImageryProvider schema accepts url-based JSON', () => {
    expect(ArcGisMapServerImageryProviderZodSchema().parse({
      parser: 'ArcGisMapServerImageryProvider',
      value: { url: 'https://example.com/arcgis', token: 'tok' },
    }).value.token).toBe('tok');
    expect(() => ArcGisMapServerImageryProviderZodSchema().parse({ parser: 'ArcGisMapServerImageryProvider' } as any)).toThrow();
  });
});
