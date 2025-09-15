import { BoundingRectangle } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.BoundingRectangle` JSON ZodSchema
 */
export function BoundingRectangleZodSchema() {
  return z.object({
    parser: z.literal('BoundingRectangle'),
    value: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    }),
  });
}

export type BoundingRectangleJSON = z.infer<ReturnType<typeof BoundingRectangleZodSchema>>;

/**
 * Convert `Cesium.BoundingRectangle` instance to JSON
 */
export function BoundingRectangleToJSON(instance?: BoundingRectangle): BoundingRectangleJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(BoundingRectangle).parse(instance);
  return {
    parser: 'BoundingRectangle',
    value: {
      x: instance.x,
      y: instance.y,
      width: instance.width,
      height: instance.height,
    },
  };
}

/**
 * Convert JSON to `Cesium.BoundingRectangle` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function BoundingRectangleFromJSON(json?: BoundingRectangleJSON, result?: BoundingRectangle): BoundingRectangle | undefined {
  if (!json) {
    return undefined;
  }
  json = BoundingRectangleZodSchema().parse(result);
  const instance = new BoundingRectangle(
    json.value.x,
    json.value.y,
    json.value.width,
    json.value.height,
  );
  return result ? instance.clone(result) : instance;
}
