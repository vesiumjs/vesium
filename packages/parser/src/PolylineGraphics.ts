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
export function PolylineGraphicsToJSON(instance?: PolylineGraphics, time?: JulianDate, omit?: keyof PolylineGraphics): PolylineGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PolylineGraphics).parse(instance);
  return {
    parser: 'PolylineGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      positions: omit?.includes('positions') ? undefined : toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3ToJSON(item)),
      width: omit?.includes('width') ? undefined : toPropertyValue(instance.width, time),
      granularity: omit?.includes('granularity') ? undefined : toPropertyValue(instance.granularity, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      depthFailMaterial: omit?.includes('depthFailMaterial') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.depthFailMaterial, time)),
      arcType: omit?.includes('arcType') ? undefined : ArcTypeToJSON(toPropertyValue(instance.arcType, time)),
      clampToGround: omit?.includes('clampToGround') ? undefined : toPropertyValue(instance.clampToGround, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeToJSON(toPropertyValue(instance.classificationType, time)),
      zIndex: omit?.includes('zIndex') ? undefined : toPropertyValue(instance.zIndex, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.PolylineGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PolylineGraphicsFromJSON(json?: PolylineGraphicsJSON, result?: PolylineGraphics, omit?: keyof PolylineGraphics): PolylineGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PolylineGraphicsZodSchema().parse(json);
  const instance = new PolylineGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    positions: omit?.includes('positions') ? undefined : json.value.positions?.map(item => Cartesian3FromJSON(item)!),
    width: omit?.includes('width') ? undefined : json.value.width,
    granularity: omit?.includes('granularity') ? undefined : json.value.granularity,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    depthFailMaterial: omit?.includes('depthFailMaterial') ? undefined : MaterialPropertyFromJSON(json.value.depthFailMaterial),
    arcType: omit?.includes('arcType') ? undefined : ArcTypeFromJSON(json.value.arcType),
    clampToGround: omit?.includes('clampToGround') ? undefined : json.value.clampToGround,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    classificationType: omit?.includes('classificationType') ? undefined : ClassificationTypeFromJSON(json.value.classificationType),
    zIndex: omit?.includes('zIndex') ? undefined : json.value.zIndex,
  });
  return result ? instance.clone(result) : instance;
}
