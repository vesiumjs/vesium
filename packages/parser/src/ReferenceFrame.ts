import { ReferenceFrame } from 'cesium';
import { z } from 'zod';

const strings = ['FIXED', 'INERTIAL'] as const;

/**
 * `Cesium.ReferenceFrame` JSON ZodSchema
 */
export function ReferenceFrameZodSchema() {
  return z.object({
    parser: z.literal('ReferenceFrame'),
    value: z.enum(strings),
  });
}

export type ReferenceFrameJSON = z.infer<ReturnType<typeof ReferenceFrameZodSchema>>;

/**
 * Convert `Cesium.ReferenceFrame` instance to JSON
 */
export function ReferenceFrameToJSON(instance?: ReferenceFrame): ReferenceFrameJSON | undefined {
  if (instance === undefined || instance === null) {
    return undefined;
  }
  instance = z.enum(ReferenceFrame).parse(instance);
  return {
    parser: 'ReferenceFrame',
    value: Object.keys(ReferenceFrame).find(key => Reflect.get(ReferenceFrame, key) === instance) as (typeof strings)[number],
  };
}

/**
 * Convert JSON to `Cesium.ReferenceFrame` instance
 */
export function ReferenceFrameFromJSON(json?: ReferenceFrameJSON): ReferenceFrame | undefined {
  if (json) {
    return ReferenceFrame[json.value];
  }
}
