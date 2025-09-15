import type { JulianDate } from 'cesium';
import { ModelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { ClippingPlaneCollectionFromJSON, ClippingPlaneCollectionToJSON, ClippingPlaneCollectionZodSchema } from './ClippingPlaneCollection';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { ColorBlendModeFromJSON, ColorBlendModeToJSON, ColorBlendModeZodSchema } from './ColorBlendMode';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { PropertyBagFromJSON, PropertyBagToJSON, PropertyBagZodSchema } from './PropertyBag';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';

/**
 * `Cesium.ModelGraphics` JSON ZodSchema
 */
export function ModelGraphicsZodSchema() {
  return z.object({
    parser: z.literal('ModelGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      uri: z.string().optional(),
      scale: z.number().optional(),
      enableVerticalExaggeration: z.boolean().optional(),
      minimumPixelSize: z.number().optional(),
      maximumScale: z.number().optional(),
      incrementallyLoadTextures: z.boolean().optional(),
      runAnimations: z.boolean().optional(),
      clampAnimations: z.boolean().optional(),
      shadows: ShadowModeZodSchema().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      silhouetteColor: ColorZodSchema().optional(),
      silhouetteSize: z.number().optional(),
      color: ColorZodSchema().optional(),
      colorBlendMode: ColorBlendModeZodSchema().optional(),
      colorBlendAmount: z.number().optional(),
      imageBasedLightingFactor: Cartesian2ZodSchema().optional(),
      lightColor: ColorZodSchema().optional(),
      distanceDisplayCondition: DistanceDisplayConditionZodSchema().optional(),
      nodeTransformations: PropertyBagZodSchema().optional(),
      articulations: PropertyBagZodSchema().optional(),
      clippingPlanes: ClippingPlaneCollectionZodSchema().optional(),
      // customShader: CustomShaderZodSchema().optional(),
    }),
  });
}

export type ModelGraphicsJSON = z.infer<ReturnType<typeof ModelGraphicsZodSchema>>;

/**
 * Convert `Cesium.ModelGraphics` instance to JSON
 */
export function ModelGraphicsToJSON(instance?: ModelGraphics, time?: JulianDate, omit?: keyof ModelGraphics): ModelGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(ModelGraphics).parse(instance);
  return {
    parser: 'ModelGraphics',
    value: {
      show: omit?.includes('show') ? undefined : toPropertyValue(instance.show, time),
      uri: omit?.includes('uri') ? undefined : toPropertyValue(instance.uri, time),
      scale: omit?.includes('scale') ? undefined : toPropertyValue(instance.scale, time),
      enableVerticalExaggeration: omit?.includes('enableVerticalExaggeration') ? undefined : toPropertyValue(instance.enableVerticalExaggeration, time),
      minimumPixelSize: omit?.includes('minimumPixelSize') ? undefined : toPropertyValue(instance.minimumPixelSize, time),
      maximumScale: omit?.includes('maximumScale') ? undefined : toPropertyValue(instance.maximumScale, time),
      incrementallyLoadTextures: omit?.includes('incrementallyLoadTextures') ? undefined : toPropertyValue(instance.incrementallyLoadTextures, time),
      runAnimations: omit?.includes('runAnimations') ? undefined : toPropertyValue(instance.runAnimations, time),
      clampAnimations: omit?.includes('clampAnimations') ? undefined : toPropertyValue(instance.clampAnimations, time),
      shadows: omit?.includes('shadows') ? undefined : ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      silhouetteColor: omit?.includes('silhouetteColor') ? undefined : ColorToJSON(toPropertyValue(instance.silhouetteColor, time)),
      silhouetteSize: omit?.includes('silhouetteSize') ? undefined : toPropertyValue(instance.silhouetteSize, time),
      color: omit?.includes('color') ? undefined : ColorToJSON(toPropertyValue(instance.color, time)),
      colorBlendMode: omit?.includes('colorBlendMode') ? undefined : ColorBlendModeToJSON(toPropertyValue(instance.colorBlendMode, time)),
      colorBlendAmount: omit?.includes('colorBlendAmount') ? undefined : toPropertyValue(instance.colorBlendAmount, time),
      imageBasedLightingFactor: omit?.includes('imageBasedLightingFactor') ? undefined : Cartesian2ToJSON(toPropertyValue(instance.imageBasedLightingFactor, time)),
      lightColor: omit?.includes('lightColor') ? undefined : ColorToJSON(toPropertyValue(instance.lightColor, time)),
      distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      nodeTransformations: omit?.includes('nodeTransformations') ? undefined : PropertyBagToJSON(toPropertyValue(instance.nodeTransformations, time)),
      articulations: omit?.includes('articulations') ? undefined : PropertyBagToJSON(toPropertyValue(instance.articulations, time)),
      clippingPlanes: omit?.includes('clippingPlanes') ? undefined : ClippingPlaneCollectionToJSON(toPropertyValue(instance.clippingPlanes, time)),
    // customShader: omit?.includes('customShader') ? undefined :CustomShaderToJSON(toPropertyValue(instance.customShader, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.ModelGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ModelGraphicsFromJSON(json?: ModelGraphicsJSON, result?: ModelGraphics, omit?: keyof ModelGraphics): ModelGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = ModelGraphicsZodSchema().parse(json);
  const instance = new ModelGraphics({
    show: omit?.includes('show') ? undefined : json.value.show,
    uri: omit?.includes('uri') ? undefined : json.value.uri,
    scale: omit?.includes('scale') ? undefined : json.value.scale,
    enableVerticalExaggeration: omit?.includes('enableVerticalExaggeration') ? undefined : json.value.enableVerticalExaggeration,
    minimumPixelSize: omit?.includes('minimumPixelSize') ? undefined : json.value.minimumPixelSize,
    maximumScale: omit?.includes('maximumScale') ? undefined : json.value.maximumScale,
    incrementallyLoadTextures: omit?.includes('incrementallyLoadTextures') ? undefined : json.value.incrementallyLoadTextures,
    runAnimations: omit?.includes('runAnimations') ? undefined : json.value.runAnimations,
    clampAnimations: omit?.includes('clampAnimations') ? undefined : json.value.clampAnimations,
    shadows: omit?.includes('shadows') ? undefined : ShadowModeFromJSON(json.value.shadows),
    heightReference: omit?.includes('heightReference') ? undefined : HeightReferenceFromJSON(json.value.heightReference),
    silhouetteColor: omit?.includes('silhouetteColor') ? undefined : ColorFromJSON(json.value.silhouetteColor),
    silhouetteSize: omit?.includes('silhouetteSize') ? undefined : json.value.silhouetteSize,
    color: omit?.includes('color') ? undefined : ColorFromJSON(json.value.color),
    colorBlendMode: omit?.includes('colorBlendMode') ? undefined : ColorBlendModeFromJSON(json.value.colorBlendMode),
    colorBlendAmount: omit?.includes('colorBlendAmount') ? undefined : json.value.colorBlendAmount,
    imageBasedLightingFactor: omit?.includes('imageBasedLightingFactor') ? undefined : Cartesian2FromJSON(json.value.imageBasedLightingFactor),
    lightColor: omit?.includes('lightColor') ? undefined : ColorFromJSON(json.value.lightColor),
    distanceDisplayCondition: omit?.includes('distanceDisplayCondition') ? undefined : DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    nodeTransformations: omit?.includes('nodeTransformations') ? undefined : PropertyBagFromJSON(json.value.nodeTransformations),
    articulations: omit?.includes('articulations') ? undefined : PropertyBagFromJSON(json.value.articulations),
    clippingPlanes: omit?.includes('clippingPlanes') ? undefined : ClippingPlaneCollectionFromJSON(json.value.clippingPlanes),
    // customShader: omit?.includes('customShader') ? undefined :CustomShaderFromJSON(json.value.customShader),
  });
  return result ? instance.clone(result) : instance;
}
