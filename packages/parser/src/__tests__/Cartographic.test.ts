import { Cartesian3, Cartographic, Math as CesiumMath, Rectangle } from 'cesium';
import { describe, expect, it } from 'vitest';
import { Cartesian3DegreesZodSchema, Cartesian3FromDegreesJSON, Cartesian3ToDegreesJSON } from '../Cartesian3';
import { CartographicDegreesZodSchema, CartographicFromDegreesJSON, CartographicFromJSON, CartographicToDegreesJSON, CartographicToJSON, CartographicZodSchema } from '../Cartographic';
import { RectangleDegreesZodSchema, RectangleFromDegreesJSON, RectangleToDegreesJSON } from '../Rectangle';

describe('cartographic serialization', () => {
  it('round-trips a Cartographic value in radians', () => {
    const instance = new Cartographic(1, 0.5, 120);
    const back = CartographicFromJSON(CartographicToJSON(instance));
    expect(back).toBeInstanceOf(Cartographic);
    expect(back?.longitude).toBe(1);
    expect(back?.latitude).toBe(0.5);
    expect(back?.height).toBe(120);
  });

  it('round-trips Cartographic longitude and latitude in degrees', () => {
    const instance = Cartographic.fromDegrees(120, 30, 88);
    const json = CartographicToDegreesJSON(instance)!;
    expect(json.value.longitude).toBeCloseTo(120);
    expect(json.value.latitude).toBeCloseTo(30);
    expect(json.value.height).toBe(88);
    const back = CartographicFromDegreesJSON(json)!;
    expect(CesiumMath.toDegrees(back.longitude)).toBeCloseTo(120);
    expect(CesiumMath.toDegrees(back.latitude)).toBeCloseTo(30);
    expect(back.height).toBe(88);
  });

  it('round-trips Cartesian3 longitude, latitude, and height in degrees', () => {
    const instance = Cartesian3.fromDegrees(121.5, 31.2, 45);
    const json = Cartesian3ToDegreesJSON(instance)!;
    expect(json.value.longitude).toBeCloseTo(121.5);
    expect(json.value.latitude).toBeCloseTo(31.2);
    expect(json.value.height).toBeCloseTo(45);
    const back = Cartesian3FromDegreesJSON(json)!;
    expect(Cartesian3.distance(back, instance)).toBeLessThan(0.001);
  });

  it('rejects unrepresentable or malformed degree coordinates', () => {
    expect(() => Cartesian3ToDegreesJSON(Cartesian3.ZERO)).toThrow('cannot be represented');
    expect(() => Cartesian3DegreesZodSchema().parse({
      parser: 'Cartesian3Degrees',
      value: { longitude: 120 },
    })).toThrow();
    expect(() => CartographicDegreesZodSchema().parse({
      parser: 'CartographicDegrees',
      value: { longitude: 120, latitude: '30' },
    })).toThrow();
    expect(() => CartographicZodSchema().parse({ parser: 'Cartographic', value: 'invalid' })).toThrow();
  });

  it('round-trips Rectangle bounds in degrees', () => {
    const instance = Rectangle.fromDegrees(120, 30, 121, 31);
    const json = RectangleToDegreesJSON(instance)!;
    expect(json.value.west).toBeCloseTo(120);
    expect(json.value.south).toBeCloseTo(30);
    expect(json.value.east).toBeCloseTo(121);
    expect(json.value.north).toBeCloseTo(31);
    const back = RectangleFromDegreesJSON(json)!;
    expect(CesiumMath.toDegrees(back.west)).toBeCloseTo(120);
    expect(CesiumMath.toDegrees(back.north)).toBeCloseTo(31);
    expect(() => RectangleDegreesZodSchema().parse({
      parser: 'RectangleDegrees',
      value: { west: 120, south: 30, east: 121 },
    })).toThrow();
  });
});
