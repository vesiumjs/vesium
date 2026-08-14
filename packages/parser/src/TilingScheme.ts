import type { TilingScheme } from 'cesium';
import { GeographicTilingScheme, WebMercatorTilingScheme } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';

/**
 * `Cesium.TilingScheme`（GeographicTilingScheme / WebMercatorTilingScheme）JSON ZodSchema
 */
export function TilingSchemeZodSchema() {
  return z.object({
    parser: z.literal('TilingScheme'),
    value: z.object({
      type: z.enum(['Geographic', 'WebMercator']),
      ellipsoid: EllipsoidZodSchema().optional(),
      rectangle: RectangleZodSchema().optional(),
      numberOfLevelZeroTilesX: z.number().optional(),
      numberOfLevelZeroTilesY: z.number().optional(),
    }),
  });
}

export type TilingSchemeJSON = z.infer<ReturnType<typeof TilingSchemeZodSchema>>;

/**
 * Convert `Cesium.TilingScheme` instance to JSON
 */
export function TilingSchemeToJSON(instance?: TilingScheme): TilingSchemeJSON | undefined {
  if (!instance) {
    return undefined;
  }
  const type = instance instanceof GeographicTilingScheme ? 'Geographic' : 'WebMercator';
  // numberOfLevelZeroTilesX/Y are only stored internally
  return {
    parser: 'TilingScheme',
    value: {
      type,
      ellipsoid: EllipsoidToJSON(instance.ellipsoid),
      rectangle: RectangleToJSON(instance.rectangle),
      numberOfLevelZeroTilesX: readPrivate<number>(instance, '_numberOfLevelZeroTilesX'),
      numberOfLevelZeroTilesY: readPrivate<number>(instance, '_numberOfLevelZeroTilesY'),
    },
  };
}

/**
 * Convert JSON to `Cesium.TilingScheme` instance
 */
export function TilingSchemeFromJSON(json?: TilingSchemeJSON): TilingScheme | undefined {
  if (!json) {
    return undefined;
  }
  json = TilingSchemeZodSchema().parse(json);
  if (json.value.type === 'Geographic') {
    return new GeographicTilingScheme({
      ellipsoid: EllipsoidFromJSON(json.value.ellipsoid),
      rectangle: RectangleFromJSON(json.value.rectangle),
      numberOfLevelZeroTilesX: json.value.numberOfLevelZeroTilesX,
      numberOfLevelZeroTilesY: json.value.numberOfLevelZeroTilesY,
    });
  }
  // WebMercatorTilingScheme derives its rectangle from rectangleSouthwestInMeters
  // / rectangleNortheastInMeters, so the serialized rectangle cannot be restored exactly.
  return new WebMercatorTilingScheme({
    ellipsoid: EllipsoidFromJSON(json.value.ellipsoid),
    numberOfLevelZeroTilesX: json.value.numberOfLevelZeroTilesX,
    numberOfLevelZeroTilesY: json.value.numberOfLevelZeroTilesY,
  });
}
