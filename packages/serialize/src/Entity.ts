import type { JulianDate } from 'cesium';

import { Entity } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { BillboardGraphicsParse } from './BillboardGraphics';
import { BoxGraphicsParse } from './BoxGraphics';
import { Cartesian3Parse } from './Cartesian3';
import { Cesium3DTilesetGraphicsParse } from './Cesium3DTilesetGraphics';
import { CorridorGraphicsParse } from './CorridorGraphics';
import { CylinderGraphicsParse } from './CylinderGraphics';
import { EllipseGraphicsParse } from './EllipseGraphics';
import { EllipsoidGraphicsParse } from './EllipsoidGraphics';
import { LabelGraphicsParse } from './LabelGraphics';
import { ModelGraphicsParse } from './ModelGraphics';
import { PathGraphicsParse } from './PathGraphics';
import { PlaneGraphicsParse } from './PlaneGraphics';
import { PointGraphicsParse } from './PointGraphics';
import { PolygonGraphicsParse } from './PolygonGraphics';
import { PolylineGraphicsParse } from './PolylineGraphics';
import { PolylineVolumeGraphicsParse } from './PolylineVolumeGraphics';
import { PositionPropertyParse } from './PositionProperty';
import { PropertyBagParse } from './PropertyBag';
import { QuaternionParse } from './Quaternion';
import { RectangleGraphicsParse } from './RectangleGraphics';
import { TimeIntervalCollectionParse } from './TimeIntervalCollection';
import { WallGraphicsParse } from './WallGraphics';

export type EntityJSON = z.infer<typeof EntityParse.JsonSchema>;

/**
 * Serialize a `Entity` instance to JSON and deserialize from JSON
 */
export class EntityParse {
  private constructor() {}

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    availability: TimeIntervalCollectionParse.JsonSchema.optional(),
    show: z.boolean().optional(),
    description: z.string().optional(),
    position: PositionPropertyParse.JsonSchema.optional(),
    orientation: QuaternionParse.JsonSchema.optional(),
    viewFrom: Cartesian3Parse.JsonSchema.optional(),
    parent: z.string().optional(),
    billboard: BillboardGraphicsParse.JsonSchema.optional(),
    box: BoxGraphicsParse.JsonSchema.optional(),
    corridor: CorridorGraphicsParse.JsonSchema.optional(),
    cylinder: CylinderGraphicsParse.JsonSchema.optional(),
    ellipse: EllipseGraphicsParse.JsonSchema.optional(),
    ellipsoid: EllipsoidGraphicsParse.JsonSchema.optional(),
    label: LabelGraphicsParse.JsonSchema.optional(),
    model: ModelGraphicsParse.JsonSchema.optional(),
    tileset: Cesium3DTilesetGraphicsParse.JsonSchema.optional(),
    path: PathGraphicsParse.JsonSchema.optional(),
    plane: PlaneGraphicsParse.JsonSchema.optional(),
    point: PointGraphicsParse.JsonSchema.optional(),
    polygon: PolygonGraphicsParse.JsonSchema.optional(),
    polyline: PolylineGraphicsParse.JsonSchema.optional(),
    properties: PropertyBagParse.JsonSchema.optional(),
    polylineVolume: PolylineVolumeGraphicsParse.JsonSchema.optional(),
    rectangle: RectangleGraphicsParse.JsonSchema.optional(),
    wall: WallGraphicsParse.JsonSchema.optional(),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(Entity);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Entity, time?: JulianDate): EntityJSON | undefined {
    if (!instance) {
      return undefined;
    }
    instance = this.InstanceSchema.parse(instance);
    return {
      id: instance.id,
      name: instance.name,
      availability: TimeIntervalCollectionParse.toJSON(instance?.availability),
      show: !!instance.show,
      description: toPropertyValue(instance.description, time),
      position: PositionPropertyParse.toJSON(instance?.position),
      orientation: QuaternionParse.toJSON(toPropertyValue(instance.orientation, time)),
      viewFrom: Cartesian3Parse.toJSON(toPropertyValue(instance.viewFrom, time)),
      billboard: BillboardGraphicsParse.toJSON(instance?.billboard),
      box: BoxGraphicsParse.toJSON(instance?.box),
      corridor: CorridorGraphicsParse.toJSON(instance?.corridor),
      cylinder: CylinderGraphicsParse.toJSON(instance?.cylinder),
      ellipse: EllipseGraphicsParse.toJSON(instance?.ellipse),
      ellipsoid: EllipsoidGraphicsParse.toJSON(instance?.ellipsoid),
      label: LabelGraphicsParse.toJSON(instance?.label),
      model: ModelGraphicsParse.toJSON(instance?.model),
      tileset: Cesium3DTilesetGraphicsParse.toJSON(instance?.tileset),
      path: PathGraphicsParse.toJSON(instance?.path),
      plane: PlaneGraphicsParse.toJSON(instance?.plane),
      point: PointGraphicsParse.toJSON(instance?.point),
      polygon: PolygonGraphicsParse.toJSON(instance?.polygon),
      polyline: PolylineGraphicsParse.toJSON(instance?.polyline),
      properties: PropertyBagParse.toJSON(instance?.properties),
      polylineVolume: PolylineVolumeGraphicsParse.toJSON(instance?.polylineVolume),
      rectangle: RectangleGraphicsParse.toJSON(instance?.rectangle),
      wall: WallGraphicsParse.toJSON(instance?.wall),
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: EntityJSON): Entity | undefined {
    if (!json) {
      return undefined;
    }
    json = this.JsonSchema.parse(json);
    const instance = new Entity({
      id: json.id ?? undefined,
      name: json.name ?? undefined,
      availability: TimeIntervalCollectionParse.fromJSON(json?.availability),
      show: json.show ?? undefined,
      description: json.description ?? undefined,
      position: PositionPropertyParse.fromJSON(json?.position),
      orientation: QuaternionParse.fromJSON((json.orientation)) ?? undefined,
      viewFrom: Cartesian3Parse.fromJSON(json?.viewFrom),
      billboard: BillboardGraphicsParse.fromJSON(json?.billboard),
      box: BoxGraphicsParse.fromJSON(json?.box),
      corridor: CorridorGraphicsParse.fromJSON(json?.corridor),
      cylinder: CylinderGraphicsParse.fromJSON(json?.cylinder),
      ellipse: EllipseGraphicsParse.fromJSON(json?.ellipse),
      ellipsoid: EllipsoidGraphicsParse.fromJSON(json?.ellipsoid),
      label: LabelGraphicsParse.fromJSON(json?.label),
      model: ModelGraphicsParse.fromJSON(json?.model),
      tileset: Cesium3DTilesetGraphicsParse.fromJSON(json?.tileset),
      path: PathGraphicsParse.fromJSON(json?.path),
      plane: PlaneGraphicsParse.fromJSON(json?.plane),
      point: PointGraphicsParse.fromJSON(json?.point),
      polygon: PolygonGraphicsParse.fromJSON(json?.polygon),
      polyline: PolylineGraphicsParse.fromJSON(json?.polyline),
      properties: PropertyBagParse.fromJSON(json?.properties),
      polylineVolume: PolylineVolumeGraphicsParse.fromJSON(json?.polylineVolume),
      rectangle: RectangleGraphicsParse.fromJSON(json?.rectangle),
      wall: WallGraphicsParse.fromJSON(json?.wall),
    });
    return instance;
  }
}
