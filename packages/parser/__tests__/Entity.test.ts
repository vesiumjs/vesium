import { Cartesian3, Color, ConstantPositionProperty, Entity } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityFromJSON, EntityToJSON, EntityZodSchema } from '../src/Entity';

describe('entity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('entityZodSchema', () => {
    it('should parse valid JSON with basic values', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'test-entity',
          name: 'Test Entity',
          show: true,
          description: 'A test entity',
          position: {
            parser: 'PositionProperty' as const,
            value: {
              parser: 'ConstantPositionProperty' as const,
              value: { x: 0, y: 0, z: 0 },
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.id).toBe('test-entity');
      expect(result.value.name).toBe('Test Entity');
    });

    it('should parse JSON with billboard graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'billboard-entity',
          billboard: {
            parser: 'BillboardGraphics' as const,
            value: {
              show: true,
              image: 'icon.png',
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.billboard?.parser).toBe('BillboardGraphics');
    });

    it('should parse JSON with label graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'label-entity',
          label: {
            parser: 'LabelGraphics' as const,
            value: {
              show: true,
              text: 'Hello',
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.label?.parser).toBe('LabelGraphics');
    });

    it('should parse JSON with point graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'point-entity',
          point: {
            parser: 'PointGraphics' as const,
            value: {
              show: true,
              pixelSize: 10,
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.point?.parser).toBe('PointGraphics');
    });

    it('should parse JSON with polyline graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'polyline-entity',
          polyline: {
            parser: 'PolylineGraphics' as const,
            value: {
              show: true,
              positions: [
                { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } },
              ],
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.polyline?.parser).toBe('PolylineGraphics');
    });

    it('should parse JSON with polygon graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'polygon-entity',
          polygon: {
            parser: 'PolygonGraphics' as const,
            value: {
              show: true,
              hierarchy: {
                parser: 'PolygonHierarchy' as const,
                value: {
                  positions: [
                    { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                    { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } },
                    { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } },
                  ],
                },
              },
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.polygon?.parser).toBe('PolygonGraphics');
    });

    it('should parse JSON with ellipse graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'ellipse-entity',
          ellipse: {
            parser: 'EllipseGraphics' as const,
            value: {
              show: true,
              semiMajorAxis: 1000,
              semiMinorAxis: 500,
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.ellipse?.parser).toBe('EllipseGraphics');
    });

    it('should parse JSON with box graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'box-entity',
          box: {
            parser: 'BoxGraphics' as const,
            value: {
              show: true,
              dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } },
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.box?.parser).toBe('BoxGraphics');
    });

    it('should parse JSON with model graphics', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'model-entity',
          model: {
            parser: 'ModelGraphics' as const,
            value: {
              show: true,
              uri: 'model.glb',
            },
          },
        },
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value.model?.parser).toBe('ModelGraphics');
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

    it('should parse JSON with empty value object', () => {
      const json = {
        parser: 'Entity' as const,
        value: {},
      };
      const result = EntityZodSchema().parse(json);
      expect(result.value).toEqual({});
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
          position: {
            parser: 'PositionProperty' as const,
            value: {
              parser: 'ConstantPositionProperty' as const,
              value: { x: 1, y: 2, z: 3 },
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.position).toBeDefined();
    });

    it('should convert JSON with billboard', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'billboard-entity',
          billboard: {
            parser: 'BillboardGraphics' as const,
            value: {
              show: true,
              image: 'icon.png',
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.billboard).toBeDefined();
    });

    it('should convert JSON with label', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'label-entity',
          label: {
            parser: 'LabelGraphics' as const,
            value: {
              show: true,
              text: 'Hello World',
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.label).toBeDefined();
    });

    it('should convert JSON with point', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'point-entity',
          point: {
            parser: 'PointGraphics' as const,
            value: {
              show: true,
              pixelSize: 10,
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.point).toBeDefined();
    });

    it('should convert JSON with polyline', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'polyline-entity',
          polyline: {
            parser: 'PolylineGraphics' as const,
            value: {
              show: true,
              positions: [
                { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 1 } },
              ],
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.polyline).toBeDefined();
    });

    it('should convert JSON with polygon', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'polygon-entity',
          polygon: {
            parser: 'PolygonGraphics' as const,
            value: {
              show: true,
              hierarchy: {
                parser: 'PolygonHierarchy' as const,
                value: {
                  positions: [
                    { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
                    { parser: 'Cartesian3' as const, value: { x: 1, y: 0, z: 0 } },
                    { parser: 'Cartesian3' as const, value: { x: 0, y: 1, z: 0 } },
                  ],
                },
              },
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.polygon).toBeDefined();
    });

    it('should convert JSON with ellipse', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'ellipse-entity',
          ellipse: {
            parser: 'EllipseGraphics' as const,
            value: {
              show: true,
              semiMajorAxis: 1000,
              semiMinorAxis: 500,
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.ellipse).toBeDefined();
    });

    it('should convert JSON with box', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'box-entity',
          box: {
            parser: 'BoxGraphics' as const,
            value: {
              show: true,
              dimensions: { parser: 'Cartesian3' as const, value: { x: 10, y: 20, z: 30 } },
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.box).toBeDefined();
    });

    it('should convert JSON with model', () => {
      const json = {
        parser: 'Entity' as const,
        value: {
          id: 'model-entity',
          model: {
            parser: 'ModelGraphics' as const,
            value: {
              show: true,
              uri: 'model.glb',
            },
          },
        },
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
      expect(result?.model).toBeDefined();
    });

    it('should convert JSON with empty values', () => {
      const json = {
        parser: 'Entity' as const,
        value: {},
      };
      const result = EntityFromJSON(json);
      expect(result).toBeInstanceOf(Entity);
    });

    it('should reject invalid JSON structure', () => {
      const json = {
        parser: 'Cartesian3' as const,
        value: {},
      };
      expect(() => EntityFromJSON(json as any)).toThrow();
    });
  });
});
