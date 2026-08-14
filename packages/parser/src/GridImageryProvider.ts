import type { Color } from 'cesium';
import { GridImageryProvider } from 'cesium';
import { z } from 'zod';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { EllipsoidFromJSON, EllipsoidToJSON, EllipsoidZodSchema } from './Ellipsoid';
import { readPrivate } from './private';
import { TilingSchemeFromJSON, TilingSchemeToJSON, TilingSchemeZodSchema } from './TilingScheme';

/**
 * `Cesium.GridImageryProvider` JSON ZodSchema
 * The `value` mirrors the constructor options, with complex values in their JSON form.
 */
export function GridImageryProviderZodSchema() {
  return z.object({
    parser: z.literal('GridImageryProvider'),
    value: z.object({
      cells: z.number().optional(),
      color: ColorZodSchema().optional(),
      glowColor: ColorZodSchema().optional(),
      glowWidth: z.number().optional(),
      backgroundColor: ColorZodSchema().optional(),
      canvasSize: z.number().optional(),
      tilingScheme: TilingSchemeZodSchema().optional(),
      ellipsoid: EllipsoidZodSchema().optional(),
      tileWidth: z.number().optional(),
      tileHeight: z.number().optional(),
    }),
  });
}

export type GridImageryProviderJSON = z.infer<ReturnType<typeof GridImageryProviderZodSchema>>;

/**
 * Convert `Cesium.GridImageryProvider` instance to JSON
 */
export function GridImageryProviderToJSON(instance?: GridImageryProvider): GridImageryProviderJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(GridImageryProvider).parse(instance);
  // cells/colors/canvasSize are only stored internally
  return {
    parser: 'GridImageryProvider',
    value: {
      cells: readPrivate<number>(instance, '_cells'),
      color: ColorToJSON(readPrivate<Color>(instance, '_color')),
      glowColor: ColorToJSON(readPrivate<Color>(instance, '_glowColor')),
      glowWidth: readPrivate<number>(instance, '_glowWidth'),
      backgroundColor: ColorToJSON(readPrivate<Color>(instance, '_backgroundColor')),
      canvasSize: readPrivate<number>(instance, '_canvasSize'),
      tilingScheme: TilingSchemeToJSON(instance.tilingScheme),
      ellipsoid: EllipsoidToJSON(instance.tilingScheme.ellipsoid),
      tileWidth: instance.tileWidth,
      tileHeight: instance.tileHeight,
    },
  };
}

/**
 * Convert JSON to `Cesium.GridImageryProvider` instance
 * @param json - A JSON containing instance data
 */
export function GridImageryProviderFromJSON(json?: GridImageryProviderJSON): GridImageryProvider | undefined {
  if (!json) {
    return undefined;
  }
  json = GridImageryProviderZodSchema().parse(json);
  const value = json.value;
  return new GridImageryProvider({
    cells: value.cells,
    color: ColorFromJSON(value.color),
    glowColor: ColorFromJSON(value.glowColor),
    glowWidth: value.glowWidth,
    backgroundColor: ColorFromJSON(value.backgroundColor),
    canvasSize: value.canvasSize,
    tilingScheme: TilingSchemeFromJSON(value.tilingScheme),
    ellipsoid: EllipsoidFromJSON(value.ellipsoid),
    tileWidth: value.tileWidth,
    tileHeight: value.tileHeight,
  });
}
