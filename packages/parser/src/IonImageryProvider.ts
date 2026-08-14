import { IonImageryProvider } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.IonImageryProvider` JSON ZodSchema
 *
 * Note: an `IonImageryProvider` instance is created asynchronously via
 * `IonImageryProvider.fromAssetId` and does not retain its `assetId`, so
 * serialization works on the assetId level instead of the instance level.
 */
export function IonImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('IonImageryProvider'),
    value: z.object({
      assetId: z.number(),
      accessToken: z.string().optional(),
      server: z.string().optional(),
    }),
  });
}

export type IonImageryProviderJSON = z.infer<ReturnType<typeof IonImageryProviderZodSchema>>;

/**
 * Convert Cesium ion asset source to JSON
 * @param source - The Cesium ion asset source to serialize
 * @param source.assetId - The Cesium ion asset id
 * @param source.accessToken - The access token to use
 * @param source.server - The resource to the Cesium ion API server
 */
export function IonImageryProviderToJSON(source: { assetId: number; accessToken?: string; server?: string }): IonImageryProviderJSON {
  return {
    parser: 'IonImageryProvider',
    value: {
      assetId: source.assetId,
      accessToken: source.accessToken,
      server: source.server,
    },
  };
}

/**
 * Convert JSON to a `Cesium.IonImageryProvider` instance (async)
 * @param json - A JSON containing instance data
 */
export async function IonImageryProviderFromJSON(json?: IonImageryProviderJSON): Promise<IonImageryProvider | undefined> {
  if (!json) {
    return undefined;
  }
  json = IonImageryProviderZodSchema().parse(json);
  return IonImageryProvider.fromAssetId(json.value.assetId, {
    accessToken: json.value.accessToken,
    server: json.value.server,
  });
}
