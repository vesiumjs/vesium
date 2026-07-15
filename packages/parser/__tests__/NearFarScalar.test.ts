import { NearFarScalar } from 'cesium';
import { describe, expect, it } from 'vitest';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from '../src/NearFarScalar';

describe('nearFarScalar', () => {
  const json = {
    parser: 'NearFarScalar' as const,
    value: {
      near: 1,
      nearValue: 0.5,
      far: 1000,
      farValue: 0,
    },
  };

  it('parses valid values', () => {
    const result = NearFarScalarZodSchema().parse(json);
    expect(result.value.near).toBe(1);
    expect(result.value.farValue).toBe(0);
  });

  it('round-trips values and reuses result', () => {
    const instance = new NearFarScalar(1, 0.5, 1000, 0);
    const serialized = NearFarScalarToJSON(instance);
    expect(serialized).toEqual(json);

    const restored = NearFarScalarFromJSON(serialized);
    expect(restored).toBeInstanceOf(NearFarScalar);
    expect(restored!.near).toBe(1);
    expect(restored!.nearValue).toBe(0.5);
    expect(restored!.far).toBe(1000);
    expect(restored!.farValue).toBe(0);

    const result = new NearFarScalar(0, 0, 0, 0);
    const output = NearFarScalarFromJSON(json, result);
    expect(output).toBe(result);
    expect(output!.near).toBe(1);
    expect(output!.far).toBe(1000);
  });

  it('returns undefined for nullish input', () => {
    expect(NearFarScalarToJSON(undefined)).toBeUndefined();
    expect(NearFarScalarFromJSON(undefined)).toBeUndefined();
  });
});
