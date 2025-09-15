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
export function PlaneGraphicsToJSON(instance?: PlaneGraphics, time?: JulianDate): PlaneGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PlaneGraphics).parse(instance);
  return {
    parser: 'PlaneGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      plane: PlaneToJSON(toPropertyValue(instance.plane, time)),
      dimensions: Cartesian2ToJSON(toPropertyValue(instance.dimensions, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.PlaneGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PlaneGraphicsFromJSON(json?: PlaneGraphicsJSON, result?: PlaneGraphics): PlaneGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = PlaneGraphicsZodSchema().parse(result);
  const instance = new PlaneGraphics({
    show: json.value.show,
    plane: PlaneFromJSON(json.value.plane),
    dimensions: Cartesian2FromJSON(json.value.dimensions),
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
