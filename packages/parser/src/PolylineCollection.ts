import { PolylineCollection } from 'cesium';
import { z } from 'zod';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';
import { PolylineFromJSON, PolylineToJSON, PolylineZodSchema } from './Polyline';

export function PolylineCollectionZodSchema() {
  return z.object({
    parser: z.literal('PolylineCollection'),
    value: z.object({
      debugShowBoundingVolume: z.boolean().optional(),
      modelMatrix: Matrix4ZodSchema().optional(),
      polylines: z.array(PolylineZodSchema()),
      show: z.boolean().optional(),
    }),
  });
}

export type PolylineCollectionJSON = z.infer<ReturnType<typeof PolylineCollectionZodSchema>>;

export function PolylineCollectionToJSON(instance?: PolylineCollection): PolylineCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolylineCollection).parse(instance);
  return PolylineCollectionZodSchema().parse({
    parser: 'PolylineCollection',
    value: {
      debugShowBoundingVolume: instance.debugShowBoundingVolume,
      modelMatrix: Matrix4ToJSON(instance.modelMatrix),
      polylines: Array.from({ length: instance.length }, (_, index) => PolylineToJSON(instance.get(index))),
      show: instance.show,
    },
  });
}

export function PolylineCollectionFromJSON(json: PolylineCollectionJSON): PolylineCollection {
  const parsed = PolylineCollectionZodSchema().parse(json).value;
  const collection = new PolylineCollection({
    debugShowBoundingVolume: parsed.debugShowBoundingVolume,
    modelMatrix: Matrix4FromJSON(parsed.modelMatrix),
    show: parsed.show,
  });
  parsed.polylines.forEach(polyline => PolylineFromJSON(polyline, collection));
  return collection;
}
