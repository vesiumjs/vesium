import { BlendOption } from 'cesium';
import { z } from 'zod';

const strings = ['OPAQUE', 'TRANSLUCENT', 'OPAQUE_AND_TRANSLUCENT'] as const;

export function BlendOptionZodSchema() {
  return z.object({
    parser: z.literal('BlendOption'),
    value: z.enum(strings),
  });
}

export type BlendOptionJSON = z.infer<ReturnType<typeof BlendOptionZodSchema>>;

export function BlendOptionToJSON(instance?: BlendOption): BlendOptionJSON | undefined {
  if (instance === undefined || instance === null) {
    return undefined;
  }
  z.enum(BlendOption).parse(instance);
  return BlendOptionZodSchema().parse({
    parser: 'BlendOption',
    value: Object.keys(BlendOption).find(key => Reflect.get(BlendOption, key) === instance),
  });
}

export function BlendOptionFromJSON(json?: BlendOptionJSON): BlendOption | undefined {
  if (!json) {
    return undefined;
  }
  return BlendOption[BlendOptionZodSchema().parse(json).value];
}
