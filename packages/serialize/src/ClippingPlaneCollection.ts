import { ClippingPlaneCollection } from 'cesium';
import { z } from 'zod';
import { ClippingPlaneParse } from './ClippingPlane';
import { ColorParse } from './Color';
import { Matrix4Parse } from './Matrix4';

export type ClippingPlaneCollectionJSON = z.infer<typeof ClippingPlaneCollectionParse.zodJsonchema>;

/**
 * Serialize a `ClippingPlaneCollection` instance to JSON and deserialize from JSON
 */
export class ClippingPlaneCollectionParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    planes: z.array(ClippingPlaneParse.zodJsonchema),
    enabled: z.boolean(),
    modelMatrix: Matrix4Parse.zodJsonchema,
    unionClippingRegions: z.boolean(),
    edgeColor: ColorParse.zodJsonchema,
    edgeWidth: z.number(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(ClippingPlaneCollection);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClippingPlaneCollection): ClippingPlaneCollectionJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    const planes = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
    return {
      planes: planes.map(item => ClippingPlaneParse.toJSON(item)!),
      enabled: instance.enabled,
      modelMatrix: Matrix4Parse.toJSON(instance?.modelMatrix)!,
      unionClippingRegions: instance.unionClippingRegions,
      edgeColor: ColorParse.toJSON(instance?.edgeColor)!,
      edgeWidth: instance.edgeWidth,
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: ClippingPlaneCollectionJSON, result?: ClippingPlaneCollection): ClippingPlaneCollection | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const planes = json.planes.map(item => ClippingPlaneParse.fromJSON(item)!);
    const instance = new ClippingPlaneCollection({
      planes: json.planes.map(item => ClippingPlaneParse.fromJSON(item)!) ?? undefined,
      enabled: json.enabled ?? undefined,
      modelMatrix: Matrix4Parse.fromJSON(json?.modelMatrix)!,
      unionClippingRegions: json.unionClippingRegions ?? undefined,
      edgeColor: ColorParse.fromJSON(json?.edgeColor)!,
      edgeWidth: json.edgeWidth ?? undefined,
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
}
