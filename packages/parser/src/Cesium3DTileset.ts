import type { Cesium3DTileset } from 'cesium';
import type { SceneRestoreOptions } from './primitive';
import { Cesium3DTileset as Cesium3DTilesetClass } from 'cesium';
import { z } from 'zod';
import { AxisFromJSON, AxisToJSON, AxisZodSchema } from './Axis';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ClassificationTypeFromJSON, ClassificationTypeToJSON, ClassificationTypeZodSchema } from './ClassificationType';
import { ClippingPlaneCollectionFromJSON, ClippingPlaneCollectionToJSON, ClippingPlaneCollectionZodSchema } from './ClippingPlaneCollection';
import { EdgeDisplayModeFromJSON, EdgeDisplayModeToJSON, EdgeDisplayModeZodSchema } from './EdgeDisplayMode';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { HeightReferenceFromJSON, HeightReferenceToJSON, HeightReferenceZodSchema } from './HeightReference';
import { Matrix4FromJSON, Matrix4ToJSON, Matrix4ZodSchema } from './Matrix4';
import { assertSceneForHeightReference } from './primitive';
import { readPrivate } from './private';
import { ShadowModeFromJSON, ShadowModeToJSON, ShadowModeZodSchema } from './ShadowMode';
import { SplitDirectionFromJSON, SplitDirectionToJSON, SplitDirectionZodSchema } from './SplitDirection';

export function Cesium3DTilesetZodSchema() {
  return z.object({
    parser: z.literal('Cesium3DTileset'),
    value: z.object({
      asynchronouslyLoadImagery: z.boolean().optional(),
      backFaceCulling: z.boolean().optional(),
      baseScreenSpaceError: z.number().optional(),
      cacheBytes: z.number().nonnegative().optional(),
      classificationType: ClassificationTypeZodSchema().optional(),
      clippingPlanes: ClippingPlaneCollectionZodSchema().optional(),
      cullRequestsWhileMoving: z.boolean().optional(),
      cullRequestsWhileMovingMultiplier: z.number().optional(),
      cullWithChildrenBounds: z.boolean().optional(),
      debugColorizeTiles: z.boolean().optional(),
      debugFreezeFrame: z.boolean().optional(),
      debugHeatmapTilePropertyName: z.string().optional(),
      debugShowBoundingVolume: z.boolean().optional(),
      debugShowContentBoundingVolume: z.boolean().optional(),
      debugShowGeometricError: z.boolean().optional(),
      debugShowMemoryUsage: z.boolean().optional(),
      debugShowRenderingStatistics: z.boolean().optional(),
      debugShowUrl: z.boolean().optional(),
      debugShowViewerRequestVolume: z.boolean().optional(),
      debugWireframe: z.boolean().optional(),
      dynamicScreenSpaceError: z.boolean().optional(),
      dynamicScreenSpaceErrorDensity: z.number().optional(),
      dynamicScreenSpaceErrorFactor: z.number().optional(),
      dynamicScreenSpaceErrorHeightFalloff: z.number().optional(),
      edgeDisplayMode: EdgeDisplayModeZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      enableCollision: z.boolean().optional(),
      enableDebugWireframe: z.boolean().optional(),
      enablePick: z.boolean().optional(),
      enableShowOutline: z.boolean().optional(),
      featureIdLabel: z.string().optional(),
      foveatedConeSize: z.number().optional(),
      foveatedMinimumScreenSpaceErrorRelaxation: z.number().optional(),
      foveatedScreenSpaceError: z.boolean().optional(),
      foveatedTimeDelay: z.number().optional(),
      heightReference: HeightReferenceZodSchema().optional(),
      immediatelyLoadDesiredLevelOfDetail: z.boolean().optional(),
      instanceFeatureIdLabel: z.string().optional(),
      lightColor: Cartesian3ZodSchema().optional(),
      loadSiblings: z.boolean().optional(),
      maximumCacheOverflowBytes: z.number().nonnegative().optional(),
      maximumScreenSpaceError: z.number().optional(),
      modelForwardAxis: AxisZodSchema().optional(),
      modelMatrix: Matrix4ZodSchema().optional(),
      modelUpAxis: AxisZodSchema().optional(),
      preferLeaves: z.boolean().optional(),
      preloadFlightDestinations: z.boolean().optional(),
      preloadWhenHidden: z.boolean().optional(),
      progressiveResolutionHeightFraction: z.number().optional(),
      projectTo2D: z.boolean().optional(),
      shadows: ShadowModeZodSchema().optional(),
      show: z.boolean().optional(),
      showCreditsOnScreen: z.boolean().optional(),
      showOutline: z.boolean().optional(),
      skipLevelOfDetail: z.boolean().optional(),
      skipLevels: z.number().optional(),
      skipScreenSpaceErrorFactor: z.number().optional(),
      splitDirection: SplitDirectionZodSchema().optional(),
      url: z.string(),
      vectorClassificationOnly: z.boolean().optional(),
      vectorKeepDecodedPositions: z.boolean().optional(),
    }),
  });
}

export type Cesium3DTilesetJSON = z.infer<ReturnType<typeof Cesium3DTilesetZodSchema>>;

export function Cesium3DTilesetToJSON(instance?: Cesium3DTileset): Cesium3DTilesetJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cesium3DTilesetClass).parse(instance);
  const url = instance.resource?.url;
  if (!url) {
    throw new TypeError('Cesium3DTileset must be loaded from a URL before serialization.');
  }
  return Cesium3DTilesetZodSchema().parse({
    parser: 'Cesium3DTileset',
    value: {
      asynchronouslyLoadImagery: readPrivate(instance, '_asynchronouslyLoadImagery'),
      backFaceCulling: instance.backFaceCulling,
      baseScreenSpaceError: instance.baseScreenSpaceError,
      cacheBytes: instance.cacheBytes,
      classificationType: ClassificationTypeToJSON(instance.classificationType),
      clippingPlanes: ClippingPlaneCollectionToJSON(instance.clippingPlanes),
      cullRequestsWhileMoving: instance.cullRequestsWhileMoving,
      cullRequestsWhileMovingMultiplier: instance.cullRequestsWhileMovingMultiplier,
      cullWithChildrenBounds: readPrivate(instance, '_cullWithChildrenBounds'),
      debugColorizeTiles: instance.debugColorizeTiles,
      debugFreezeFrame: instance.debugFreezeFrame,
      debugHeatmapTilePropertyName: readPrivate<{ tilePropertyName?: string }>(instance, '_heatmap')?.tilePropertyName,
      debugShowBoundingVolume: instance.debugShowBoundingVolume,
      debugShowContentBoundingVolume: instance.debugShowContentBoundingVolume,
      debugShowGeometricError: instance.debugShowGeometricError,
      debugShowMemoryUsage: instance.debugShowMemoryUsage,
      debugShowRenderingStatistics: instance.debugShowRenderingStatistics,
      debugShowUrl: instance.debugShowUrl,
      debugShowViewerRequestVolume: instance.debugShowViewerRequestVolume,
      debugWireframe: instance.debugWireframe,
      dynamicScreenSpaceError: instance.dynamicScreenSpaceError,
      dynamicScreenSpaceErrorDensity: instance.dynamicScreenSpaceErrorDensity,
      dynamicScreenSpaceErrorFactor: instance.dynamicScreenSpaceErrorFactor,
      dynamicScreenSpaceErrorHeightFalloff: instance.dynamicScreenSpaceErrorHeightFalloff,
      edgeDisplayMode: EdgeDisplayModeToJSON(instance.edgeDisplayMode),
      ellipsoid: EllipsoidToJSON(instance.ellipsoid),
      enableCollision: instance.enableCollision,
      enableDebugWireframe: readPrivate(instance, '_enableDebugWireframe'),
      enablePick: readPrivate(instance, '_enablePick'),
      enableShowOutline: readPrivate(instance, '_enableShowOutline'),
      featureIdLabel: instance.featureIdLabel,
      foveatedConeSize: instance.foveatedConeSize,
      foveatedMinimumScreenSpaceErrorRelaxation: instance.foveatedMinimumScreenSpaceErrorRelaxation,
      foveatedScreenSpaceError: instance.foveatedScreenSpaceError,
      foveatedTimeDelay: instance.foveatedTimeDelay,
      heightReference: HeightReferenceToJSON(instance.heightReference),
      immediatelyLoadDesiredLevelOfDetail: instance.immediatelyLoadDesiredLevelOfDetail,
      instanceFeatureIdLabel: instance.instanceFeatureIdLabel,
      lightColor: Cartesian3ToJSON(instance.lightColor),
      loadSiblings: instance.loadSiblings,
      maximumCacheOverflowBytes: instance.maximumCacheOverflowBytes,
      maximumScreenSpaceError: instance.maximumScreenSpaceError,
      modelForwardAxis: AxisToJSON(readPrivate(instance, '_modelForwardAxis')),
      modelMatrix: Matrix4ToJSON(instance.modelMatrix),
      modelUpAxis: AxisToJSON(readPrivate(instance, '_modelUpAxis')),
      preferLeaves: instance.preferLeaves,
      preloadFlightDestinations: instance.preloadFlightDestinations,
      preloadWhenHidden: instance.preloadWhenHidden,
      progressiveResolutionHeightFraction: instance.progressiveResolutionHeightFraction,
      projectTo2D: readPrivate(instance, '_projectTo2D'),
      shadows: ShadowModeToJSON(instance.shadows),
      show: instance.show,
      showCreditsOnScreen: instance.showCreditsOnScreen,
      showOutline: instance.showOutline,
      skipLevelOfDetail: instance.skipLevelOfDetail,
      skipLevels: instance.skipLevels,
      skipScreenSpaceErrorFactor: instance.skipScreenSpaceErrorFactor,
      splitDirection: SplitDirectionToJSON(instance.splitDirection),
      url,
      vectorClassificationOnly: instance.vectorClassificationOnly,
      vectorKeepDecodedPositions: instance.vectorKeepDecodedPositions,
    },
  });
}

export async function Cesium3DTilesetFromJSON(
  json: Cesium3DTilesetJSON,
  options?: SceneRestoreOptions,
): Promise<Cesium3DTileset> {
  const value = Cesium3DTilesetZodSchema().parse(json).value;
  const heightReference = HeightReferenceFromJSON(value.heightReference);
  assertSceneForHeightReference(heightReference, options?.scene, 'Cesium3DTilesetFromJSON');
  return Cesium3DTilesetClass.fromUrl(value.url, {
    asynchronouslyLoadImagery: value.asynchronouslyLoadImagery,
    backFaceCulling: value.backFaceCulling,
    baseScreenSpaceError: value.baseScreenSpaceError,
    cacheBytes: value.cacheBytes,
    classificationType: ClassificationTypeFromJSON(value.classificationType),
    clippingPlanes: ClippingPlaneCollectionFromJSON(value.clippingPlanes),
    cullRequestsWhileMoving: value.cullRequestsWhileMoving,
    cullRequestsWhileMovingMultiplier: value.cullRequestsWhileMovingMultiplier,
    cullWithChildrenBounds: value.cullWithChildrenBounds,
    debugColorizeTiles: value.debugColorizeTiles,
    debugFreezeFrame: value.debugFreezeFrame,
    debugHeatmapTilePropertyName: value.debugHeatmapTilePropertyName,
    debugShowBoundingVolume: value.debugShowBoundingVolume,
    debugShowContentBoundingVolume: value.debugShowContentBoundingVolume,
    debugShowGeometricError: value.debugShowGeometricError,
    debugShowMemoryUsage: value.debugShowMemoryUsage,
    debugShowRenderingStatistics: value.debugShowRenderingStatistics,
    debugShowUrl: value.debugShowUrl,
    debugShowViewerRequestVolume: value.debugShowViewerRequestVolume,
    debugWireframe: value.debugWireframe,
    dynamicScreenSpaceError: value.dynamicScreenSpaceError,
    dynamicScreenSpaceErrorDensity: value.dynamicScreenSpaceErrorDensity,
    dynamicScreenSpaceErrorFactor: value.dynamicScreenSpaceErrorFactor,
    dynamicScreenSpaceErrorHeightFalloff: value.dynamicScreenSpaceErrorHeightFalloff,
    edgeDisplayMode: EdgeDisplayModeFromJSON(value.edgeDisplayMode),
    ellipsoid: EllipsoidFromJSON(value.ellipsoid),
    enableCollision: value.enableCollision,
    enableDebugWireframe: value.enableDebugWireframe,
    enablePick: value.enablePick,
    enableShowOutline: value.enableShowOutline,
    featureIdLabel: value.featureIdLabel,
    foveatedConeSize: value.foveatedConeSize,
    foveatedMinimumScreenSpaceErrorRelaxation: value.foveatedMinimumScreenSpaceErrorRelaxation,
    foveatedScreenSpaceError: value.foveatedScreenSpaceError,
    foveatedTimeDelay: value.foveatedTimeDelay,
    heightReference,
    immediatelyLoadDesiredLevelOfDetail: value.immediatelyLoadDesiredLevelOfDetail,
    instanceFeatureIdLabel: value.instanceFeatureIdLabel,
    lightColor: Cartesian3FromJSON(value.lightColor),
    loadSiblings: value.loadSiblings,
    maximumCacheOverflowBytes: value.maximumCacheOverflowBytes,
    maximumScreenSpaceError: value.maximumScreenSpaceError,
    modelForwardAxis: AxisFromJSON(value.modelForwardAxis),
    modelMatrix: Matrix4FromJSON(value.modelMatrix),
    modelUpAxis: AxisFromJSON(value.modelUpAxis),
    preferLeaves: value.preferLeaves,
    preloadFlightDestinations: value.preloadFlightDestinations,
    preloadWhenHidden: value.preloadWhenHidden,
    progressiveResolutionHeightFraction: value.progressiveResolutionHeightFraction,
    projectTo2D: value.projectTo2D,
    shadows: ShadowModeFromJSON(value.shadows),
    show: value.show,
    showCreditsOnScreen: value.showCreditsOnScreen,
    showOutline: value.showOutline,
    skipLevelOfDetail: value.skipLevelOfDetail,
    skipLevels: value.skipLevels,
    skipScreenSpaceErrorFactor: value.skipScreenSpaceErrorFactor,
    splitDirection: SplitDirectionFromJSON(value.splitDirection),
    scene: options?.scene,
    vectorClassificationOnly: value.vectorClassificationOnly,
    vectorKeepDecodedPositions: value.vectorKeepDecodedPositions,
  });
}
