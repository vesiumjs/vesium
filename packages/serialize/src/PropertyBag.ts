import type { JulianDate } from 'cesium';
import { PropertyBag } from 'cesium';

import { z } from 'zod';

export type PropertyBagJSON = z.infer<typeof PropertyBagParse.JsonSchema>;

/**
 * Serialize a `PropertyBag` instance to JSON and deserialize from JSON
 */
export class PropertyBagParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    propertyNames: z.array(z.string()),
    content: z.record(z.string(), z.any()),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(PropertyBag);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PropertyBag, time?: JulianDate): PropertyBagJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      propertyNames: instance.propertyNames,
      content: instance.propertyNames.reduce((key, content) => {
        content[key] = instance[key]?.getValue(time);
        return content;
      }, {} as Record<string, any>),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PropertyBagJSON, result?: PropertyBag): PropertyBag | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    if (result) {
      result.propertyNames.forEach(key => result.removeProperty(key));
    }
    const instance = result ?? new PropertyBag();
    json.propertyNames.forEach(key => instance.addProperty(key ?? undefined, json.content[key]));
    return instance ? instance.clone(result) : instance;
  }
}
