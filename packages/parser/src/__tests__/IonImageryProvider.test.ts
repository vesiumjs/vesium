import { describe, expect, it } from 'vitest';
import { IonImageryProviderFromJSON, IonImageryProviderToJSON, IonImageryProviderZodSchema } from '../IonImageryProvider';

describe('ionImageryProvider', () => {
  it('serializes an ion asset source', () => {
    const json = IonImageryProviderToJSON({ assetId: 3812, accessToken: 'token' });
    expect(json).toEqual({ parser: 'IonImageryProvider', value: { assetId: 3812, accessToken: 'token' } });
  });

  it('parses valid JSON and rejects invalid input', () => {
    expect(IonImageryProviderZodSchema().parse({ parser: 'IonImageryProvider', value: { assetId: 3812 } }).value.assetId).toBe(3812);
    expect(() => IonImageryProviderZodSchema().parse({ parser: 'IonImageryProvider', value: {} } as any)).toThrow();
  });

  it('returns undefined for nullish input', async () => {
    expect(await IonImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
