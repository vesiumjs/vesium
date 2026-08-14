import { WebMapServiceImageryProvider } from 'cesium';
import { describe, expect, it } from 'vitest';
import { WebMapServiceImageryProviderFromJSON, WebMapServiceImageryProviderToJSON, WebMapServiceImageryProviderZodSchema } from '../WebMapServiceImageryProvider';

describe('webMapServiceImageryProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(WebMapServiceImageryProviderZodSchema().parse({ parser: 'WebMapServiceImageryProvider', value: { url: 'x', layers: 'l' } }).value.layers).toBe('l');
    expect(() => WebMapServiceImageryProviderZodSchema().parse({ parser: 'WebMapServiceImageryProvider', value: { url: 'x' } } as any)).toThrow();
    expect(() => WebMapServiceImageryProviderZodSchema().parse({ parser: 'WebMapServiceImageryProvider' } as any)).toThrow();
  });

  it('round-trips an instance with layers and parameters', () => {
    const instance = new WebMapServiceImageryProvider({
      url: 'https://example.com/wms',
      layers: 'layer1',
      parameters: { format: 'image/png' },
    });
    const json = WebMapServiceImageryProviderToJSON(instance);
    expect(json?.value.url).toBe('https://example.com/wms');
    expect(json?.value.layers).toBe('layer1');

    const back = WebMapServiceImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(WebMapServiceImageryProvider);
    expect(back!.url).toBe(instance.url);
    expect(back!.layers).toBe('layer1');
  });

  it('returns undefined for nullish input', () => {
    expect(WebMapServiceImageryProviderToJSON(undefined)).toBeUndefined();
    expect(WebMapServiceImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
