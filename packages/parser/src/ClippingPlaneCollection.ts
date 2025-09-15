import { ClippingPlaneCollection } from 'cesium';
import { z } from 'zod';
import { ClippingPlaneFromJSON, ClippingPlaneToJSON, ClippingPlaneZodSchema } from './ClippingPlane';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';

/**
 * `Cesium.ClippingPlaneCollection` JSON ZodSchema
 */
export function ClippingPlaneCollectionZodSchema() {
  return z.object({
    parser: z.literal('ClippingPlaneCollection'),
    value: z.object({
      planes: z.array(ClippingPlaneZodSchema()),
      enabled: z.boolean(),
      modelMatrix: Matrix4ZodSchema(),
      unionClippingRegions: z.boolean(),
      edgeColor: ColorZodSchema(),
      edgeWidth: z.number(),
    }),
  });
}

export type ClippingPlaneCollectionJSON = z.infer<ReturnType<typeof ClippingPlaneCollectionZodSchema>>;

/**
 * Convert `Cesium.ClippingPlaneCollection` instance to JSON
 */
export function ClippingPlaneCollectionToJSON(instance?: ClippingPlaneCollection): ClippingPlaneCollectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(ClippingPlaneCollection).parse(instance);
  const planes = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
  return {
    parser: 'ClippingPlaneCollection',
    value: {
      planes: planes.map(item => ClippingPlaneToJSON(item)!),
      enabled: instance.enabled,
      modelMatrix: Matrix4ToJSON(instance.modelMatrix)!,
      unionClippingRegions: instance.unionClippingRegions,
      edgeColor: ColorToJSON(instance.edgeColor)!,
      edgeWidth: instance.edgeWidth,
    },
  };
}

/**
 * Convert JSON to `Cesium.ClippingPlaneCollection` instance
 * @param json - A JSON containing instance data
 */
export function ClippingPlaneCollectionFromJSON(json?: ClippingPlaneCollectionJSON, result?: ClippingPlaneCollection): ClippingPlaneCollection | undefined {
  if (!json) {
    return undefined;
  }
  json = ClippingPlaneCollectionZodSchema().parse(json);
  const planes = json.value.planes.map(item => ClippingPlaneFromJSON(item)!);
  const instance = new ClippingPlaneCollection({
    planes: json.value.planes.map(item => ClippingPlaneFromJSON(item)!),
    enabled: json.value.enabled,
    modelMatrix: Matrix4FromJSON(json.value.modelMatrix)!,
    unionClippingRegions: json.value.unionClippingRegions,
    edgeColor: ColorFromJSON(json.value.edgeColor)!,
    edgeWidth: json.value.edgeWidth,
  });
  if (!result) {
    return instance;
  }
  result.enabled = instance.enabled;
  result.modelMatrix = instance.modelMatrix;
  result.unionClippingRegions = instance.unionClippingRegions;
  result.edgeColor = instance.edgeColor;
  result.edgeWidth = instance.edgeWidth;
  result.removeAll();
  planes.forEach(item => result.add(item));
  return result;
}
