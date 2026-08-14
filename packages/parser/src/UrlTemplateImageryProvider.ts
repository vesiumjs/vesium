import { UrlTemplateImageryProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { RectangleFromJSON, RectangleToJSON, RectangleZodSchema } from './Rectangle';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';

/**
 * `Cesium.UrlTemplateImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function UrlTemplateImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('UrlTemplateImageryProvider'),
    value: z.object({
      url: z.string(),
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

export type UrlTemplateImageryProviderJSON = z.infer<ReturnType<typeof UrlTemplateImageryProviderZodSchema>>;

/**
 * Convert `Cesium.UrlTemplateImageryProvider` instance to JSON
 */
export function UrlTemplateImageryProviderToJSON(instance?: UrlTemplateImageryProvider): UrlTemplateImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(UrlTemplateImageryProvider).parse(instance);
  return {
    parser: 'UrlTemplateImageryProvider',
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
 * Convert JSON to `Cesium.UrlTemplateImageryProvider` instance
 * @param json - A JSON containing instance data
 */
export function UrlTemplateImageryProviderFromJSON(json?: UrlTemplateImageryProviderJSON): UrlTemplateImageryProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = UrlTemplateImageryProviderZodSchema().parse(json);
  const value = json.value;
  return new UrlTemplateImageryProvider({
    url: value.url,
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
  });
}
