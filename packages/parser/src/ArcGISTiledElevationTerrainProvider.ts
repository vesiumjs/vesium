import type { Ellipsoid } from 'cesium';
import { ArcGISTiledElevationTerrainProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';

/**
 * `Cesium.ArcGISTiledElevationTerrainProvider` JSON ZodSchema
 * The `value` mirrors the `fromUrl` options.
 *
 * Note: an `ArcGISTiledElevationTerrainProvider` instance is created asynchronously
 * via `ArcGISTiledElevationTerrainProvider.fromUrl` and does not retain its `url`
 * separately, so serialization works on the url level instead of the instance level.
 */
export function ArcGISTiledElevationTerrainProviderZodSchema() {
  return z.object({
    parser: z.literal('ArcGISTiledElevationTerrainProvider'),
    value: z.object({
      url: z.string(),
      token: z.string().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
    }),
  });
}

export type ArcGISTiledElevationTerrainProviderJSON = z.infer<ReturnType<typeof ArcGISTiledElevationTerrainProviderZodSchema>>;

/**
 * Convert Cesium terrain source to JSON
 * @param source - The Cesium terrain source to serialize
 * @param source.url - The url of the terrain service
 * @param source.token - The ArcGIS token
 * @param source.ellipsoid - The ellipsoid
 */
export function ArcGISTiledElevationTerrainProviderToJSON(source: { url: string; token?: string; ellipsoid?: Ellipsoid }): ArcGISTiledElevationTerrainProviderJSON {
  return {
    parser: 'ArcGISTiledElevationTerrainProvider',
    value: {
      url: source.url,
      token: source.token,
      ellipsoid: EllipsoidToJSON(source.ellipsoid),
    },
  };
}

/**
 * Convert JSON to a `Cesium.ArcGISTiledElevationTerrainProvider` instance (async)
 * @param json - A JSON containing instance data
 */
export async function ArcGISTiledElevationTerrainProviderFromJSON(json?: ArcGISTiledElevationTerrainProviderJSON): Promise<ArcGISTiledElevationTerrainProvider | undefined> {
  if (!json) {
    return undefined;
  }
  json = ArcGISTiledElevationTerrainProviderZodSchema().parse(json);
  return ArcGISTiledElevationTerrainProvider.fromUrl(json.value.url, {
    token: json.value.token,
    ellipsoid: EllipsoidFromJSON(json.value.ellipsoid),
  });
}
