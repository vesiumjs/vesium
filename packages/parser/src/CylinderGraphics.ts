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
export function CylinderGraphicsToJSON(instance?: CylinderGraphics, time?: JulianDate, omit?: keyof CylinderGraphics): CylinderGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CylinderGraphics).parse(instance);
  return {
    parser: 'CylinderGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      length: omit?.includes('length') ? undefined : toPropertyValue(instance.length, time),
      topRadius: omit?.includes('topRadius') ? undefined : toPropertyValue(instance.topRadius, time),
      bottomRadius: omit?.includes('bottomRadius') ? undefined : toPropertyValue(instance.bottomRadius, time),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      fill: omit?.includes('fill') ? undefined : toPropertyValue(instance.fill, time),
      material: omit?.includes('material') ? undefined : MaterialPropertyToJSON(toPropertyValue(instance.material, time)),
      outline: omit?.includes('outline') ? undefined : toPropertyValue(instance.outline, time),
      outlineColor: omit?.includes('outlineColor') ? undefined : ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: omit?.includes('outlineWidth') ? undefined : toPropertyValue(instance.outlineWidth, time),
      numberOfVerticalLines: omit?.includes('numberOfVerticalLines') ? undefined : toPropertyValue(instance.numberOfVerticalLines, time),
      slices: omit?.includes('slices') ? undefined : toPropertyValue(instance.slices, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.CylinderGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function CylinderGraphicsFromJSON(json?: CylinderGraphicsJSON, result?: CylinderGraphics, omit?: keyof CylinderGraphics): CylinderGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = CylinderGraphicsZodSchema().parse(json);
  const instance = new CylinderGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    length: omit?.includes('length') ? undefined : json.value.length,
    topRadius: omit?.includes('topRadius') ? undefined : json.value.topRadius,
    bottomRadius: omit?.includes('bottomRadius') ? undefined : json.value.bottomRadius,
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    fill: omit?.includes('fill') ? undefined : json.value.fill,
    material: omit?.includes('material') ? undefined : MaterialPropertyFromJSON(json.value.material),
    outline: omit?.includes('outline') ? undefined : json.value.outline,
    outlineColor: omit?.includes('outlineColor') ? undefined : ColorFromJSON(json.value.outlineColor),
    outlineWidth: omit?.includes('outlineWidth') ? undefined : json.value.outlineWidth,
    numberOfVerticalLines: omit?.includes('numberOfVerticalLines') ? undefined : json.value.numberOfVerticalLines,
    slices: omit?.includes('slices') ? undefined : json.value.slices,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
  });
  return result ? instance.clone(result) : instance;
}
