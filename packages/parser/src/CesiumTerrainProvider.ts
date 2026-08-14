import type { Ellipsoid } from 'cesium';
import { CesiumTerrainProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';

/**
 * `Cesium.CesiumTerrainProvider` JSON ZodSchema
 * The `value` mirrors the `fromUrl` options.
 *
 * Note: a `CesiumTerrainProvider` instance is created asynchronously via
 * `CesiumTerrainProvider.fromUrl` and does not retain its `url`, so
 * serialization works on the url level instead of the instance level.
 */
export function CesiumTerrainProviderZodSchema() {
  return z.object({
    parser: z.literal('CesiumTerrainProvider'),
    value: z.object({
      url: z.string(),
      requestVertexNormals: z.boolean().optional(),
      requestWaterMask: z.boolean().optional(),
      requestMetadata: z.boolean().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      credit: z.string().optional(),
    }),
  });
}

export type CesiumTerrainProviderJSON = z.infer<ReturnType<typeof CesiumTerrainProviderZodSchema>>;

/**
 * Convert Cesium terrain source to JSON
 * @param source - The Cesium terrain source to serialize
 * @param source.url - The url of the terrain tileset
 * @param source.requestVertexNormals - Whether to request vertex normals
 * @param source.requestWaterMask - Whether to request water masks
 * @param source.requestMetadata - Whether to request metadata
 * @param source.ellipsoid - The ellipsoid
 * @param source.credit - A credit (html) for the data source
 */
export function CesiumTerrainProviderToJSON(source: { url: string; requestVertexNormals?: boolean; requestWaterMask?: boolean; requestMetadata?: boolean; ellipsoid?: Ellipsoid; credit?: string }): CesiumTerrainProviderJSON {
  return {
    parser: 'CesiumTerrainProvider',
    value: {
      url: source.url,
      requestVertexNormals: source.requestVertexNormals,
      requestWaterMask: source.requestWaterMask,
      requestMetadata: source.requestMetadata,
      ellipsoid: EllipsoidToJSON(source.ellipsoid),
      credit: source.credit,
    },
  };
}

/**
 * Convert JSON to a `Cesium.CesiumTerrainProvider` instance (async)
 * @param json - A JSON containing instance data
 */
export async function CesiumTerrainProviderFromJSON(json?: CesiumTerrainProviderJSON): Promise<CesiumTerrainProvider | undefined> {
  if (!json) {
    return undefined;
  }
  json = CesiumTerrainProviderZodSchema().parse(json);
  return CesiumTerrainProvider.fromUrl(json.value.url, {
    requestVertexNormals: json.value.requestVertexNormals,
    requestWaterMask: json.value.requestWaterMask,
    requestMetadata: json.value.requestMetadata,
    ellipsoid: EllipsoidFromJSON(json.value.ellipsoid),
    credit: json.value.credit,
  });
}
