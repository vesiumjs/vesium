import { Cartesian3, Cartographic, Math as CesiumMath } from 'cesium';
import { describe, expect, it } from 'vitest';
import { toCartesian3 } from '../src/toCartesian3';

describe('toCartesian3', () => {
  it('should clone Cartesian3 input', () => {
    const cartesian = Cartesian3.fromDegrees(120, 30, 100);
    const result = toCartesian3(cartesian);
    expect(result).toBeInstanceOf(Cartesian3);
    expect(result).not.toBe(cartesian);
    expect(result!.x).toBeCloseTo(cartesian.x, 5);
    expect(result!.y).toBeCloseTo(cartesian.y, 5);
    expect(result!.z).toBeCloseTo(cartesian.z, 5);
  });

  it('should convert Cartographic to Cartesian3', () => {
    const cartographic = Cartographic.fromDegrees(120, 30, 100);
    const result = toCartesian3(cartographic);
    const expected = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    expect(result!.x).toBeCloseTo(expected.x, 5);
    expect(result!.y).toBeCloseTo(expected.y, 5);
    expect(result!.z).toBeCloseTo(expected.z, 5);
  });

  it('should convert [lng, lat] and [lng, lat, alt] arrays', () => {
    const withoutHeight = toCartesian3([120, 30]);
    const withHeight = toCartesian3([120, 30, 100]);
    const expected = Cartesian3.fromDegrees(120, 30, 100);
    expect(Cartesian3.distance(withoutHeight!, Cartesian3.fromDegrees(120, 30))).toBeCloseTo(0, 5);
    expect(withHeight!.x).toBeCloseTo(expected.x, 5);
    expect(withHeight!.y).toBeCloseTo(expected.y, 5);
    expect(withHeight!.z).toBeCloseTo(expected.z, 5);
  });

  it('should convert longitude/latitude object input', () => {
    const result = toCartesian3({ longitude: 120, latitude: 30, height: 50 });
    const cartographic = Cartographic.fromCartesian(result!);
    expect(CesiumMath.toDegrees(cartographic.longitude)).toBeCloseTo(120, 5);
    expect(CesiumMath.toDegrees(cartographic.latitude)).toBeCloseTo(30, 5);
    expect(cartographic.height).toBeCloseTo(50, 5);
  });

  it('should return undefined for nullish input', () => {
    expect(toCartesian3(undefined)).toBeUndefined();
    expect(toCartesian3(null as any)).toBeUndefined();
  });
});
