import type { JulianDate } from 'cesium';
import { Cesium3DTilesetGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';

/**
 * `Cesium.Cesium3DTilesetGraphics` JSON ZodSchema
 */
export function Cesium3DTilesetGraphicsZodSchema() {
  return z.object({
    parser: z.literal('Cesium3DTilesetGraphics'),
    value: z.object({
      show: z.boolean().optional(),
      uri: z.string().optional(),
      maximumScreenSpaceError: z.number().optional(),
    }),
  });
}

export type Cesium3DTilesetGraphicsJSON = z.infer<ReturnType<typeof Cesium3DTilesetGraphicsZodSchema>>;

/**
 * Convert `Cesium.Cesium3DTilesetGraphics` instance to JSON
 */
export function Cesium3DTilesetGraphicsToJSON(instance?: Cesium3DTilesetGraphics, time?: JulianDate): Cesium3DTilesetGraphicsJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Cesium3DTilesetGraphics).parse(instance);
  return {
    parser: 'Cesium3DTilesetGraphics',
    value: {
      show: toPropertyValue(instance.show, time),
      uri: toPropertyValue(instance.uri, time),
      maximumScreenSpaceError: toPropertyValue(instance.maximumScreenSpaceError, time),
    },
  };
}

/**
 * Convert JSON to `Cesium.Cesium3DTilesetGraphics` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function Cesium3DTilesetGraphicsFromJSON(json?: Cesium3DTilesetGraphicsJSON, result?: Cesium3DTilesetGraphics): Cesium3DTilesetGraphics | undefined {
  if (!json) {
    return undefined;
  }
  json = Cesium3DTilesetGraphicsZodSchema().parse(json);
  const instance = new Cesium3DTilesetGraphics({
    show: json.value.show,
    uri: json.value.uri,
    maximumScreenSpaceError: json.value.maximumScreenSpaceError,
  });
  return result ? instance.clone(result) : instance;
}
