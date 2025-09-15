import type { JulianDate } from 'cesium';
import { Entity } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { BillboardGraphicsFromJSON, BillboardGraphicsToJSON, BillboardGraphicsZodSchema } from './BillboardGraphics';
import { BoxGraphicsFromJSON, BoxGraphicsToJSON, BoxGraphicsZodSchema } from './BoxGraphics';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema } from './Cartesian3';
import { Cesium3DTilesetGraphicsFromJSON, Cesium3DTilesetGraphicsToJSON, Cesium3DTilesetGraphicsZodSchema } from './Cesium3DTilesetGraphics';
import { CorridorGraphicsFromJSON, CorridorGraphicsToJSON, CorridorGraphicsZodSchema } from './CorridorGraphics';
import { CylinderGraphicsFromJSON, CylinderGraphicsToJSON, CylinderGraphicsZodSchema } from './CylinderGraphics';
import { EllipseGraphicsFromJSON, EllipseGraphicsToJSON, EllipseGraphicsZodSchema } from './EllipseGraphics';
import { EllipsoidGraphicsFromJSON, EllipsoidGraphicsToJSON, EllipsoidGraphicsZodSchema } from './EllipsoidGraphics';
import { LabelGraphicsFromJSON, LabelGraphicsToJSON, LabelGraphicsZodSchema } from './LabelGraphics';
import { ModelGraphicsFromJSON, ModelGraphicsToJSON, ModelGraphicsZodSchema } from './ModelGraphics';
import { PathGraphicsFromJSON, PathGraphicsToJSON, PathGraphicsZodSchema } from './PathGraphics';
import { PlaneGraphicsFromJSON, PlaneGraphicsToJSON, PlaneGraphicsZodSchema } from './PlaneGraphics';
import { PointGraphicsFromJSON, PointGraphicsToJSON, PointGraphicsZodSchema } from './PointGraphics';
import { PolygonGraphicsFromJSON, PolygonGraphicsToJSON, PolygonGraphicsZodSchema } from './PolygonGraphics';
import { PolylineGraphicsFromJSON, PolylineGraphicsToJSON, PolylineGraphicsZodSchema } from './PolylineGraphics';
import { PolylineVolumeGraphicsFromJSON, PolylineVolumeGraphicsToJSON, PolylineVolumeGraphicsZodSchema } from './PolylineVolumeGraphics';
import { PositionPropertyFromJSON, PositionPropertyToJSON, PositionPropertyZodSchema } from './PositionProperty';
import { PropertyBagFromJSON, PropertyBagToJSON, PropertyBagZodSchema } from './PropertyBag';
import { QuaternionFromJSON, QuaternionToJSON, QuaternionZodSchema } from './Quaternion';
import { RectangleGraphicsFromJSON, RectangleGraphicsToJSON, RectangleGraphicsZodSchema } from './RectangleGraphics';
import { TimeIntervalCollectionFromJSON, TimeIntervalCollectionToJSON, TimeIntervalCollectionZodSchema } from './TimeIntervalCollection';
import { WallGraphicsFromJSON, WallGraphicsToJSON, WallGraphicsZodSchema } from './WallGraphics';

/**
 * `Cesium.Entity` JSON ZodSchema
 */
export function EntityZodSchema() {
  return z.object({
    parser: z.literal('Entity'),
    value: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      availability: TimeIntervalCollectionZodSchema().optional(),
      show: z.boolean().optional(),
      description: z.string().optional(),
      position: PositionPropertyZodSchema().optional(),
      orientation: QuaternionZodSchema().optional(),
      viewFrom: Cartesian3ZodSchema().optional(),
      parent: z.string().optional(),
      billboard: BillboardGraphicsZodSchema().optional(),
      box: BoxGraphicsZodSchema().optional(),
      corridor: CorridorGraphicsZodSchema().optional(),
      cylinder: CylinderGraphicsZodSchema().optional(),
      ellipse: EllipseGraphicsZodSchema().optional(),
      ellipsoid: EllipsoidGraphicsZodSchema().optional(),
      label: LabelGraphicsZodSchema().optional(),
      model: ModelGraphicsZodSchema().optional(),
      tileset: Cesium3DTilesetGraphicsZodSchema().optional(),
      path: PathGraphicsZodSchema().optional(),
      plane: PlaneGraphicsZodSchema().optional(),
      point: PointGraphicsZodSchema().optional(),
      polygon: PolygonGraphicsZodSchema().optional(),
      polyline: PolylineGraphicsZodSchema().optional(),
      properties: PropertyBagZodSchema().optional(),
      polylineVolume: PolylineVolumeGraphicsZodSchema().optional(),
      rectangle: RectangleGraphicsZodSchema().optional(),
      wall: WallGraphicsZodSchema().optional(),
    }),
  });
}

export type EntityJSON = z.infer<ReturnType<typeof EntityZodSchema>>;

/**
 * Convert `Cesium.Entity` instance to JSON
 */
export function EntityToJSON(instance?: Entity, time?: JulianDate): EntityJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Entity).parse(instance);
  return {
    parser: 'Entity',
    value: {
      id: instance.id,
      name: instance.name,
      availability: TimeIntervalCollectionToJSON(instance.availability),
      show: !!instance.show,
      description: toPropertyValue(instance.description, time),
      position: PositionPropertyToJSON(instance.position),
      orientation: QuaternionToJSON(toPropertyValue(instance.orientation, time)),
      viewFrom: Cartesian3ToJSON(toPropertyValue(instance.viewFrom, time)),
      billboard: BillboardGraphicsToJSON(instance.billboard),
      box: BoxGraphicsToJSON(instance.box),
      corridor: CorridorGraphicsToJSON(instance.corridor),
      cylinder: CylinderGraphicsToJSON(instance.cylinder),
      ellipse: EllipseGraphicsToJSON(instance.ellipse),
      ellipsoid: EllipsoidGraphicsToJSON(instance.ellipsoid),
      label: LabelGraphicsToJSON(instance.label),
      model: ModelGraphicsToJSON(instance.model),
      tileset: Cesium3DTilesetGraphicsToJSON(instance.tileset),
      path: PathGraphicsToJSON(instance.path),
      plane: PlaneGraphicsToJSON(instance.plane),
      point: PointGraphicsToJSON(instance.point),
      polygon: PolygonGraphicsToJSON(instance.polygon),
      polyline: PolylineGraphicsToJSON(instance.polyline),
      properties: PropertyBagToJSON(instance.properties),
      polylineVolume: PolylineVolumeGraphicsToJSON(instance.polylineVolume),
      rectangle: RectangleGraphicsToJSON(instance.rectangle),
      wall: WallGraphicsToJSON(instance.wall),
    },
  };
}

/**
 * Convert JSON to `Cesium.Entity` instance
 */
export function EntityFromJSON(json?: EntityJSON): Entity | undefined {
  if (!json) {
    return undefined;
  }
  json = EntityZodSchema().parse(json);
  const instance = new Entity({
    id: json.value.id,
    name: json.value.name,
    availability: TimeIntervalCollectionFromJSON(json.value.availability),
    show: json.value.show,
    description: json.value.description,
    position: PositionPropertyFromJSON(json.value.position),
    orientation: QuaternionFromJSON((json.value.orientation)),
    viewFrom: Cartesian3FromJSON(json.value.viewFrom),
    billboard: BillboardGraphicsFromJSON(json.value.billboard),
    box: BoxGraphicsFromJSON(json.value.box),
    corridor: CorridorGraphicsFromJSON(json.value.corridor),
    cylinder: CylinderGraphicsFromJSON(json.value.cylinder),
    ellipse: EllipseGraphicsFromJSON(json.value.ellipse),
    ellipsoid: EllipsoidGraphicsFromJSON(json.value.ellipsoid),
    label: LabelGraphicsFromJSON(json.value.label),
    model: ModelGraphicsFromJSON(json.value.model),
    tileset: Cesium3DTilesetGraphicsFromJSON(json.value.tileset),
    path: PathGraphicsFromJSON(json.value.path),
    plane: PlaneGraphicsFromJSON(json.value.plane),
    point: PointGraphicsFromJSON(json.value.point),
    polygon: PolygonGraphicsFromJSON(json.value.polygon),
    polyline: PolylineGraphicsFromJSON(json.value.polyline),
    properties: PropertyBagFromJSON(json.value.properties),
    polylineVolume: PolylineVolumeGraphicsFromJSON(json.value.polylineVolume),
    rectangle: RectangleGraphicsFromJSON(json.value.rectangle),
    wall: WallGraphicsFromJSON(json.value.wall),
  });
  return instance;
}
