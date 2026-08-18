import { PointPrimitiveCollection } from 'cesium';
import { z } from 'zod';
import { BlendOptionFromJSON, BlendOptionToJSON, BlendOptionZodSchema } from './BlendOption';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';
import { PointPrimitiveFromJSON, PointPrimitiveToJSON, PointPrimitiveZodSchema } from './PointPrimitive';

export function PointPrimitiveCollectionZodSchema() {
  return z.object({
    parser: z.literal('PointPrimitiveCollection'),
    value: z.object({
      blendOption: BlendOptionZodSchema().optional(),
      debugShowBoundingVolume: z.boolean().optional(),
      modelMatrix: Matrix4ZodSchema().optional(),
      points: z.array(PointPrimitiveZodSchema()),
      show: z.boolean().optional(),
    }),
  });
}

export type PointPrimitiveCollectionJSON = z.infer<ReturnType<typeof PointPrimitiveCollectionZodSchema>>;

export function PointPrimitiveCollectionToJSON(instance?: PointPrimitiveCollection): PointPrimitiveCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PointPrimitiveCollection).parse(instance);
  return PointPrimitiveCollectionZodSchema().parse({
    parser: 'PointPrimitiveCollection',
    value: {
      blendOption: BlendOptionToJSON(instance.blendOption),
      debugShowBoundingVolume: instance.debugShowBoundingVolume,
      modelMatrix: Matrix4ToJSON(instance.modelMatrix),
      points: Array.from({ length: instance.length }, (_, index) => PointPrimitiveToJSON(instance.get(index))),
      show: instance.show,
    },
  });
}

export function PointPrimitiveCollectionFromJSON(json: PointPrimitiveCollectionJSON): PointPrimitiveCollection {
  const parsed = PointPrimitiveCollectionZodSchema().parse(json).value;
  const collection = new PointPrimitiveCollection({
    blendOption: BlendOptionFromJSON(parsed.blendOption),
    debugShowBoundingVolume: parsed.debugShowBoundingVolume,
    modelMatrix: Matrix4FromJSON(parsed.modelMatrix),
    show: parsed.show,
  });
  parsed.points.forEach(point => PointPrimitiveFromJSON(point, collection));
  return collection;
}
