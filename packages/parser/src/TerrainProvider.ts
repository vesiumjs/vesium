import type { TerrainProvider } from 'cesium';
import type { ArcGISTiledElevationTerrainProviderJSON } from './ArcGISTiledElevationTerrainProvider';
import type { CesiumTerrainProviderJSON } from './CesiumTerrainProvider';
import type { EllipsoidTerrainProviderJSON } from './EllipsoidTerrainProvider';
import { ArcGISTiledElevationTerrainProviderFromJSON } from './ArcGISTiledElevationTerrainProvider';
import { CesiumTerrainProviderFromJSON } from './CesiumTerrainProvider';
import { EllipsoidTerrainProviderFromJSON } from './EllipsoidTerrainProvider';

export type TerrainProviderJSON
  = | CesiumTerrainProviderJSON
    | EllipsoidTerrainProviderJSON
    | ArcGISTiledElevationTerrainProviderJSON;

/**
 * Convert JSON to a `Cesium.TerrainProvider` instance, dispatching by the
 * `parser` field. Always returns a Promise, so callers can `await` uniformly
 * regardless of whether the concrete provider is created synchronously or not.
 *
 * Note: `CesiumTerrainProvider` and `ArcGISTiledElevationTerrainProvider` do not retain
 * their url on the instance, so they have no instance-level `ToJSON` — serialize them from
 * their source object instead (`{ url, ... }`). Deserializing them fetches service metadata
 * over the network and rejects when offline or the service is unreachable.
 * @param json - A JSON containing instance data
 */
export async function TerrainProviderFromJSON(json?: TerrainProviderJSON): Promise<TerrainProvider | undefined> {
  switch (json?.parser) {
    case 'CesiumTerrainProvider':
      return CesiumTerrainProviderFromJSON(json);
    case 'EllipsoidTerrainProvider':
      return EllipsoidTerrainProviderFromJSON(json);
    case 'ArcGISTiledElevationTerrainProvider':
      return ArcGISTiledElevationTerrainProviderFromJSON(json);
    default:
      return undefined;
  }
}
