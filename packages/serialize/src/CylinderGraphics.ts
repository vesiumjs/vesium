import type { JulianDate } from 'cesium';
import { CylinderGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { MaterialPropertyFromJSON, MaterialPropertyToJSON, MaterialPropertyZodSchema } from './MaterialProperty';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.CylinderGraphics` JSON ZodSchema
 */
export function CylinderGraphicsZodSchema() {
  return z.object({
    parser: z.literal('CylinderGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      length: z.number().optional(),
      topRadius: z.number().optional(),
      bottomRadius: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      fill: z.boolean().optional(),
      material: MaterialPropertyZodSchema().optional(),
      outline: z.boolean().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      numberOfVerticalLines: z.number().optional(),
      slices: z.number().optional(),
      shadows: ShadowModeZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
    }),
  });
}

export type CylinderGraphicsJSON = z.infer<ReturnType<typeof CylinderGraphicsZodSchema>>;

/**
 * Convert `Cesium.CylinderGraphics` instance to JSON
 */
export function CylinderGraphicsToJSON(instance?: CylinderGraphics, time?: JulianDate): CylinderGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CylinderGraphics).parse(instance);
  return {
    parser: 'CylinderGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      length: toPropertyValue(instance.length, time),
      topRadius: toPropertyValue(instance.topRadius, time),
      bottomRadius: toPropertyValue(instance.bottomRadius, time),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fill: toPropertyValue(instance.fill, time),
      material: MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: toPropertyValue(instance.outline, time),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
      numberOfVerticalLines: toPropertyValue(instance.numberOfVerticalLines, time),
      slices: toPropertyValue(instance.slices, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.CylinderGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function CylinderGraphicsFromJSON(json?: CylinderGraphicsJSON, result?: CylinderGraphics): CylinderGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = CylinderGraphicsZodSchema().parse(result);
  const instance = new CylinderGraphics({
    show: json.value.show,
    length: json.value.length,
    topRadius: json.value.topRadius,
    bottomRadius: json.value.bottomRadius,
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    fill: json.value.fill,
    material: MaterialPropertyFromJSON(json.value.material),
    outline: json.value.outline,
    outlineColor: ColorFromJSON(json.value.outlineColor),
    outlineWidth: json.value.outlineWidth,
    numberOfVerticalLines: json.value.numberOfVerticalLines,
    slices: json.value.slices,
    shadows: ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
