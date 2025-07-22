import type { JulianDate } from 'cesium';
import { PlaneGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';

import { Cartesian2Parse } from './Cartesian2';
import { ColorParse } from './Color';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { MaterialPropertyParse } from './MaterialProperty';
import { PlaneParse } from './Plane';

import { ShadowModeParse } from './ShadowMode';

export type PlaneGraphicsJSON = z.infer<typeof PlaneGraphicsParse.zodJsonchema>;

/**
 * Serialize a `PlaneGraphics` instance to JSON and deserialize from JSON
 */
export class PlaneGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly zodJsonchema = z.object({
    show: z.boolean().optional(),
    plane: PlaneParse.zodJsonchema.optional(),
    dimensions: Cartesian2Parse.zodJsonchema.optional(),
    fill: z.boolean().optional(),
    material: MaterialPropertyParse.zodJsonchema.optional(),
    outline: z.boolean().optional(),
    outlineColor: ColorParse.zodJsonchema.optional(),
    outlineWidth: z.number().optional(),
    shadows: ShadowModeParse.zodJsonchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.zodJsonchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly zodInstanceSchema = z.instanceof(PlaneGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PlaneGraphics, time?: JulianDate): PlaneGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.zodInstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      plane: PlaneParse.toJSON(toPropertyValue(instance.plane, time)),
      dimensions: Cartesian2Parse.toJSON(toPropertyValue(instance.dimensions, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyParse.toJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PlaneGraphicsJSON, result?: PlaneGraphics): PlaneGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.zodJsonchema.parse(result);
    const instance = new PlaneGraphics({
      show: json.show ?? undefined,
      plane: PlaneParse.fromJSON(json?.plane),
      dimensions: Cartesian2Parse.fromJSON(json?.dimensions),
      fill: json.fill ?? undefined,
      material: MaterialPropertyParse.fromJSON(json?.material),
      outline: json.outline ?? undefined,
      outlineColor: ColorParse.fromJSON(json?.outlineColor),
      outlineWidth: json.outlineWidth ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
