import type { JulianDate } from 'cesium';
import { PolylineGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ArcTypeFromJSON, ArcTypeToJSON, ArcTypeZodSchema } from './ArcType';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.PolylineGraphics` JSON ZodSchema
 */
export function PolylineGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PolylineGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      positions: z.array(Cartesian3ZodSchema()).optional(),
      width: z.number().optional(),
      granularity: z.number().optional(),
      material: MaterialPropertyZodSchema().optional(),
      depthFailMaterial: MaterialPropertyZodSchema().optional(),
      arcType: ArcTypeZodSchema().optional(),
      clampToGround: z.boolean().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      classificationType: ClassificationTypeZodSchema().optional(),
      zIndex: z.number().optional(),
    }),
  });
}

export type PolylineGraphicsJSON = z.infer<ReturnType<typeof PolylineGraphicsZodSchema>>;

/**
 * Convert `Cesium.PolylineGraphics` instance to JSON
 */
export function PolylineGraphicsToJSON(instance?: PolylineGraphics, time?: JulianDate): PolylineGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolylineGraphics).parse(instance);
  return {
    parser: 'PolylineGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      width: toPropertyValue(instance.width, time),
      granularity: toPropertyValue(instance.granularity, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      depthFailMaterial: MaterialPropertyToJSON(toPropertyValue(instance.depthFailMaterial, time)),
      arcType: ArcTypeToJSON(toPropertyValue(instance.arcType, time)),
      clampToGround: toPropertyValue(instance.clampToGround, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.PolylineGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolylineGraphicsFromJSON(json?: PolylineGraphicsJSON, result?: PolylineGraphics): PolylineGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolylineGraphicsZodSchema().parse(json);
  const instance = new PolylineGraphics({
    show: json.value.show,
    positions: json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    width: json.value.width,
    granularity: json.value.granularity,
    material: MaterialPropertyFromJSON(json.value.material),
    depthFailMaterial: MaterialPropertyFromJSON(json.value.depthFailMaterial),
    arcType: ArcTypeFromJSON(json.value.arcType),
    clampToGround: json.value.clampToGround,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
