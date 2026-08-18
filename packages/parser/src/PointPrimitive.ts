import type { PointPrimitive, PointPrimitiveCollection } from 'cesium';
import { PointPrimitive as CesiumPointPrimitive } from 'cesium';
import { z } from 'zod';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { DistanceDisplayConditionFromJSON, DistanceDisplayConditionToJSON, DistanceDisplayConditionZodSchema } from './DistanceDisplayCondition';
import { NearFarScalarFromJSON, NearFarScalarToJSON, NearFarScalarZodSchema } from './NearFarScalar';
import { orderedNearFar, primitiveIdToJSON } from './primitive';
import { SplitDirectionFromJSON, SplitDirectionToJSON, SplitDirectionZodSchema } from './SplitDirection';

const orderedNearFarSchema = orderedNearFar(NearFarScalarZodSchema());
const orderedDistanceSchema = orderedNearFar(DistanceDisplayConditionZodSchema());

export function PointPrimitiveZodSchema() {
  return z.object({
    parser: z.literal('PointPrimitive'),
    value: z.object({
      color: ColorZodSchema().optional(),
      disableDepthTestDistance: z.number().nonnegative().optional(),
      distanceDisplayCondition: orderedDistanceSchema.optional(),
      id: z.string().optional(),
      outlineColor: ColorZodSchema().optional(),
      outlineWidth: z.number().optional(),
      pixelSize: z.number().optional(),
      position: Cartesian3ZodSchema(),
      scaleByDistance: orderedNearFarSchema.optional(),
      show: z.boolean().optional(),
      splitDirection: SplitDirectionZodSchema().optional(),
      translucencyByDistance: orderedNearFarSchema.optional(),
    }),
  });
}

export type PointPrimitiveJSON = z.infer<ReturnType<typeof PointPrimitiveZodSchema>>;

export function PointPrimitiveToJSON(instance?: PointPrimitive): PointPrimitiveJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(CesiumPointPrimitive).parse(instance);
  return PointPrimitiveZodSchema().parse({
    parser: 'PointPrimitive',
    value: {
      color: ColorToJSON(instance.color),
      disableDepthTestDistance: instance.disableDepthTestDistance,
      distanceDisplayCondition: DistanceDisplayConditionToJSON(instance.distanceDisplayCondition),
      id: primitiveIdToJSON(instance.id),
      outlineColor: ColorToJSON(instance.outlineColor),
      outlineWidth: instance.outlineWidth,
      pixelSize: instance.pixelSize,
      position: Cartesian3ToJSON(instance.position),
      scaleByDistance: NearFarScalarToJSON(instance.scaleByDistance),
      show: instance.show,
      splitDirection: SplitDirectionToJSON(instance.splitDirection),
      translucencyByDistance: NearFarScalarToJSON(instance.translucencyByDistance),
    },
  });
}

export function PointPrimitiveFromJSON(json: PointPrimitiveJSON, collection: PointPrimitiveCollection): PointPrimitive {
  const parsed = PointPrimitiveZodSchema().parse(json).value;
  if (!collection) {
    throw new TypeError('PointPrimitiveFromJSON requires a PointPrimitiveCollection.');
  }
  return collection.add({
    color: ColorFromJSON(parsed.color),
    disableDepthTestDistance: parsed.disableDepthTestDistance,
    distanceDisplayCondition: DistanceDisplayConditionFromJSON(parsed.distanceDisplayCondition),
    id: parsed.id,
    outlineColor: ColorFromJSON(parsed.outlineColor),
    outlineWidth: parsed.outlineWidth,
    pixelSize: parsed.pixelSize,
    position: Cartesian3FromJSON(parsed.position)!,
    scaleByDistance: NearFarScalarFromJSON(parsed.scaleByDistance),
    show: parsed.show,
    splitDirection: SplitDirectionFromJSON(parsed.splitDirection),
    translucencyByDistance: NearFarScalarFromJSON(parsed.translucencyByDistance),
  });
}
