import type { SceneRestoreOptions } from './primitive';
import { BillboardCollection } from 'cesium';
import { z } from 'zod';
import { BillboardFromJSON, BillboardToJSON, BillboardZodSchema } from './Billboard';
import { BlendOptionFromJSON, BlendOptionToJSON, BlendOptionZodSchema } from './BlendOption';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';

export function BillboardCollectionZodSchema() {
  return z.object({
    parser: z.literal('BillboardCollection'),
    value: z.object({
      billboards: z.array(BillboardZodSchema()),
      blendOption: BlendOptionZodSchema().optional(),
      coarseDepthTestDistance: z.number().optional(),
      debugShowBoundingVolume: z.boolean().optional(),
      modelMatrix: Matrix4ZodSchema().optional(),
      show: z.boolean().optional(),
      threePointDepthTestDistance: z.number().optional(),
    }),
  });
}

export type BillboardCollectionJSON = z.infer<ReturnType<typeof BillboardCollectionZodSchema>>;

export function BillboardCollectionToJSON(instance?: BillboardCollection): BillboardCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(BillboardCollection).parse(instance);
  return BillboardCollectionZodSchema().parse({
    parser: 'BillboardCollection',
    value: {
      billboards: Array.from({ length: instance.length }, (_, index) => BillboardToJSON(instance.get(index))),
      blendOption: BlendOptionToJSON(instance.blendOption),
      coarseDepthTestDistance: instance.coarseDepthTestDistance,
      debugShowBoundingVolume: instance.debugShowBoundingVolume,
      modelMatrix: Matrix4ToJSON(instance.modelMatrix),
      show: instance.show,
      threePointDepthTestDistance: instance.threePointDepthTestDistance,
    },
  });
}

export function BillboardCollectionFromJSON(
  json: BillboardCollectionJSON,
  options?: SceneRestoreOptions,
): BillboardCollection {
  const parsed = BillboardCollectionZodSchema().parse(json).value;
  const collection = new BillboardCollection({
    blendOption: BlendOptionFromJSON(parsed.blendOption),
    coarseDepthTestDistance: parsed.coarseDepthTestDistance,
    debugShowBoundingVolume: parsed.debugShowBoundingVolume,
    modelMatrix: Matrix4FromJSON(parsed.modelMatrix),
    scene: options?.scene,
    show: parsed.show,
    threePointDepthTestDistance: parsed.threePointDepthTestDistance,
  });
  parsed.billboards.forEach(billboard => BillboardFromJSON(billboard, collection));
  return collection;
}
