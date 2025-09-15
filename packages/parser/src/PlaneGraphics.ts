import type { JulianDate } from 'cesium';
import { PlaneGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { PlaneFromJSON, PlaneToJSON, PlaneZodSchema } from './Plane';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.PlaneGraphics` JSON ZodSchema
 */
export function PlaneGraphicsZodSchema() {
  return z.object({
    parser: z.literal('PlaneGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      plane: PlaneZodSchema().optional(),
      dimensions: Cartesian2ZodSchema().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type PlaneGraphicsJSON = z.infer<ReturnType<typeof PlaneGraphicsZodSchema>>;

/**
 * Convert `Cesium.PlaneGraphics` instance to JSON
 */
export function PlaneGraphicsToJSON(instance?: PlaneGraphics, time?: JulianDate, omit?: keyof PlaneGraphics): PlaneGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PlaneGraphics).parse(instance);
  return {
    parser: 'PlaneGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      plane: omit?.includes('plane') ? undefined : PlaneToJSON(toPropertyValue(instance.plane, time)),
      dimensions: omit?.includes('dimensions') ? undefined : Cartesian2ToJSON(toPropertyValue(instance.dimensions, time)),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PlaneGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PlaneGraphicsFromJSON(json?: PlaneGraphicsJSON, result?: PlaneGraphics, omit?: keyof PlaneGraphics): PlaneGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PlaneGraphicsZodSchema().parse(json);
  const instance = new PlaneGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    plane: omit?.includes('plane') ? undefined : PlaneFromJSON(json.value.plane),
    dimensions: omit?.includes('dimensions') ? undefined : Cartesian2FromJSON(json.value.dimensions),
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
