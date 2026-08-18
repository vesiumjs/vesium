import { EdgeDisplayMode } from 'cesium';
import { z } from 'zod';

const strings = ['SURFACES_ONLY', 'EDGES_ONLY', 'SURFACES_AND_EDGES'] as const;

export function EdgeDisplayModeZodSchema() {
  return z.object({
    parser: z.literal('EdgeDisplayMode'),
    value: z.enum(strings),
  });
}

export type EdgeDisplayModeJSON = z.infer<ReturnType<typeof EdgeDisplayModeZodSchema>>;

export function EdgeDisplayModeToJSON(instance?: EdgeDisplayMode): EdgeDisplayModeJSON | undefined {
  if (instance === undefined || instance === null) {
    return undefined;
  }
  z.enum(EdgeDisplayMode).parse(instance);
  return EdgeDisplayModeZodSchema().parse({
    parser: 'EdgeDisplayMode',
    value: Object.keys(EdgeDisplayMode).find(key => Reflect.get(EdgeDisplayMode, key) === instance),
  });
}

export function EdgeDisplayModeFromJSON(json?: EdgeDisplayModeJSON): EdgeDisplayMode | undefined {
  if (!json) {
    return undefined;
  }
  return EdgeDisplayMode[EdgeDisplayModeZodSchema().parse(json).value];
}
