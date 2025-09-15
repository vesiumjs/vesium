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
export function ModelGraphicsToJSON(instance?: ModelGraphics, time?: JulianDate): ModelGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(ModelGraphics).parse(instance);
  return {
    parser: 'ModelGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      uri: toPropertyValue(instance.uri, time),
      scale: toPropertyValue(instance.scale, time),
      enableVerticalExaggeration: toPropertyValue(instance.enableVerticalExaggeration, time),
      minimumPixelSize: toPropertyValue(instance.minimumPixelSize, time),
      maximumScale: toPropertyValue(instance.maximumScale, time),
      incrementallyLoadTextures: toPropertyValue(instance.incrementallyLoadTextures, time),
      runAnimations: toPropertyValue(instance.runAnimations, time),
      clampAnimations: toPropertyValue(instance.clampAnimations, time),
      shadows: ShadowModeToJSON(toPropertyValue(instance.shadows, time)),
      heightReference: HeightReferenceToJSON(toPropertyValue(instance.heightReference, time)),
      silhouetteColor: ColorToJSON(toPropertyValue(instance.silhouetteColor, time)),
      silhouetteSize: toPropertyValue(instance.silhouetteSize, time),
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      colorBlendMode: ColorBlendModeToJSON(toPropertyValue(instance.colorBlendMode, time)),
      colorBlendAmount: toPropertyValue(instance.colorBlendAmount, time),
      imageBasedLightingFactor: Cartesian2ToJSON(toPropertyValue(instance.imageBasedLightingFactor, time)),
      lightColor: ColorToJSON(toPropertyValue(instance.lightColor, time)),
      distanceDisplayCondition: DistanceDisplayConditionToJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      nodeTransformations: PropertyBagToJSON(toPropertyValue(instance.nodeTransformations, time)),
      articulations: PropertyBagToJSON(toPropertyValue(instance.articulations, time)),
      clippingPlanes: ClippingPlaneCollectionToJSON(toPropertyValue(instance.clippingPlanes, time)),
    // customShader: CustomShaderToJSON(toPropertyValue(instance.customShader, time)),
    },
  };
}

/**
 * Convert JSON to `Cesium.ModelGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ModelGraphicsFromJSON(json?: ModelGraphicsJSON, result?: ModelGraphics): ModelGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = ModelGraphicsZodSchema().parse(result);
  const instance = new ModelGraphics({
    show: json.value.show,
    uri: json.value.uri,
    scale: json.value.scale,
    enableVerticalExaggeration: json.value.enableVerticalExaggeration,
    minimumPixelSize: json.value.minimumPixelSize,
    maximumScale: json.value.maximumScale,
    incrementallyLoadTextures: json.value.incrementallyLoadTextures,
    runAnimations: json.value.runAnimations,
    clampAnimations: json.value.clampAnimations,
    shadows: ShadowModeFromJSON(json.value.shadows),
    heightReference: HeightReferenceFromJSON(json.value.heightReference),
    silhouetteColor: ColorFromJSON(json.value.silhouetteColor),
    silhouetteSize: json.value.silhouetteSize,
    color: ColorFromJSON(json.value.color),
    colorBlendMode: ColorBlendModeFromJSON(json.value.colorBlendMode),
    colorBlendAmount: json.value.colorBlendAmount,
    imageBasedLightingFactor: Cartesian2FromJSON(json.value.imageBasedLightingFactor),
    lightColor: ColorFromJSON(json.value.lightColor),
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(json.value.distanceDisplayCondition),
    nodeTransformations: PropertyBagFromJSON(json.value.nodeTransformations),
    articulations: PropertyBagFromJSON(json.value.articulations),
    clippingPlanes: ClippingPlaneCollectionFromJSON(json.value.clippingPlanes),
    // customShader: CustomShaderFromJSON(json.value.customShader),
  });
  return result ? instance.clone(result) : instance;
}
