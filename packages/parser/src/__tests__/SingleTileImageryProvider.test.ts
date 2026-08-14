import { Rectangle, SingleTileImageryProvider } from 'cesium';
import { describe, expect, it } from 'vitest';
import { SingleTileImageryProviderFromJSON, SingleTileImageryProviderToJSON, SingleTileImageryProviderZodSchema } from '../SingleTileImageryProvider';

describe('singleTileImageryProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(SingleTileImageryProviderZodSchema().parse({ parser: 'SingleTileImageryProvider', value: { url: 'x' } }).value.url).toBe('x');
    expect(() => SingleTileImageryProviderZodSchema().parse({ parser: 'SingleTileImageryProvider' } as any)).toThrow();
  });

  it('round-trips an instance', () => {
    const rectangle = Rectangle.fromDegrees(-180, -90, 180, 90);
    const instance = new SingleTileImageryProvider({
      url: 'https://example.com/single.png',
      rectangle,
      tileWidth: 1,
      tileHeight: 1,
    });
    const json = SingleTileImageryProviderToJSON(instance);
    expect(json?.value.url).toBe('https://example.com/single.png');

    const back = SingleTileImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(SingleTileImageryProvider);
    expect(back!.url).toBe(instance.url);
    expect(back!.rectangle.west).toBeCloseTo(rectangle.west, 6);
  });

  it('returns undefined for nullish input', () => {
    expect(SingleTileImageryProviderToJSON(undefined)).toBeUndefined();
    expect(SingleTileImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
