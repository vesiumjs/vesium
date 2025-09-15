import type { Cartesian3JSON } from './Cartesian3';
import { PolygonHierarchy } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';

export interface PolygonHierarchyJSON {
  positions: Cartesian3JSON[];
  holes: PolygonHierarchyJSON[];
}

/**
 * `Cesium.PolygonHierarchy` JSON ZodSchema
 */
export const PolygonHierarchyZodSchema: any = z.lazy(() => {
  return z.object({
    positions: z.array(Cartesian3ZodSchema()),
    holes: z.array(PolygonHierarchyZodSchema),
  });
});

/**
 * Convert `Cesium.PolygonHierarchy` instance to JSON
 */
export function PolygonHierarchyToJSON(instance?: PolygonHierarchy): PolygonHierarchyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolygonHierarchy).parse(instance);
  return {
    parser: 'PolygonHierarchy',
    value: {
      positions: instance.positions.map((item: any) => Cartesian3ToJSON(item)!),
      holes: instance.holes.map((item: any) => PolygonHierarchyToJSON(item)!),
    },
  };
}

/**
 * Convert JSON to `Cesium.PolygonHierarchy` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolygonHierarchyFromJSON(json?: PolygonHierarchyJSON, result?: PolygonHierarchy): PolygonHierarchy | undefined {
  if (!json) {
    return undefined;
  }
  json = PolygonHierarchyZodSchema().parse(result);
  const instance = new PolygonHierarchy(
    json!.positions?.map(item => Cartesian3FromJSON(item)!),
    json!.holes?.map(item => PolygonHierarchyFromJSON(item)!),
  );
  if (!result) {
    return instance;
  }
  result.positions = instance.positions;
  result.holes = instance.holes;
  return result;
}
