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
export function EntityToJSON(instance?: Entity, time?: JulianDate, omit?: keyof Entity): EntityJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(Entity).parse(instance);
  return {
    parser: 'Entity',
    value: {
      id: omit?.includes('id') ? undefined : instance.id,
      name: omit?.includes('name') ? undefined : instance.name,
      availability: omit?.includes('availability') ? undefined : TimeIntervalCollectionToJSON(instance.availability),
      show: omit?.includes('show') ? undefined : !!instance.show,
      description: omit?.includes('description') ? undefined : toPropertyValue(instance.description, time),
      position: omit?.includes('position') ? undefined : PositionPropertyToJSON(instance.position),
      orientation: omit?.includes('orientation') ? undefined : QuaternionToJSON(toPropertyValue(instance.orientation, time)),
      viewFrom: omit?.includes('viewFrom') ? undefined : Cartesian3ToJSON(toPropertyValue(instance.viewFrom, time)),
      billboard: omit?.includes('billboard') ? undefined : BillboardGraphicsToJSON(instance.billboard),
      box: omit?.includes('box') ? undefined : BoxGraphicsToJSON(instance.box),
      corridor: omit?.includes('corridor') ? undefined : CorridorGraphicsToJSON(instance.corridor),
      cylinder: omit?.includes('cylinder') ? undefined : CylinderGraphicsToJSON(instance.cylinder),
      ellipse: omit?.includes('ellipse') ? undefined : EllipseGraphicsToJSON(instance.ellipse),
      ellipsoid: omit?.includes('ellipsoid') ? undefined : EllipsoidGraphicsToJSON(instance.ellipsoid),
      label: omit?.includes('label') ? undefined : LabelGraphicsToJSON(instance.label),
      model: omit?.includes('model') ? undefined : ModelGraphicsToJSON(instance.model),
      tileset: omit?.includes('tileset') ? undefined : Cesium3DTilesetGraphicsToJSON(instance.tileset),
      path: omit?.includes('path') ? undefined : PathGraphicsToJSON(instance.path),
      plane: omit?.includes('plane') ? undefined : PlaneGraphicsToJSON(instance.plane),
      point: omit?.includes('point') ? undefined : PointGraphicsToJSON(instance.point),
      polygon: omit?.includes('polygon') ? undefined : PolygonGraphicsToJSON(instance.polygon),
      polyline: omit?.includes('polyline') ? undefined : PolylineGraphicsToJSON(instance.polyline),
      properties: omit?.includes('properties') ? undefined : PropertyBagToJSON(instance.properties),
      polylineVolume: omit?.includes('polylineVolume') ? undefined : PolylineVolumeGraphicsToJSON(instance.polylineVolume),
      rectangle: omit?.includes('rectangle') ? undefined : RectangleGraphicsToJSON(instance.rectangle),
      wall: omit?.includes('wall') ? undefined : WallGraphicsToJSON(instance.wall),
    },
  };
}

/**
 * Convert JSON to `Cesium.Entity` instance
 */
export function EntityFromJSON(json?: EntityJSON, omit?: keyof Entity): Entity | undefined {
  if (!json) {
    return undefined;
  }
  json = EntityZodSchema().parse(json);
  const instance = new Entity({
    id: omit?.includes('id') ? undefined : json.value.id,
    name: omit?.includes('name') ? undefined : json.value.name,
    availability: omit?.includes('availability') ? undefined : TimeIntervalCollectionFromJSON(json.value.availability),
    show: omit?.includes('show') ? undefined : json.value.show,
    description: omit?.includes('description') ? undefined : json.value.description,
    position: omit?.includes('position') ? undefined : PositionPropertyFromJSON(json.value.position),
    orientation: omit?.includes('orientation') ? undefined : QuaternionFromJSON((json.value.orientation)),
    viewFrom: omit?.includes('viewFrom') ? undefined : Cartesian3FromJSON(json.value.viewFrom),
    billboard: omit?.includes('billboard') ? undefined : BillboardGraphicsFromJSON(json.value.billboard),
    box: omit?.includes('box') ? undefined : BoxGraphicsFromJSON(json.value.box),
    corridor: omit?.includes('corridor') ? undefined : CorridorGraphicsFromJSON(json.value.corridor),
    cylinder: omit?.includes('cylinder') ? undefined : CylinderGraphicsFromJSON(json.value.cylinder),
    ellipse: omit?.includes('ellipse') ? undefined : EllipseGraphicsFromJSON(json.value.ellipse),
    ellipsoid: omit?.includes('ellipsoid') ? undefined : EllipsoidGraphicsFromJSON(json.value.ellipsoid),
    label: omit?.includes('label') ? undefined : LabelGraphicsFromJSON(json.value.label),
    model: omit?.includes('model') ? undefined : ModelGraphicsFromJSON(json.value.model),
    tileset: omit?.includes('tileset') ? undefined : Cesium3DTilesetGraphicsFromJSON(json.value.tileset),
    path: omit?.includes('path') ? undefined : PathGraphicsFromJSON(json.value.path),
    plane: omit?.includes('plane') ? undefined : PlaneGraphicsFromJSON(json.value.plane),
    point: omit?.includes('point') ? undefined : PointGraphicsFromJSON(json.value.point),
    polygon: omit?.includes('polygon') ? undefined : PolygonGraphicsFromJSON(json.value.polygon),
    polyline: omit?.includes('polyline') ? undefined : PolylineGraphicsFromJSON(json.value.polyline),
    properties: omit?.includes('properties') ? undefined : PropertyBagFromJSON(json.value.properties),
    polylineVolume: omit?.includes('polylineVolume') ? undefined : PolylineVolumeGraphicsFromJSON(json.value.polylineVolume),
    rectangle: omit?.includes('rectangle') ? undefined : RectangleGraphicsFromJSON(json.value.rectangle),
    wall: omit?.includes('wall') ? undefined : WallGraphicsFromJSON(json.value.wall),
  });
  return instance;
}
