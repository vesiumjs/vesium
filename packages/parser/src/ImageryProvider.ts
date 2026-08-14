import type { ImageryProvider } from 'cesium';
import type { ArcGisMapServerImageryProviderJSON } from './ArcGisMapServerImageryProvider';
import type { GridImageryProviderJSON } from './GridImageryProvider';
import type { IonImageryProviderJSON } from './IonImageryProvider';
import type { SingleTileImageryProviderJSON } from './SingleTileImageryProvider';
import type { TileMapServiceImageryProviderJSON } from './TileMapServiceImageryProvider';
import type { UrlTemplateImageryProviderJSON } from './UrlTemplateImageryProvider';
import type { WebMapServiceImageryProviderJSON } from './WebMapServiceImageryProvider';
import type { WebMapTileServiceImageryProviderJSON } from './WebMapTileServiceImageryProvider';
import { ArcGisMapServerImageryProvider, GridImageryProvider, SingleTileImageryProvider, TileMapServiceImageryProvider, UrlTemplateImageryProvider, WebMapServiceImageryProvider, WebMapTileServiceImageryProvider } from 'cesium';
import { ArcGisMapServerImageryProviderFromJSON, ArcGisMapServerImageryProviderToJSON } from './ArcGisMapServerImageryProvider';
import { GridImageryProviderFromJSON, GridImageryProviderToJSON } from './GridImageryProvider';
import { IonImageryProviderFromJSON } from './IonImageryProvider';
import { SingleTileImageryProviderFromJSON, SingleTileImageryProviderToJSON } from './SingleTileImageryProvider';
import { TileMapServiceImageryProviderFromJSON, TileMapServiceImageryProviderToJSON } from './TileMapServiceImageryProvider';
import { UrlTemplateImageryProviderFromJSON, UrlTemplateImageryProviderToJSON } from './UrlTemplateImageryProvider';
import { WebMapServiceImageryProviderFromJSON, WebMapServiceImageryProviderToJSON } from './WebMapServiceImageryProvider';
import { WebMapTileServiceImageryProviderFromJSON, WebMapTileServiceImageryProviderToJSON } from './WebMapTileServiceImageryProvider';

export type ImageryProviderJSON
  = | UrlTemplateImageryProviderJSON
    | WebMapServiceImageryProviderJSON
    | WebMapTileServiceImageryProviderJSON
    | ArcGisMapServerImageryProviderJSON
    | TileMapServiceImageryProviderJSON
    | SingleTileImageryProviderJSON
    | GridImageryProviderJSON
    | IonImageryProviderJSON;

/**
 * Convert a `Cesium.ImageryProvider` instance to JSON, dispatching to the
 * matching provider serializer by its concrete type.
 */
export function ImageryProviderToJSON(instance?: ImageryProvider): ImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  // TileMapServiceImageryProvider extends UrlTemplateImageryProvider, check it first
  if (instance instanceof TileMapServiceImageryProvider) {
    return TileMapServiceImageryProviderToJSON(instance);
  }
  if (instance instanceof UrlTemplateImageryProvider) {
    return UrlTemplateImageryProviderToJSON(instance);
  }
  if (instance instanceof WebMapServiceImageryProvider) {
    return WebMapServiceImageryProviderToJSON(instance);
  }
  if (instance instanceof WebMapTileServiceImageryProvider) {
    return WebMapTileServiceImageryProviderToJSON(instance);
  }
  if (instance instanceof ArcGisMapServerImageryProvider) {
    return ArcGisMapServerImageryProviderToJSON(instance);
  }
  if (instance instanceof SingleTileImageryProvider) {
    return SingleTileImageryProviderToJSON(instance);
  }
  if (instance instanceof GridImageryProvider) {
    return GridImageryProviderToJSON(instance);
  }
  return undefined;
}

/**
 * Convert JSON to a `Cesium.ImageryProvider` instance, dispatching by the
 * `parser` field. Always returns a Promise, so callers can `await` uniformly
 * regardless of whether the concrete provider is created synchronously or not.
 * @param json - A JSON containing instance data
 */
export async function ImageryProviderFromJSON(json?: ImageryProviderJSON): Promise<ImageryProvider | undefined> {
  switch (json?.parser) {
    case 'UrlTemplateImageryProvider':
      return UrlTemplateImageryProviderFromJSON(json);
    case 'WebMapServiceImageryProvider':
      return WebMapServiceImageryProviderFromJSON(json);
    case 'WebMapTileServiceImageryProvider':
      return WebMapTileServiceImageryProviderFromJSON(json);
    case 'ArcGisMapServerImageryProvider':
      return ArcGisMapServerImageryProviderFromJSON(json);
    case 'TileMapServiceImageryProvider':
      return TileMapServiceImageryProviderFromJSON(json);
    case 'SingleTileImageryProvider':
      return SingleTileImageryProviderFromJSON(json);
    case 'GridImageryProvider':
      return GridImageryProviderFromJSON(json);
    case 'IonImageryProvider':
      return IonImageryProviderFromJSON(json);
    default:
      return undefined;
  }
}
