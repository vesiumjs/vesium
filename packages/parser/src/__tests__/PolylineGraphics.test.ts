import { CallbackProperty, Cartesian3, JulianDate, PolylineGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { describe, expect, it } from 'vitest';
import { PolylineGraphicsFromJSON, PolylineGraphicsToJSON, PolylineGraphicsZodSchema } from '../PolylineGraphics';

const POSITIONS: any = [
  { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
  { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } },
];
const WIDTH = 2;

describe('polylineGraphics', () => {
  describe('polylineGraphicsZodSchema', () => {
    it('should parse valid JSON with full values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          positions: POSITIONS,
          width: WIDTH,
          arcType: { parser: 'ArcType' as const, value: 'GEODESIC' as const },
          clampToGround: false,
          shadows: { parser: 'ShadowMode' as const, value: 'DISABLED' as const },
        },
      };
      const result = PolylineGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.positions).toHaveLength(2);
    });

    it('should parse JSON with partial values', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          width: 3,
        },
      };
      const result = PolylineGraphicsZodSchema().parse(json);
      expect(result.value.show).toBe(true);
      expect(result.value.width).toBe(3);
      expect(result.value.positions).toBeUndefined();
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => PolylineGraphicsZodSchema().parse(json)).toThrow();
    });

    it('should reject JSON with invalid nested position type', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          positions: [
            { parser: 'Cartesian3' as const, value: { x: 'bad' as any } },
          ],
        },
      };
      expect(() => PolylineGraphicsZodSchema().parse(json)).toThrow();
    });
  });

  describe('polylineGraphicsToJSON', () => {
    it('should convert PolylineGraphics instance to JSON', () => {
      const instance = new PolylineGraphics({
        show: true,
        positions: [
          new Cartesian3(0, 0, 0),
          new Cartesian3(1, 1, 1),
        ],
        width: WIDTH,
      });
      const result = PolylineGraphicsToJSON(instance);
      expect(result?.parser).toBe('PolylineGraphics');
      expect(result?.value.show).toBe(true);
      expect(result?.value.width).toBe(WIDTH);
      expect(result?.value.positions).toEqual(POSITIONS);
    });

    it('should return undefined for undefined input', () => {
      const result = PolylineGraphicsToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new PolylineGraphics({ show: true, width: WIDTH });
      const result = PolylineGraphicsToJSON(instance, undefined, ['width']);
      expect(result?.value.width).toBeUndefined();
      expect(result?.value.show).toBe(true);
    });

    it('should evaluate dynamic property by time', () => {
      const instance = new PolylineGraphics({ width: WIDTH });
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      instance.show = new CallbackProperty(((time: JulianDate) => JulianDate.greaterThan(time, threshold)) as any, false);
      const before = PolylineGraphicsToJSON(instance, timeBefore);
      const after = PolylineGraphicsToJSON(instance, timeAfter);
      expect(before?.value.show).toBe(false);
      expect(after?.value.show).toBe(true);
    });
  });

  describe('polylineGraphicsFromJSON', () => {
    it('should convert JSON to PolylineGraphics instance', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          positions: POSITIONS,
          width: WIDTH,
        },
      };
      const result = PolylineGraphicsFromJSON(json);
      expect(result).toBeInstanceOf(PolylineGraphics);
      expect(toPropertyValue(result?.show)).toBe(true);
      expect(toPropertyValue(result?.width)).toBe(WIDTH);
      const positions = toPropertyValue(result?.positions) as Cartesian3[];
      expect(positions).toHaveLength(2);
      expect(positions[0].x).toBe(0);
      expect(positions[1].x).toBe(1);
    });

    it('should round-trip positions', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: {
          show: true,
          positions: POSITIONS,
          width: WIDTH,
        },
      };
      const again = PolylineGraphicsToJSON(PolylineGraphicsFromJSON(json)!);
      expect(again?.value.positions).toEqual(POSITIONS);
    });

    it('should return undefined for undefined input', () => {
      const result = PolylineGraphicsFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should reuse the result instance when provided', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: { show: true, width: WIDTH },
      };
      const result = new PolylineGraphics({ show: false });
      const output = PolylineGraphicsFromJSON(json, result);
      expect(output).toBe(result);
      expect(toPropertyValue(output?.width)).toBe(WIDTH);
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'PolylineGraphics' as const,
        value: { show: true, width: WIDTH },
      };
      const result = PolylineGraphicsFromJSON(json, undefined, ['width']);
      expect(toPropertyValue(result?.width)).toBeUndefined();
      expect(toPropertyValue(result?.show)).toBe(true);
    });
  });
});
