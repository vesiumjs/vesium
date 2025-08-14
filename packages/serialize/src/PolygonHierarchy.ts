import type { Cartesian3JSON } from './Cartesian3';
import { PolygonHierarchy } from 'cesium';

import { z } from 'zod';
import { Cartesian3Parse } from './Cartesian3';

export interface PolygonHierarchyJSON {
  positions: Cartesian3JSON[];
  holes: PolygonHierarchyJSON[];
}

/**
 * Serialize a `PolygonHierarchy` instance to JSON and deserialize from JSON
 */
export class PolygonHierarchyParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema: any = z.lazy(() => {
    return z.object({
      positions: z.array(Cartesian3Parse.JsonSchema),
      holes: z.array(PolygonHierarchyParse.JsonSchema),
    });
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(PolygonHierarchy);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolygonHierarchy): PolygonHierarchyJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      positions: instance.positions.map((item: any) => Cartesian3Parse.toJSON(item)!),
      holes: instance.holes.map((item: any) => PolygonHierarchyParse.toJSON(item)!),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PolygonHierarchyJSON, result?: PolygonHierarchy): PolygonHierarchy | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(result);
    const instance = new PolygonHierarchy(
      json!.positions?.map(item => Cartesian3Parse.fromJSON(item)!) ?? undefined,
      json!.holes?.map(item => PolygonHierarchyParse.fromJSON(item)!) ?? undefined,
    );
    if (!result) {
      return instance;
    }
    result.positions = instance.positions;
    result.holes = instance.holes;
    return result;
  }
}
