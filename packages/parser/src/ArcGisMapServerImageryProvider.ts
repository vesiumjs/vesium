import { ArcGisMapServerImageryProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';

/**
 * `Cesium.ArcGisMapServerImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function ArcGisMapServerImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('ArcGisMapServerImageryProvider'),
    value: z.object({
      url: z.string(),
      token: z.string().optional(),
      layers: z.string().optional(),
      usePreCachedTilesIfAvailable: z.boolean().optional(),
      credit: z.string().optional(),
      rectangle: RectangleZodSchema().optional(),
      tilingScheme: TilingSchemeZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      maximumLevel: z.number().optional(),
      tileWidth: z.number().optional(),
      tileHeight: z.number().optional(),
      enablePickFeatures: z.boolean().optional(),
    }),
  });
}

export type ArcGisMapServerImageryProviderJSON = z.infer<ReturnType<typeof ArcGisMapServerImageryProviderZodSchema>>;

/**
 * Convert `Cesium.ArcGisMapServerImageryProvider` instance to JSON
 */
export function ArcGisMapServerImageryProviderToJSON(instance?: ArcGisMapServerImageryProvider): ArcGisMapServerImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(ArcGisMapServerImageryProvider).parse(instance);
  return {
    parser: 'ArcGisMapServerImageryProvider',
    value: {
      url: instance.url,
      token: instance.token,
      layers: instance.layers,
      usePreCachedTilesIfAvailable: readPrivate<boolean>(instance, '_useTiles'),
      enablePickFeatures: instance.enablePickFeatures,
      credit: instance.credit?.html,
      rectangle: RectangleToJSON(instance.rectangle),
      tilingScheme: TilingSchemeToJSON(instance.tilingScheme),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
      maximumLevel: instance.maximumLevel,
      tileWidth: instance.tileWidth,
      tileHeight: instance.tileHeight,
    },
  };
}

/**
 * Convert JSON to a `Cesium.ArcGisMapServerImageryProvider` instance (async)
 * @param json - A JSON containing instance data
 */
export async function ArcGisMapServerImageryProviderFromJSON(json?: ArcGisMapServerImageryProviderJSON): Promise<ArcGisMapServerImageryProvider | undefined> {
  if (!json) {
    return undefined;
  }
  json = ArcGisMapServerImageryProviderZodSchema().parse(json);
  const value = json.value;
  // token is supported at runtime but not exposed in the public ConstructorOptions type
  const options: ArcGisMapServerImageryProvider.ConstructorOptions & { token?: string } = {
    token: value.token,
    layers: value.layers,
    usePreCachedTilesIfAvailable: value.usePreCachedTilesIfAvailable,
    enablePickFeatures: value.enablePickFeatures,
    credit: value.credit,
    rectangle: RectangleFromJSON(value.rectangle),
    tilingScheme: TilingSchemeFromJSON(value.tilingScheme),
    ellipsoid: EllipsoidFromJSON(value.ellipsoid),
    maximumLevel: value.maximumLevel,
    tileWidth: value.tileWidth,
    tileHeight: value.tileHeight,
  };
  return ArcGisMapServerImageryProvider.fromUrl(value.url, options);
}
