import { PolygonHierarchy } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';

export type PolygonHierarchyJSON = z.infer<ReturnType<typeof PolygonHierarchyZodSchema>>;

/**
 * `Cesium.PolygonHierarchy` JSON ZodSchema
 */
export function PolygonHierarchyZodSchema(): z.ZodObject<{
  parser: z.ZodLiteral<'PolygonHierarchy'>;
  value: z.ZodObject<{
    positions: z.ZodArray<ReturnType<typeof Cartesian3ZodSchema>>;
    holes: z.ZodLazy<z.ZodOptional<z.ZodArray<ReturnType<typeof PolygonHierarchyZodSchema>>>>;
  }>;
}> {
  return z.object({
    parser: z.literal('PolygonHierarchy'),
    value: z.object({
      positions: z.array(Cartesian3ZodSchema()),
      holes: z.lazy(() => z.array(PolygonHierarchyZodSchema()).optional()),
    }),
  });
}
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
      positions: instance.positions.map(item => Cartesian3ToJSON(item)!),
      holes: instance.holes.map(item => PolygonHierarchyToJSON(item)!),
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
  json = PolygonHierarchyZodSchema().parse(json);
  const instance = new PolygonHierarchy(
    json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    json.value.holes?.map(item => PolygonHierarchyFromJSON(item)!),
  );
  if (!result) {
    return instance;
  }
  result.positions = instance.positions;
  result.holes = instance.holes;
  return result;
}
