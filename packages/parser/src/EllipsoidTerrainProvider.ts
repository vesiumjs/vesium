import { EllipsoidTerrainProvider } from 'cesium';
import { z } from 'zod';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';

/**
 * `Cesium.EllipsoidTerrainProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function EllipsoidTerrainProviderZodSchema() {
  return z.object({
    parser: z.literal('EllipsoidTerrainProvider'),
    value: z.object({
      tilingScheme: TilingSchemeZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
    }),
  });
}

export type EllipsoidTerrainProviderJSON = z.infer<ReturnType<typeof EllipsoidTerrainProviderZodSchema>>;

/**
 * Convert `Cesium.EllipsoidTerrainProvider` instance to JSON
 */
export function EllipsoidTerrainProviderToJSON(instance?: EllipsoidTerrainProvider): EllipsoidTerrainProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(EllipsoidTerrainProvider).parse(instance);
  return {
    parser: 'EllipsoidTerrainProvider',
    value: {
      tilingScheme: TilingSchemeToJSON(instance.tilingScheme),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
    },
  };
}

/**
 * Convert JSON to `Cesium.EllipsoidTerrainProvider` instance
 * @param json - A JSON containing instance data
 */
export function EllipsoidTerrainProviderFromJSON(json?: EllipsoidTerrainProviderJSON): EllipsoidTerrainProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = EllipsoidTerrainProviderZodSchema().parse(json);
  return new EllipsoidTerrainProvider({
    tilingScheme: TilingSchemeFromJSON(json.value.tilingScheme),
    ellipsoid: EllipsoidFromJSON(json.value.ellipsoid),
  });
}
