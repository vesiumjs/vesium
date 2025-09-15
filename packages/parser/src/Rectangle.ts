import { Rectangle } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Rectangle` JSON ZodSchema
 */
export function RectangleZodSchema() {
  return z.object({
    parser: z.literal('Rectangle'),
    value: z.object({
      west: z.number(),
      south: z.number(),
      east: z.number(),
      north: z.number(),
    }),
  });
}

export type RectangleJSON = z.infer<ReturnType<typeof RectangleZodSchema>>;

/**
 * Convert `Cesium.Rectangle` instance to JSON
 */
export function RectangleToJSON(instance?: Rectangle): RectangleJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Rectangle).parse(instance);
  return {
    parser: 'Rectangle',
    value: {
      west: instance.west,
      south: instance.south,
      east: instance.east,
      north: instance.north,
    },
  };
}

/**
 * Convert JSON to `Cesium.Rectangle` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function RectangleFromJSON(json?: RectangleJSON, result?: Rectangle): Rectangle | undefined {
  if (!json) {
    return undefined;
  }
  json = RectangleZodSchema().parse(json);
  const instance = new Rectangle(
    json.value.west,
    json.value.south,
    json.value.east,
    json.value.north,
  );
  return result ? instance.clone(result) : instance;
}
