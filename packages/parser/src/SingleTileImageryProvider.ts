import { SingleTileImageryProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';

/**
 * `Cesium.SingleTileImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function SingleTileImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('SingleTileImageryProvider'),
    value: z.object({
      url: z.string(),
      credit: z.string().optional(),
      rectangle: RectangleZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      tileWidth: z.number().optional(),
      tileHeight: z.number().optional(),
    }),
  });
}

export type SingleTileImageryProviderJSON = z.infer<ReturnType<typeof SingleTileImageryProviderZodSchema>>;

/**
 * Convert `Cesium.SingleTileImageryProvider` instance to JSON
 */
export function SingleTileImageryProviderToJSON(instance?: SingleTileImageryProvider): SingleTileImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(SingleTileImageryProvider).parse(instance);
  return {
    parser: 'SingleTileImageryProvider',
    value: {
      url: instance.url,
      credit: instance.credit?.html,
      rectangle: RectangleToJSON(instance.rectangle),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
      tileWidth: instance.tileWidth,
      tileHeight: instance.tileHeight,
    },
  };
}

/**
 * Convert JSON to `Cesium.SingleTileImageryProvider` instance
 * @param json - A JSON containing instance data
 */
export function SingleTileImageryProviderFromJSON(json?: SingleTileImageryProviderJSON): SingleTileImageryProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = SingleTileImageryProviderZodSchema().parse(json);
  const value = json.value;
  return new SingleTileImageryProvider({
    url: value.url,
    credit: value.credit,
    rectangle: RectangleFromJSON(value.rectangle),
    ellipsoid: EllipsoidFromJSON(value.ellipsoid),
    // tileWidth/tileHeight are required at construction; a single tile is 1x1 by default
    tileWidth: value.tileWidth ?? 1,
    tileHeight: value.tileHeight ?? 1,
  });
}
