import { SplitDirection } from 'cesium';
import { z } from 'zod';

const strings = ['LEFT', 'NONE', 'RIGHT'] as const;

/**
 * `Cesium.SplitDirection` JSON ZodSchema
 */
export function SplitDirectionZodSchema() {
  return z.object({
    parser: z.literal('SplitDirection'),
    value: z.enum(strings),
  });
}

export type SplitDirectionJSON = z.infer<ReturnType<typeof SplitDirectionZodSchema>>;

/**
 * Convert `Cesium.SplitDirection` instance to JSON
 */
export function SplitDirectionToJSON(instance?: SplitDirection): SplitDirectionJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.enum(SplitDirection).parse(instance);
  return {
    parser: 'SplitDirection',
    value: Object.keys(SplitDirection).find((key: any) => Reflect.get(SplitDirection, key) === instance) as any,
  };
}

/**
 * Convert JSON to `Cesium.SplitDirection` instance
 */
export function SplitDirectionFromJSON(json?: SplitDirectionJSON): SplitDirection | undefined {
  if (json) {
    return SplitDirection[json.value];
  }
}
