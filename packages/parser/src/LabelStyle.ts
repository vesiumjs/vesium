import { LabelStyle } from 'cesium';
import { z } from 'zod';

const strings = ['FILL', 'OUTLINE', 'FILL_AND_OUTLINE'] as const;

/**
 * `Cesium.LabelStyle` JSON ZodSchema
 */
export function LabelStyleZodSchema() {
  return z.object({
    parser: z.literal('LabelStyle'),
    value: z.enum(strings),
  });
}

export type LabelStyleJSON = z.infer<ReturnType<typeof LabelStyleZodSchema>>;

/**
 * Convert `Cesium.LabelStyle` instance to JSON
 */
export function LabelStyleToJSON(instance?: LabelStyle): LabelStyleJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(LabelStyle).parse(instance);
  return {
    parser: 'LabelStyle',
    value: Object.keys(LabelStyle).find((key: any) => Reflect.get(LabelStyle, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.LabelStyle` instance
 */
export function LabelStyleFromJSON(json?: LabelStyleJSON): LabelStyle | undefined {
  if (json) {
    return LabelStyle[json.value];
  }
}
