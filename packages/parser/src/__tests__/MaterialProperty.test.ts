import { CallbackProperty, Color, ColorMaterialProperty, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from '../MaterialProperty';

describe('materialProperty', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(MaterialPropertyZodSchema().parse({
      parser: 'MaterialProperty',
      value: { name: 'ColorMaterialProperty', content: { color: undefined } },
    }).value.name).toBe('ColorMaterialProperty');
    expect(() => MaterialPropertyZodSchema().parse({ parser: 'MaterialProperty' } as any)).toThrow();
  });

  it('round-trips a ColorMaterialProperty', () => {
    const instance = new ColorMaterialProperty(Color.RED);
    const json = MaterialPropertyToJSON(instance);
    expect(json?.value.name).toBe('ColorMaterialProperty');
    const back = MaterialPropertyFromJSON(json)!;
    expect(back).toBeInstanceOf(ColorMaterialProperty);
    expect((back as ColorMaterialProperty).color!.getValue()!.red).toBe(1);
  });

  it('evaluates time-varying material properties by the given time', () => {
    const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
    const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
    const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
    const instance = new ColorMaterialProperty(
      new CallbackProperty(
        ((time: JulianDate) => JulianDate.greaterThan(time, threshold) ? Color.RED : Color.BLUE) as any,
        false,
      ),
    );
    const before = MaterialPropertyToJSON(instance, timeBefore);
    const after = MaterialPropertyToJSON(instance, timeAfter);
    expect(before?.value.content.color?.value.red).toBe(0); // BLUE
    expect(after?.value.content.color?.value.red).toBe(1); // RED
  });

  it('validates malformed JSON instead of crashing with a TypeError', () => {
    expect(() => MaterialPropertyFromJSON({} as any)).toThrow();
    expect(MaterialPropertyFromJSON(null as any)).toBeUndefined();
    expect(MaterialPropertyFromJSON(undefined)).toBeUndefined();
  });

  it('returns undefined when no program matches', () => {
    const json = {
      parser: 'MaterialProperty' as const,
      value: { name: 'UnknownMaterialProperty', content: {} },
    };
    expect(MaterialPropertyFromJSON(json as any)).toBeUndefined();
  });
});
