import type { JulianDate } from 'cesium';
import { ModelGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2Parse } from './Cartesian2';
import { ClippingPlaneCollectionParse } from './ClippingPlaneCollection';
import { ColorParse } from './Color';
import { ColorBlendModeParse } from './ColorBlendMode';
import { DistanceDisplayConditionParse } from './DistanceDisplayCondition';
import { HeightReferenceParse } from './HeightReference';
import { PropertyBagParse } from './PropertyBag';

import { ShadowModeParse } from './ShadowMode';

export type ModelGraphicsJSON = z.infer<typeof ModelGraphicsParse.JsonSchema>;

/**
 * Serialize a `ModelGraphics` instance to JSON and deserialize from JSON
 */
export class ModelGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    uri: z.string().optional(),
    scale: z.number().optional(),
    enableVerticalExaggeration: z.boolean().optional(),
    minimumPixelSize: z.number().optional(),
    maximumScale: z.number().optional(),
    incrementallyLoadTextures: z.boolean().optional(),
    runAnimations: z.boolean().optional(),
    clampAnimations: z.boolean().optional(),
    shadows: ShadowModeParse.JsonSchema.optional(),
    heightReference: HeightReferenceParse.JsonSchema.optional(),
    silhouetteColor: ColorParse.JsonSchema.optional(),
    silhouetteSize: z.number().optional(),
    color: ColorParse.JsonSchema.optional(),
    colorBlendMode: ColorBlendModeParse.JsonSchema.optional(),
    colorBlendAmount: z.number().optional(),
    imageBasedLightingFactor: Cartesian2Parse.JsonSchema.optional(),
    lightColor: ColorParse.JsonSchema.optional(),
    distanceDisplayCondition: DistanceDisplayConditionParse.JsonSchema.optional(),
    nodeTransformations: PropertyBagParse.JsonSchema.optional(),
    articulations: PropertyBagParse.JsonSchema.optional(),
    clippingPlanes: ClippingPlaneCollectionParse.JsonSchema.optional(),
  // customShader: CustomShaderParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(ModelGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ModelGraphics, time?: JulianDate): ModelGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      uri: toPropertyValue(instance.uri, time),
      scale: toPropertyValue(instance.scale, time),
      enableVerticalExaggeration: toPropertyValue(instance.enableVerticalExaggeration, time),
      minimumPixelSize: toPropertyValue(instance.minimumPixelSize, time),
      maximumScale: toPropertyValue(instance.maximumScale, time),
      incrementallyLoadTextures: toPropertyValue(instance.incrementallyLoadTextures, time),
      runAnimations: toPropertyValue(instance.runAnimations, time),
      clampAnimations: toPropertyValue(instance.clampAnimations, time),
      shadows: ShadowModeParse.toJSON(toPropertyValue(instance.shadows, time)),
      heightReference: HeightReferenceParse.toJSON(toPropertyValue(instance.heightReference, time)),
      silhouetteColor: ColorParse.toJSON(toPropertyValue(instance.silhouetteColor, time)),
      silhouetteSize: toPropertyValue(instance.silhouetteSize, time),
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      colorBlendMode: ColorBlendModeParse.toJSON(toPropertyValue(instance.colorBlendMode, time)),
      colorBlendAmount: toPropertyValue(instance.colorBlendAmount, time),
      imageBasedLightingFactor: Cartesian2Parse.toJSON(toPropertyValue(instance.imageBasedLightingFactor, time)),
      lightColor: ColorParse.toJSON(toPropertyValue(instance.lightColor, time)),
      distanceDisplayCondition: DistanceDisplayConditionParse.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      nodeTransformations: PropertyBagParse.toJSON(toPropertyValue(instance.nodeTransformations, time)),
      articulations: PropertyBagParse.toJSON(toPropertyValue(instance.articulations, time)),
      clippingPlanes: ClippingPlaneCollectionParse.toJSON(toPropertyValue(instance.clippingPlanes, time)),
      // customShader: CustomShaderParse.toJSON(toPropertyValue(instance.customShader, time)),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ModelGraphicsJSON, result?: ModelGraphics): ModelGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new ModelGraphics({
      show: json.show ?? undefined,
      uri: json.uri ?? undefined,
      scale: json.scale ?? undefined,
      enableVerticalExaggeration: json.enableVerticalExaggeration ?? undefined,
      minimumPixelSize: json.minimumPixelSize ?? undefined,
      maximumScale: json.maximumScale ?? undefined,
      incrementallyLoadTextures: json.incrementallyLoadTextures ?? undefined,
      runAnimations: json.runAnimations ?? undefined,
      clampAnimations: json.clampAnimations ?? undefined,
      shadows: ShadowModeParse.fromJSON(json?.shadows),
      heightReference: HeightReferenceParse.fromJSON(json?.heightReference),
      silhouetteColor: ColorParse.fromJSON(json?.silhouetteColor),
      silhouetteSize: json.silhouetteSize ?? undefined,
      color: ColorParse.fromJSON(json?.color),
      colorBlendMode: ColorBlendModeParse.fromJSON(json?.colorBlendMode),
      colorBlendAmount: json.colorBlendAmount ?? undefined,
      imageBasedLightingFactor: Cartesian2Parse.fromJSON(json?.imageBasedLightingFactor),
      lightColor: ColorParse.fromJSON(json?.lightColor),
      distanceDisplayCondition: DistanceDisplayConditionParse.fromJSON(json?.distanceDisplayCondition),
      nodeTransformations: PropertyBagParse.fromJSON(json?.nodeTransformations),
      articulations: PropertyBagParse.fromJSON(json?.articulations),
      clippingPlanes: ClippingPlaneCollectionParse.fromJSON(json?.clippingPlanes),
      // customShader: CustomShaderParse.fromJSON(json?.customShader),
    });
    return result ? instance.clone(result) : instance;
  }
}
