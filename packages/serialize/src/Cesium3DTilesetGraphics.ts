import type { JulianDate } from 'cesium';
import { Cesium3DTilesetGraphics } from 'cesium';
import { toPropertyValue } from 'vesium';

import { z } from 'zod';

export type Cesium3DTilesetGraphicsJSON = z.infer<typeof Cesium3DTilesetGraphicsParse.JsonSchema>;

/**
 * Serialize a `Cesium3DTilesetGraphics` instance to JSON and deserialize from JSON
 */
export class Cesium3DTilesetGraphicsParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    show: z.boolean().optional(),
    uri: z.string().optional(),
    maximumScreenSpaceError: z.number().optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Cesium3DTilesetGraphics);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cesium3DTilesetGraphics, time?: JulianDate): Cesium3DTilesetGraphicsJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      show: toPropertyValue(instance.show, time),
      uri: toPropertyValue(instance.uri, time),
      maximumScreenSpaceError: toPropertyValue(instance.maximumScreenSpaceError, time),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cesium3DTilesetGraphicsJSON, result?: Cesium3DTilesetGraphics): Cesium3DTilesetGraphics | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new Cesium3DTilesetGraphics({
      show: json.show ?? undefined,
      uri: json.uri ?? undefined,
      maximumScreenSpaceError: json.maximumScreenSpaceError ?? undefined,
    });
    return result ? instance.clone(result) : instance;
  }
}
