import type { Clock, TimeIntervalCollection } from 'cesium';
import { WebMapServiceImageryProvider } from 'cesium';
import { z } from 'zod';
import { ClockFromJSON, ClockToJSON, ClockZodSchema } from './Clock';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';
import { TimeIntervalCollectionFromJSON, TimeIntervalCollectionToJSON, TimeIntervalCollectionZodSchema } from './TimeIntervalCollection';

/**
 * `Cesium.WebMapServiceImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function WebMapServiceImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('WebMapServiceImageryProvider'),
    value: z.object({
      url: z.string(),
      layers: z.string(),
      parameters: z.record(z.string(), z.any()).optional(),
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

export type WebMapServiceImageryProviderJSON = z.infer<ReturnType<typeof WebMapServiceImageryProviderZodSchema>>;

/**
 * Convert `Cesium.WebMapServiceImageryProvider` instance to JSON
 */
export function WebMapServiceImageryProviderToJSON(instance?: WebMapServiceImageryProvider): WebMapServiceImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(WebMapServiceImageryProvider).parse(instance);
  // WMS merges `parameters` into the resource query parameters (lowercased keys)
  // and stores `layers` separately, so we strip it back out.
  const resource = readPrivate<{ queryParameters?: Record<string, unknown> }>(instance, '_resource');
  const queryParameters = { ...(resource?.queryParameters ?? {}) };
  delete queryParameters.layers;
  // clock/times are only present when `times` was configured (via _timeDynamicImagery)
  const timeDynamic = readPrivate<{ clock?: Clock; times?: TimeIntervalCollection }>(instance, '_timeDynamicImagery');
  return {
    parser: 'WebMapServiceImageryProvider',
    value: {
      url: instance.url,
      layers: instance.layers,
      parameters: queryParameters,
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
 * Convert JSON to `Cesium.WebMapServiceImageryProvider` instance
 * @param json - A JSON containing instance data
 */
export function WebMapServiceImageryProviderFromJSON(json?: WebMapServiceImageryProviderJSON): WebMapServiceImageryProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = WebMapServiceImageryProviderZodSchema().parse(json);
  const value = json.value;
  return new WebMapServiceImageryProvider({
    url: value.url,
    layers: value.layers,
    parameters: value.parameters,
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
