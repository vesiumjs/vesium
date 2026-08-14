import { UrlTemplateImageryProvider, WebMercatorTilingScheme } from 'cesium';
import { describe, expect, it } from 'vitest';
import { UrlTemplateImageryProviderFromJSON, UrlTemplateImageryProviderToJSON, UrlTemplateImageryProviderZodSchema } from '../UrlTemplateImageryProvider';

describe('urlTemplateImageryProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(UrlTemplateImageryProviderZodSchema().parse({ parser: 'UrlTemplateImageryProvider', value: { url: 'x' } }).value.url).toBe('x');
    expect(() => UrlTemplateImageryProviderZodSchema().parse({ parser: 'UrlTemplateImageryProvider' } as any)).toThrow();
  });

  it('round-trips an instance with subdomains and credit', () => {
    const instance = new UrlTemplateImageryProvider({
      url: 'https://{s}.example.com/{z}/{x}/{y}.png',
      subdomains: ['a', 'b'],
    });
    const json = UrlTemplateImageryProviderToJSON(instance);
    expect(json?.value.url).toBe('https://{s}.example.com/{z}/{x}/{y}.png');
    expect(json?.value.subdomains).toEqual(['a', 'b']);

    const back = UrlTemplateImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(UrlTemplateImageryProvider);
    expect(back!.url).toBe(instance.url);
    expect(back!.tilingScheme).toBeInstanceOf(WebMercatorTilingScheme);
  });

  it('returns undefined for nullish input', () => {
    expect(UrlTemplateImageryProviderToJSON(undefined)).toBeUndefined();
    expect(UrlTemplateImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
