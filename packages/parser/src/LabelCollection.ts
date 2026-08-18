import type { SceneRestoreOptions } from './primitive';
import { LabelCollection } from 'cesium';
import { z } from 'zod';
import { BlendOptionFromJSON, BlendOptionToJSON, BlendOptionZodSchema } from './BlendOption';
import { LabelFromJSON, LabelToJSON, LabelZodSchema } from './Label';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';

export function LabelCollectionZodSchema() {
  return z.object({
    parser: z.literal('LabelCollection'),
    value: z.object({
      blendOption: BlendOptionZodSchema().optional(),
      coarseDepthTestDistance: z.number().optional(),
      debugShowBoundingVolume: z.boolean().optional(),
      labels: z.array(LabelZodSchema()),
      modelMatrix: Matrix4ZodSchema().optional(),
      show: z.boolean().optional(),
      threePointDepthTestDistance: z.number().optional(),
    }),
  });
}

export type LabelCollectionJSON = z.infer<ReturnType<typeof LabelCollectionZodSchema>>;

export function LabelCollectionToJSON(instance?: LabelCollection): LabelCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(LabelCollection).parse(instance);
  return LabelCollectionZodSchema().parse({
    parser: 'LabelCollection',
    value: {
      blendOption: BlendOptionToJSON(instance.blendOption),
      coarseDepthTestDistance: instance.coarseDepthTestDistance,
      debugShowBoundingVolume: instance.debugShowBoundingVolume,
      labels: Array.from({ length: instance.length }, (_, index) => LabelToJSON(instance.get(index))),
      modelMatrix: Matrix4ToJSON(instance.modelMatrix),
      show: instance.show,
      threePointDepthTestDistance: instance.threePointDepthTestDistance,
    },
  });
}

export function LabelCollectionFromJSON(
  json: LabelCollectionJSON,
  options?: SceneRestoreOptions,
): LabelCollection {
  const parsed = LabelCollectionZodSchema().parse(json).value;
  const collection = new LabelCollection({
    blendOption: BlendOptionFromJSON(parsed.blendOption),
    coarseDepthTestDistance: parsed.coarseDepthTestDistance,
    debugShowBoundingVolume: parsed.debugShowBoundingVolume,
    modelMatrix: Matrix4FromJSON(parsed.modelMatrix),
    scene: options?.scene,
    show: parsed.show,
    threePointDepthTestDistance: parsed.threePointDepthTestDistance,
  });
  parsed.labels.forEach(label => LabelFromJSON(label, collection));
  return collection;
}
