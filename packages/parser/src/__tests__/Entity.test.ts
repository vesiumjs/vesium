import { CallbackProperty, Cartesian3, Color, ConstantPositionProperty, Entity, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { EntityFromJSON, EntityToJSON, EntityZodSchema } from '../Entity';

const POSITION_JSON = {
  parser: 'PositionProperty' as const,
  value: {
    parser: 'ConstantPositionProperty' as const,
    value: { x: 1, y: 2, z: 3 },
  },
};

const GRAPHICS_CASES = [
  { name: 'billboard', key: 'billboard', value: { parser: 'BillboardGraphics' as const, value: { show: true, image: 'icon.png' } } },
  { name: 'label', key: 'label', value: { parser: 'LabelGraphics' as const, value: { show: true, text: 'Hello' } } },
  { name: 'point', key: 'point', value: { parser: 'PointGraphics' as const, value: { show: true, pixelSize: 10 } } },
  { name: 'polyline', key: 'polyline', value: { parser: 'PolylineGraphics' as const, value: { show: true, positions: [{ parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } }, { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } }] } } },
  { name: 'polygon', key: 'polygon', value: { parser: 'PolygonGraphics' as const, value: { show: true, hierarchy: { parser: 'PolygonHierarchy' as const, value: { positions: [{ parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } }, { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } }, { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } }] } } } } },
  { name: 'ellipse', key: 'ellipse', value: { parser: 'EllipseGraphics' as const, value: { show: true, semiMajorAxis: 1000, semiMinorAxis: 500 } } },
  { name: 'box', key: 'box', value: { parser: 'BoxGraphics' as const, value: { show: true, dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } } } } },
  { name: 'model', key: 'model', value: { parser: 'ModelGraphics' as const, value: { show: true, uri: 'model.glb' } } },
] as const;

describe('entity', () => {
  describe('entityZodSchema', () => {
    it('should parse valid JSON with basic values', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'test-entity',
          name: 'Test Entity',
          show: true,
          description: 'A test entity',
          position: POSITION_JSON,
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.id).toBe('test-entity');
      expect(result.value.name).toBe('Test Entity');
    });

    it.each(GRAPHICS_CASES)('should parse JSON with $name graphics', ({ key, value }) => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: `${key}-entity`,
          [key]: value,
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value[key]?.parser).toBe(value.parser);
    });

    it('should parse JSON with availability', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'time-entity',
          availability: {
            parser: 'TimeIntervalCollection' as const,
            value: {
              intervals: [
                {
                  parser: 'TimeInterval' as const,
                  value: {
                    start: { parser: 'JulianDate' as const, value: '2024-01-01T00:00:00Z' },
                    stop: { parser: 'JulianDate' as const, value: '2024-12-31T23:59:59Z' },
                  },
                },
              ],
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.availability?.parser).toBe('TimeIntervalCollection');
    });

    it('should reject JSON with wrong parser type', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EntityZodSchema().parse(json)).toThrow();
    });
  });

  describe('entityToJSON', () => {
    it('should convert Entity instance to JSON', () => {
      const instance = new Entity({
        id: 'test-entity',
        name: 'Test Entity',
        show: true,
      });
      const result = EntityToJSON(instance);
      expect(result?.parser).toBe('Entity');
      expect(result?.value.id).toBe('test-entity');
      expect(result?.value.name).toBe('Test Entity');
      expect(result?.value.show).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      const result = EntityToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert Entity with position', () => {
      const instance = new Entity({
        position: new ConstantPositionProperty(new Cartesian3(1, 2, 3)),
      });
      const result = EntityToJSON(instance);
      expect(result?.parser).toBe('Entity');
      expect(result?.value.position?.parser).toBe('PositionProperty');
    });

    it('should convert Entity with billboard', () => {
      const instance = new Entity({
        billboard: {
          image: 'icon.png',
          show: true,
        },
      });
      const result = EntityToJSON(instance);
      expect(result?.parser).toBe('Entity');
      expect(result?.value.billboard?.parser).toBe('BillboardGraphics');
      expect(result?.value.billboard?.value.image).toBe('icon.png');
      expect(result?.value.billboard?.value.show).toBe(true);
    });

    it('should convert Entity with label', () => {
      const instance = new Entity({
        label: {
          text: 'Test Label',
          show: true,
        },
      });
      const result = EntityToJSON(instance);
      expect(result?.parser).toBe('Entity');
      expect(result?.value.label?.parser).toBe('LabelGraphics');
      expect(result?.value.label?.value.text).toBe('Test Label');
    });

    it('should convert Entity with point', () => {
      const instance = new Entity({
        point: {
          pixelSize: 10,
          color: new Color(1, 0, 0, 1),
        },
      });
      const result = EntityToJSON(instance);
      expect(result?.parser).toBe('Entity');
      expect(result?.value.point?.parser).toBe('PointGraphics');
      expect(result?.value.point?.value.pixelSize).toBe(10);
      expect(result?.value.point?.value.color?.value.red).toBe(1);
    });

    it('should convert Entity with multiple graphics', () => {
      const instance = new Entity({
        billboard: { image: 'icon.png' },
        label: { text: 'Test' },
        point: { pixelSize: 5 },
      });
      const result = EntityToJSON(instance);
      expect(result?.value.billboard).toBeDefined();
      expect(result?.value.label).toBeDefined();
      expect(result?.value.point).toBeDefined();
    });

    it('should omit a field when omit is provided', () => {
      const instance = new Entity({ id: 'test', name: 'Test', billboard: { image: 'icon.png' } });
      const result = EntityToJSON(instance, undefined, ['billboard']);
      expect(result?.value.billboard).toBeUndefined();
      expect(result?.value.id).toBe('test');
    });

    it('should evaluate dynamic property by time', () => {
      const timeBefore = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
      const timeAfter = JulianDate.fromIso8601('2030-01-01T00:00:00Z');
      const threshold = JulianDate.fromIso8601('2025-01-01T00:00:00Z');
      const instance = new Entity({ id: 'test' });
      instance.description = new CallbackProperty(
        ((time: JulianDate) => JulianDate.greaterThan(time, threshold) ? 'after' : 'before') as any,
        false,
      );
      const before = EntityToJSON(instance, timeBefore);
      const after = EntityToJSON(instance, timeAfter);
      expect(before?.value.description).toBe('before');
      expect(after?.value.description).toBe('after');
    });
  });

  describe('entityFromJSON', () => {
    it('should convert JSON to Entity instance', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'test-entity',
          name: 'Test Entity',
          show: true,
          description: 'A test entity',
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.id).toBe('test-entity');
      expect(result?.name).toBe('Test Entity');
      expect(result?.show).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      const result = EntityFromJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert JSON with position', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'position-entity',
          position: POSITION_JSON,
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.position).toBeDefined();
    });

    it.each(GRAPHICS_CASES)('should convert JSON with $name', ({ key, value }) => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: `${key}-entity`,
          [key]: value,
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect((result as any)?.[key]).toBeDefined();
    });

    it('should omit a field when omit is provided', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'test',
          name: 'Test',
          billboard: { parser: 'BillboardGraphics' as const, value: { image: 'icon.png' } },
        },
      };
      const result = EntityFromJSON(json, ['billboard']);
      expect(result?.billboard).toBeUndefined();
      expect(result?.id).toBe('test');
    });
  });
});
