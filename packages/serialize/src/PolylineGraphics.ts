import type { JulianDate } from 'cesium';
import { PolylineGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ArcTypeParse } from './ArcType';
import { Cartesian3Parse } from './Cartesian3';
import { ClassificationTypeParse } from './ClassificationType';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { MaterialPropertyParse } from './MaterialProperty';

import { ShadowModeParse } from './ShadowMode';

export type PolylineGraphicsJSON = z.infer<typeof PolylineGraphicsParse.zodJsonchema>;

/**
 * Serialize a `PolylineGraphics` instance to JSON and deserialize from JSON
 */
export class PolylineGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    positions: z.array(Cartesian3Parse.zodJsonchema).optional(),
    width: z.number().optional(),
    granularity: z.number().optional(),
    material: MaterialPropertyParse.zodJsonchema.optional(),
    depthFailMaterial: MaterialPropertyParse.zodJsonchema.optional(),
    arcType: ArcTypeParse.zodJsonchema.optional(),
    clampToGround: z.boolean().optional(),
    shadows: ShadowModeParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
    classificationType: ClassificationTypeParse.zodJsonchema.optional(),
    zIndex: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(PolylineGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolylineGraphics, time?: JulianDate): PolylineGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Parse.toJSON(item)),
      width: toPropertyValue(instance.width, time),
      granularity: toPropertyValue(instance.granularity, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      depthFailMaterial: MaterialPropertyParse.toJSON(toPropertyValue(instance.depthFailMaterial, time)),
      arcType: ArcTypeParse.toJSON(toPropertyValue(instance.arcType, time)),
      clampToGround: toPropertyValue(instance.clampToGround, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeParse.toJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PolylineGraphicsJSON, result?: PolylineGraphics): PolylineGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new PolylineGraphics({
      show: json.show ?? undefined,
      positions: json.positions?.map(item => Cartesian3Parse.fromJSON(item)!) ?? undefined,
      width: json.width ?? undefined,
      granularity: json.granularity ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      depthFailMaterial: MaterialPropertyParse.fromJSON(json?.depthFailMaterial),
      arcType: ArcTypeParse.fromJSON(json?.arcType),
      clampToGround: json.clampToGround ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      classificationType: ClassificationTypeParse.fromJSON(json?.classificationType),
      zIndex: json.zIndex ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
