import { ArcType } from 'cesium';
import { describe, expect, it } from 'vitest';
import { ArcTypeFromJSON, ArcTypeToJSON, ArcTypeZodSchema } from '../src/ArcType';

describe('arcType', () => {
  it('parses valid enum values and rejects invalid ones', () => {
    expect(ArcTypeZodSchema().parse({ parser: 'ArcType', value: 'GEODESIC' }).value).toBe('GEODESIC');
    expect(() => ArcTypeZodSchema().parse({ parser: 'ArcType', value: 'BAD' as any })).toThrow();
    expect(() => ArcTypeZodSchema().parse({ parser: 'Cartesian3', value: 'GEODESIC' } as any)).toThrow();
  });

  it('round-trips ArcType values', () => {
    expect(ArcTypeToJSON(undefined)).toBeUndefined();
    expect(ArcTypeFromJSON(undefined)).toBeUndefined();

    const json = ArcTypeToJSON(ArcType.RHUMB);
    expect(json).toEqual({ parser: 'ArcType', value: 'RHUMB' });
    expect(ArcTypeFromJSON(json)).toBe(ArcType.RHUMB);
    expect(ArcTypeFromJSON({ parser: 'ArcType', value: 'NONE' })).toBe(ArcType.NONE);
  });
});
