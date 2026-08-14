import { TileMapServiceImageryProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';

/**
 * `Cesium.TileMapServiceImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options. TileMapServiceImageryProvider extends
 * UrlTemplateImageryProvider in Cesium, and does not store its `fileExtension` option
 * on the instance, so it cannot be restored from an instance.
 */
export function TileMapServiceImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('TileMapServiceImageryProvider'),
    value: z.object({
      url: z.string(),
      fileExtension: z.string().optional(),
      subdomains: z.array(z.string()).optional(),
      credit: z.string().optional(),
      rectangle: RectangleZodSchema().optional(),
      tilingScheme: TilingSchemeZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      minimumLevel: z.number().optional(),
      maximumLevel: z.number().optional(),
      tileWidth: z.number().optional(),
      tileHeight: z.number().optional(),
      enablePickFeatures: z.boolean().optional(),
    }),
  });
}

export type TileMapServiceImageryProviderJSON = z.infer<ReturnType<typeof TileMapServiceImageryProviderZodSchema>>;

/**
 * Convert `Cesium.TileMapServiceImageryProvider` instance to JSON
 */
export function TileMapServiceImageryProviderToJSON(instance?: TileMapServiceImageryProvider): TileMapServiceImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(TileMapServiceImageryProvider).parse(instance);
  return {
    parser: 'TileMapServiceImageryProvider',
    value: {
      url: instance.url,
      // subdomains is only stored internally
      subdomains: readPrivate<string[]>(instance, '_subdomains'),
      credit: instance.credit?.html,
      rectangle: RectangleToJSON(instance.rectangle),
      tilingScheme: TilingSchemeToJSON(instance.tilingScheme),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
      minimumLevel: instance.minimumLevel,
      maximumLevel: instance.maximumLevel,
      tileWidth: instance.tileWidth,
      tileHeight: instance.tileHeight,
      enablePickFeatures: instance.enablePickFeatures,
    },
  };
}

/**
 * Convert JSON to a `Cesium.TileMapServiceImageryProvider` instance (async)
 * @param json - A JSON containing instance data
 */
export async function TileMapServiceImageryProviderFromJSON(json?: TileMapServiceImageryProviderJSON): Promise<TileMapServiceImageryProvider | undefined> {
  if (!json) {
    return undefined;
  }
  json = TileMapServiceImageryProviderZodSchema().parse(json);
  const value = json.value;
  // TileMapServiceImageryProvider passes its options straight through to
  // UrlTemplateImageryProvider, but the extra fields are not exposed in the type
  const options: TileMapServiceImageryProvider.ConstructorOptions & {
    subdomains?: string[];
    enablePickFeatures?: boolean;
  } = {
    fileExtension: value.fileExtension,
    subdomains: value.subdomains,
    credit: value.credit,
    rectangle: RectangleFromJSON(value.rectangle),
    tilingScheme: TilingSchemeFromJSON(value.tilingScheme),
    ellipsoid: EllipsoidFromJSON(value.ellipsoid),
    minimumLevel: value.minimumLevel,
    maximumLevel: value.maximumLevel,
    tileWidth: value.tileWidth,
    tileHeight: value.tileHeight,
    enablePickFeatures: value.enablePickFeatures,
  };
  return TileMapServiceImageryProvider.fromUrl(value.url, options);
}
