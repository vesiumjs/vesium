import { Axis } from 'cesium';
import { z } from 'zod';

const strings = ['NONE', 'X', 'Y', 'Z'] as const;

export function AxisZodSchema() {
  return z.object({
    parser: z.literal('Axis'),
    value: z.enum(strings),
  });
}

export type AxisJSON = z.infer<ReturnType<typeof AxisZodSchema>>;

export function AxisToJSON(instance?: Axis): AxisJSON | undefined {
  if (instance === undefined || instance === null) {
    return undefined;
  }
  z.enum(Axis).parse(instance);
  return AxisZodSchema().parse({
    parser: 'Axis',
    value: Object.keys(Axis).find(key => Reflect.get(Axis, key) === instance),
  });
}

export function AxisFromJSON(json?: AxisJSON): Axis | undefined {
  if (!json) {
    return undefined;
  }
  return Reflect.get(Axis, AxisZodSchema().parse(json).value) as Axis;
}
