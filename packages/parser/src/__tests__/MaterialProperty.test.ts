import { CallbackProperty, Color, ColorMaterialProperty, JulianDate, Material, StripeMaterialProperty, StripeOrientation } from 'cesium';
import { describe, expect, it } from 'vitest';
import { MaterialFromJSON, MaterialToJSON, MaterialZodSchema } from '../Material';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from '../MaterialProperty';

if (!('ImageBitmap' in globalThis)) {
  Object.defineProperty(globalThis, 'ImageBitmap', {
    configurable: true,
    value: class ImageBitmap {},
  });
}

if (!('OffscreenCanvas' in globalThis)) {
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: class OffscreenCanvas {},
  });
}

describe('materialProperty', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(MaterialPropertyZodSchema().parse({
      parser: 'MaterialProperty',
      value: { type: 'Color', content: { color: undefined } },
    }).value.type).toBe('Color');
    expect(() => MaterialPropertyZodSchema().parse({ parser: 'MaterialProperty' } as any)).toThrow();
  });

  it('round-trips a ColorMaterialProperty', () => {
    const instance = new ColorMaterialProperty(Color.RED);
    const json = MaterialPropertyToJSON(instance);
    expect(json?.value.type).toBe('Color');
    const back = MaterialPropertyFromJSON(json)!;
    expect(back).toBeInstanceOf(ColorMaterialProperty);
    expect((back as ColorMaterialProperty).color!.getValue()!.red).toBe(1);
  });

  it('preserves StripeMaterialProperty default orientation', () => {
    const json = MaterialPropertyToJSON(new StripeMaterialProperty());
    expect((json?.value.content as any).horizontal).toBe(true);
    const back = MaterialPropertyFromJSON(json)! as StripeMaterialProperty;
    expect(back.orientation!.getValue()).toBe(StripeOrientation.HORIZONTAL);
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
    expect((before?.value.content as any).color?.value.red).toBe(0); // BLUE
    expect((after?.value.content as any).color?.value.red).toBe(1); // RED
  });

  it('validates malformed JSON instead of crashing with a TypeError', () => {
    expect(() => MaterialPropertyFromJSON({} as any)).toThrow();
    expect(MaterialPropertyFromJSON(null as any)).toBeUndefined();
    expect(MaterialPropertyFromJSON(undefined)).toBeUndefined();
  });

  it('rejects a material property with no matching program', () => {
    const json = {
      parser: 'MaterialProperty' as const,
      value: { type: 'UnknownMaterialProperty', content: {} },
    };
    expect(() => MaterialPropertyFromJSON(json as any)).toThrow('Unsupported Cesium MaterialProperty type');
  });

  it('round-trips a direct Material using the same semantic content', () => {
    const instance = Material.fromType(Material.PolylineDashType, {
      color: Color.RED,
      gapColor: Color.BLUE,
      dashLength: 12,
      dashPattern: 0x0F0F,
    });
    const json = MaterialToJSON(instance);
    expect(MaterialZodSchema().parse(json).value.type).toBe('PolylineDash');
    const back = MaterialFromJSON(json)!;
    expect(back.type).toBe(Material.PolylineDashType);
    expect(back.uniforms.dashLength).toBe(12);
    expect(back.uniforms.dashPattern).toBe(0x0F0F);
  });

  it('rejects an unregistered direct Material', () => {
    const instance = new Material({
      fabric: {
        type: 'Unregistered',
        source: 'czm_material czm_getMaterial(czm_materialInput materialInput) { return czm_getDefaultMaterial(materialInput); }',
      },
    });
    expect(() => MaterialToJSON(instance)).toThrow('Unsupported Cesium Material type');
  });
});
