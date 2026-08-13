import type { PolygonHierarchyJSON } from '../PolygonHierarchy';
import { Cartesian3, PolygonHierarchy } from 'cesium';
import { describe, expect, it } from 'vitest';
import { PolygonHierarchyFromJSON, PolygonHierarchyToJSON, PolygonHierarchyZodSchema } from '../PolygonHierarchy';

const outer = [
  { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } },
  { parser: 'Cartesian3' as const, value: { x: 10, y: 0, z: 0 } },
  { parser: 'Cartesian3' as const, value: { x: 0, y: 10, z: 0 } },
];

const hole = [
  { parser: 'Cartesian3' as const, value: { x: 1, y: 1, z: 0 } },
  { parser: 'Cartesian3' as const, value: { x: 2, y: 1, z: 0 } },
  { parser: 'Cartesian3' as const, value: { x: 1, y: 2, z: 0 } },
];

describe('polygonHierarchy', () => {
  it('parses hierarchy with nested holes', () => {
    const json: PolygonHierarchyJSON = {
      parser: 'PolygonHierarchy',
      value: {
        positions: outer,
        holes: [{
          parser: 'PolygonHierarchy',
          value: { positions: hole },
        }],
      },
    };
    const result = PolygonHierarchyZodSchema().parse(json);
    expect(result.value.positions).toHaveLength(3);
    expect(result.value.holes).toHaveLength(1);
  });

  it('round-trips positions and holes', () => {
    const instance = new PolygonHierarchy(
      [new Cartesian3(0, 0, 0), new Cartesian3(10, 0, 0), new Cartesian3(0, 10, 0)],
      [new PolygonHierarchy([new Cartesian3(1, 1, 0), new Cartesian3(2, 1, 0), new Cartesian3(1, 2, 0)])],
    );
    const json = PolygonHierarchyToJSON(instance);
    const restored = PolygonHierarchyFromJSON(json);

    expect(json?.parser).toBe('PolygonHierarchy');
    expect(restored?.positions).toHaveLength(3);
    expect(restored?.positions[0].x).toBe(0);
    expect(restored?.holes).toHaveLength(1);
    expect(restored?.holes[0].positions[0].x).toBe(1);
  });

  it('reuses result parameter when provided', () => {
    const json: PolygonHierarchyJSON = {
      parser: 'PolygonHierarchy',
      value: {
        positions: outer,
      },
    };
    const result = new PolygonHierarchy([]);
    const output = PolygonHierarchyFromJSON(json, result);
    expect(output).toBe(result);
    expect(output!.positions).toHaveLength(3);
    expect(output!.positions[1].x).toBe(10);
  });

  it('returns undefined for nullish input', () => {
    expect(PolygonHierarchyToJSON(undefined)).toBeUndefined();
    expect(PolygonHierarchyFromJSON(undefined)).toBeUndefined();
  });
});
