import { ArcTypeParse } from './src/ArcType';
import { BillboardGraphicsParse } from './src/BillboardGraphics';
import { BoundingRectangleParse } from './src/BoundingRectangle';
import { BoxGraphicsParse } from './src/BoxGraphics';
import { Cartesian2Parse } from './src/Cartesian2';
import { Cartesian3Parse } from './src/Cartesian3';
import { Cesium3DTilesetGraphicsParse } from './src/Cesium3DTilesetGraphics';
import { ClassificationTypeParse } from './src/ClassificationType';
import { ClippingPlaneParse } from './src/ClippingPlane';
import { ClippingPlaneCollectionParse } from './src/ClippingPlaneCollection';
import { ColorParse } from './src/Color';
import { ColorBlendModeParse } from './src/ColorBlendMode';
import { ConstantPositionPropertyParse } from './src/ConstantPositionProperty';
import { CornerTypeParse } from './src/CornerType';
import { CorridorGraphicsParse } from './src/CorridorGraphics';
import { CylinderGraphicsParse } from './src/CylinderGraphics';
import { DistanceDisplayConditionParse } from './src/DistanceDisplayCondition';
import { EllipseGraphicsParse } from './src/EllipseGraphics';
import { EllipsoidGraphicsParse } from './src/EllipsoidGraphics';
import { EntityParse } from './src/Entity';
import { HeightReferenceParse } from './src/HeightReference';
import { HorizontalOriginParse } from './src/HorizontalOrigin';
import { JulianDateParse } from './src/JulianDate';
import { LabelGraphicsParse } from './src/LabelGraphics';
import { LabelStyleParse } from './src/LabelStyle';
import { MaterialPropertyParse } from './src/MaterialProperty';
import { Matrix4Parse } from './src/Matrix4';
import { ModelGraphicsParse } from './src/ModelGraphics';
import { NearFarScalarParse } from './src/NearFarScalar';
import { PathGraphicsParse } from './src/PathGraphics';
import { PlaneParse } from './src/Plane';
import { PlaneGraphicsParse } from './src/PlaneGraphics';
import { PointGraphicsParse } from './src/PointGraphics';
import { PolygonGraphicsParse } from './src/PolygonGraphics';
import { PolygonHierarchyParse } from './src/PolygonHierarchy';
import { PolylineGraphicsParse } from './src/PolylineGraphics';
import { PolylineVolumeGraphicsParse } from './src/PolylineVolumeGraphics';
import { PositionPropertyParse } from './src/PositionProperty';
import { PropertyBagParse } from './src/PropertyBag';
import { QuaternionParse } from './src/Quaternion';
import { RectangleParse } from './src/Rectangle';
import { RectangleGraphicsParse } from './src/RectangleGraphics';
import { ReferenceFrameParse } from './src/ReferenceFrame';
import { SampledPositionPropertyParse } from './src/SampledPositionProperty';
import { ShadowModeParse } from './src/ShadowMode';
import { SplitDirectionParse } from './src/SplitDirection';
import { TimeIntervalParse } from './src/TimeInterval';
import { TimeIntervalCollectionParse } from './src/TimeIntervalCollection';
import { VerticalOriginParse } from './src/VerticalOrigin';
import { WallGraphicsParse } from './src/WallGraphics';

export * from './src/ArcType';
export * from './src/BillboardGraphics';
export * from './src/BoundingRectangle';
export * from './src/BoxGraphics';
export * from './src/Cartesian2';
export * from './src/Cartesian3';
export * from './src/Cesium3DTilesetGraphics';
export * from './src/ClassificationType';
export * from './src/ClippingPlane';
export * from './src/ClippingPlaneCollection';
export * from './src/Color';
export * from './src/ColorBlendMode';
export * from './src/ConstantPositionProperty';
export * from './src/CornerType';
export * from './src/CorridorGraphics';
export * from './src/CylinderGraphics';
export * from './src/DistanceDisplayCondition';
export * from './src/EllipseGraphics';
export * from './src/EllipsoidGraphics';
export * from './src/Entity';
export * from './src/HeightReference';
export * from './src/HorizontalOrigin';
export * from './src/JulianDate';
export * from './src/LabelGraphics';
export * from './src/LabelStyle';
export * from './src/MaterialProperty';
export * from './src/Matrix4';
export * from './src/ModelGraphics';
export * from './src/NearFarScalar';
export * from './src/PathGraphics';
export * from './src/Plane';
export * from './src/PlaneGraphics';
export * from './src/PointGraphics';
export * from './src/PolygonGraphics';
export * from './src/PolygonHierarchy';
export * from './src/PolylineGraphics';
export * from './src/PolylineVolumeGraphics';
export * from './src/PositionProperty';
export * from './src/PropertyBag';
export * from './src/Quaternion';
export * from './src/Rectangle';
export * from './src/RectangleGraphics';
export * from './src/ReferenceFrame';
export * from './src/SampledPositionProperty';
export * from './src/ShadowMode';
export * from './src/SplitDirection';
export * from './src/TimeInterval';
export * from './src/TimeIntervalCollection';
export * from './src/VerticalOrigin';
export * from './src/WallGraphics';

/**
 * All serialization
 */
export const Parse = {
  ArcType: ArcTypeParse,
  BillboardGraphics: BillboardGraphicsParse,
  BoundingRectangle: BoundingRectangleParse,
  BoxGraphics: BoxGraphicsParse,
  Cartesian2: Cartesian2Parse,
  Cartesian3: Cartesian3Parse,
  Cesium3DTilesetGraphics: Cesium3DTilesetGraphicsParse,
  ClassificationType: ClassificationTypeParse,
  ClippingPlane: ClippingPlaneParse,
  ClippingPlaneCollection: ClippingPlaneCollectionParse,
  Color: ColorParse,
  ColorBlendMode: ColorBlendModeParse,
  ConstantPositionProperty: ConstantPositionPropertyParse,
  CornerType: CornerTypeParse,
  CorridorGraphics: CorridorGraphicsParse,
  CylinderGraphics: CylinderGraphicsParse,
  DistanceDisplayCondition: DistanceDisplayConditionParse,
  EllipseGraphics: EllipseGraphicsParse,
  EllipsoidGraphics: EllipsoidGraphicsParse,
  Entity: EntityParse,
  HeightReference: HeightReferenceParse,
  HorizontalOrigin: HorizontalOriginParse,
  JulianDate: JulianDateParse,
  LabelGraphics: LabelGraphicsParse,
  LabelStyle: LabelStyleParse,
  MaterialProperty: MaterialPropertyParse,
  Matrix4: Matrix4Parse,
  ModelGraphics: ModelGraphicsParse,
  NearFarScalar: NearFarScalarParse,
  PathGraphics: PathGraphicsParse,
  Plane: PlaneParse,
  PlaneGraphics: PlaneGraphicsParse,
  PointGraphics: PointGraphicsParse,
  PolygonGraphics: PolygonGraphicsParse,
  PolygonHierarchy: PolygonHierarchyParse,
  PolylineGraphics: PolylineGraphicsParse,
  PolylineVolumeGraphics: PolylineVolumeGraphicsParse,
  PositionProperty: PositionPropertyParse,
  PropertyBag: PropertyBagParse,
  Quaternion: QuaternionParse,
  Rectangle: RectangleParse,
  RectangleGraphics: RectangleGraphicsParse,
  ReferenceFrame: ReferenceFrameParse,
  SampledPositionProperty: SampledPositionPropertyParse,
  ShadowMode: ShadowModeParse,
  SplitDirection: SplitDirectionParse,
  TimeInterval: TimeIntervalParse,
  TimeIntervalCollection: TimeIntervalCollectionParse,
  VerticalOrigin: VerticalOriginParse,
  WallGraphics: WallGraphicsParse,
};
