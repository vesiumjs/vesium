import type { Clock, TimeIntervalCollection } from 'cesium';
import { WebMapTileServiceImageryProvider } from 'cesium';
import { z } from 'zod';
import { ClockFromJSON, ClockToJSON, ClockZodSchema } from './Clock';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';
import { TimeIntervalCollectionFromJSON, TimeIntervalCollectionToJSON, TimeIntervalCollectionZodSchema } from './TimeIntervalCollection';

/**
 * `Cesium.WebMapTileServiceImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function WebMapTileServiceImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('WebMapTileServiceImageryProvider'),
    value: z.object({
      url: z.string(),
      format: z.string().optional(),
      layer: z.string(),
      style: z.string(),
      tileMatrixSetID: z.string(),
      tileMatrixLabels: z.array(z.string()).optional(),
      dimensions: z.any().optional(),
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
      clock: ClockZodSchema().optional(),
      times: TimeIntervalCollectionZodSchema().optional(),
    }),
  });
}

export type WebMapTileServiceImageryProviderJSON = z.infer<ReturnType<typeof WebMapTileServiceImageryProviderZodSchema>>;

interface WMTSResource {
  queryParameters?: Record<string, string>;
  templateValues?: Record<string, string>;
}

/**
 * WMTS folds `layer`, `style` and `tileMatrixSetID` into the resource's query
 * parameters (KVP mode) or template values (REST mode), so they are extracted back.
 */
function extractWMTSValues(instance: WebMapTileServiceImageryProvider) {
  const resource = readPrivate<WMTSResource>(instance, '_resource');
  const query = resource?.queryParameters ?? {};
  const template = resource?.templateValues ?? {};
  const tileMatrixSetID = query.tilematrixset ?? template.TileMatrixSet ?? template.tilematrixset ?? readPrivate<string>(instance, '_tilematrixset');
  return {
    layer: query.layer ?? template.Layer ?? template.layer,
    style: query.style ?? template.Style ?? template.style,
    tileMatrixSetID,
  };
}

/**
 * Convert `Cesium.WebMapTileServiceImageryProvider` instance to JSON
 */
export function WebMapTileServiceImageryProviderToJSON(instance?: WebMapTileServiceImageryProvider): WebMapTileServiceImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(WebMapTileServiceImageryProvider).parse(instance);
  const { layer, style, tileMatrixSetID } = extractWMTSValues(instance);
  // clock/times are only present when `times` was configured (via _timeDynamicImagery)
  const timeDynamic = readPrivate<{ clock?: Clock; times?: TimeIntervalCollection }>(instance, '_timeDynamicImagery');
  return {
    parser: 'WebMapTileServiceImageryProvider',
    value: {
      url: instance.url,
      format: instance.format,
      layer,
      style,
      tileMatrixSetID,
      tileMatrixLabels: readPrivate<string[]>(instance, '_tileMatrixLabels'),
      dimensions: instance.dimensions,
      subdomains: readPrivate<{ _subdomains?: string[] }>(instance, '_tileProvider')?._subdomains,
      credit: instance.credit?.html,
      rectangle: RectangleToJSON(instance.rectangle),
      tilingScheme: TilingSchemeToJSON(instance.tilingScheme),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
      minimumLevel: instance.minimumLevel,
      maximumLevel: instance.maximumLevel,
      tileWidth: instance.tileWidth,
      tileHeight: instance.tileHeight,
      enablePickFeatures: instance.enablePickFeatures,
      clock: ClockToJSON(timeDynamic?.clock),
      times: TimeIntervalCollectionToJSON(timeDynamic?.times),
    },
  };
}

/**
 * Convert JSON to `Cesium.WebMapTileServiceImageryProvider` instance
 * @param json - A JSON containing instance data
 */
export function WebMapTileServiceImageryProviderFromJSON(json?: WebMapTileServiceImageryProviderJSON): WebMapTileServiceImageryProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = WebMapTileServiceImageryProviderZodSchema().parse(json);
  const value = json.value;
  return new WebMapTileServiceImageryProvider({
    url: value.url,
    format: value.format,
    layer: value.layer,
    style: value.style,
    tileMatrixSetID: value.tileMatrixSetID,
    tileMatrixLabels: value.tileMatrixLabels,
    dimensions: value.dimensions,
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
    clock: ClockFromJSON(value.clock),
    times: TimeIntervalCollectionFromJSON(value.times),
  });
}
