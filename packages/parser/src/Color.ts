import { Color } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.Color` JSON ZodSchema
 */
export function ColorZodSchema() {
  return z.object({
    parser: z.literal('Color'),
    value: z.object({
      red: z.number().optional(),
      green: z.number().optional(),
      blue: z.number().optional(),
      alpha: z.number().optional(),
    }),
  });
}

export type ColorJSON = z.infer<ReturnType<typeof ColorZodSchema>>;

/**
 * Convert `Cesium.Color` instance to JSON
 */
export function ColorToJSON(instance?: Color): ColorJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Color).parse(instance);
  return {
    parser: 'Color',
    value: {
      red: instance.red,
      green: instance.green,
      blue: instance.blue,
      alpha: instance.alpha,
    },
  };
}

/**
 * Convert JSON to `Cesium.Color` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function ColorFromJSON(json?: ColorJSON, result?: Color): Color | undefined {
  if (!json) {
    return undefined;
  }
  json = ColorZodSchema().parse(json);
  const instance = new Color(
    json.value.red,
    json.value.green,
    json.value.blue,
    json.value.alpha,
  );
  return result ? instance.clone(result) : instance;
}
