import type { JulianDate } from 'cesium';
import { PropertyBag } from 'cesium';
import { z } from 'zod';

/**
 * `Cesium.PropertyBag` JSON ZodSchema
 */
export function PropertyBagZodSchema() {
  return z.object({
    parser: z.literal('PropertyBag'),
    value: z.object({
      propertyNames: z.array(z.string()),
      content: z.record(z.string(), z.any()),
    }),
  });
}

export type PropertyBagJSON = z.infer<ReturnType<typeof PropertyBagZodSchema>>;

/**
 * Convert `Cesium.PropertyBag` instance to JSON
 */
export function PropertyBagToJSON(instance?: PropertyBag, time?: JulianDate): PropertyBagJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PropertyBag).parse(instance);
  return {
    parser: 'PropertyBag',
    value: {
      propertyNames: instance.propertyNames,
      content: instance.propertyNames.reduce((key, content) => {
        content[key] = instance[key]?.getValue(time);
        return content;
      }, {} as Record<string, any>),
    },
  };
}

/**
 * Convert JSON to `Cesium.PropertyBag` instance
 * @param json - A JSON containing instance data
 * @param result - Used to store the resulting instance. If not provided, a new instance will be created
 */
export function PropertyBagFromJSON(json?: PropertyBagJSON, result?: PropertyBag): PropertyBag | undefined {
  if (!json) {
    return undefined;
  }
  json = PropertyBagZodSchema().parse(json);
  if (result) {
    result.propertyNames.forEach(key => result.removeProperty(key));
  }
  const instance = result ?? new PropertyBag();
  json.value.propertyNames.forEach(key => instance.addProperty(key, json.value.content[key]));
  return instance ? instance.clone(result) : instance;
}
