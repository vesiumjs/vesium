import { EllipsoidTerrainProvider, UrlTemplateImageryProvider } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ImageryProviderFromJSON, ImageryProviderToJSON } from '../ImageryProvider';
import { TerrainProviderFromJSON } from '../TerrainProvider';

describe('imageryProvider unified entry', () => {
  it('dispatches ToJSON by concrete type', () => {
    expect(ImageryProviderToJSON(undefined)).toBeUndefined();

    const instance = new UrlTemplateImageryProvider({ url: 'https://example.com/{z}/{x}/{y}.png' });
    expect(ImageryProviderToJSON(instance)?.parser).toBe('UrlTemplateImageryProvider');
  });

  it('dispatches FromJSON by parser field', async () => {
    expect(await ImageryProviderFromJSON(undefined)).toBeUndefined();
    expect(await ImageryProviderFromJSON({ parser: 'Unknown' as any, value: {} })).toBeUndefined();

    const back = await ImageryProviderFromJSON({
      parser: 'UrlTemplateImageryProvider',
      value: { url: 'https://example.com/{z}/{x}/{y}.png' },
    });
    expect(back).toBeInstanceOf(UrlTemplateImageryProvider);
    expect((back as UrlTemplateImageryProvider).url).toBe('https://example.com/{z}/{x}/{y}.png');
  });
});

describe('terrainProvider unified entry', () => {
  it('dispatches FromJSON by parser field', async () => {
    expect(await TerrainProviderFromJSON(undefined)).toBeUndefined();
    expect(await TerrainProviderFromJSON({ parser: 'Unknown' as any, value: {} })).toBeUndefined();

    const back = await TerrainProviderFromJSON({ parser: 'EllipsoidTerrainProvider', value: {} });
    expect(back).toBeInstanceOf(EllipsoidTerrainProvider);
  });
});
