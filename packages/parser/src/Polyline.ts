import type { Polyline, PolylineCollection } from 'cesium';
import { Polyline as CesiumPolyline } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { MaterialFromJSON, MaterialToJSON, MaterialZodSchema } from './Material';
import { orderedNearFar, primitiveIdToJSON } from './primitive';

const orderedDistanceSchema = orderedNearFar(DistanceDisplayConditionZodSchema());

export function PolylineZodSchema() {
  return z.object({
    parser: z.literal('Polyline'),
    value: z.object({
      distanceDisplayCondition: orderedDistanceSchema.optional(),
      id: z.string().optional(),
      loop: z.boolean().optional(),
      material: MaterialZodSchema().optional(),
      positions: z.array(Cartesian3ZodSchema()),
      show: z.boolean().optional(),
      width: z.number().optional(),
    }),
  });
}

export type PolylineJSON = z.infer<ReturnType<typeof PolylineZodSchema>>;

export function PolylineToJSON(instance?: Polyline): PolylineJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CesiumPolyline).parse(instance);
  return PolylineZodSchema().parse({
    parser: 'Polyline',
    value: {
      distanceDisplayCondition: DistanceDisplayConditionToJSON(instance.distanceDisplayCondition),
      id: primitiveIdToJSON(instance.id),
      loop: instance.loop,
      material: MaterialToJSON(instance.material),
      positions: instance.positions.map(Cartesian3ToJSON),
      show: instance.show,
      width: instance.width,
    },
  });
}

export function PolylineFromJSON(json: PolylineJSON, collection: PolylineCollection): Polyline {
  const parsed = PolylineZodSchema().parse(json).value;
  if (!collection) {
    throw new TypeError('PolylineFromJSON requires a PolylineCollection.');
  }
  return collection.add({
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(parsed.distanceDisplayCondition),
    id: parsed.id,
    loop: parsed.loop,
    material: MaterialFromJSON(parsed.material),
    positions: parsed.positions.map(position => Cartesian3FromJSON(position)!),
    show: parsed.show,
    width: parsed.width,
  });
}
