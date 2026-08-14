---
subText: Cesium JSON Serialization
---

# Overview

`@vesium/parser` is Vesium's Cesium object serialization layer.

It provides a Zod-based approach for converting Cesium objects (such as Entity, Graphics, Property, etc.) between JavaScript instances and JSON format.

## Core Capabilities

### Serialization and Deserialization

Each Cesium type exports three companion functions:

- `{Type}ToJSON(instance)` - Converts a Cesium instance to a JSON object
- `{Type}FromJSON(json)` - Restores a JSON object back to a Cesium instance
- `{Type}ZodSchema()` - Returns a JSON structure Zod schema for validation

Serialized JSON always follows the `{ parser: 'TypeName', value: { ... } }` shape: `parser` identifies the type and `value` holds its fields. Take `Cartesian3` as an example:

```ts
import { Cartesian3FromJSON, Cartesian3ToJSON } from '@vesium/parser';
import { Cartesian3 } from 'cesium';

// instance → JSON
const json = Cartesian3ToJSON(new Cartesian3(1, 2, 3));
// => { parser: 'Cartesian3', value: { x: 1, y: 2, z: 3 } }

// JSON → instance
const point = Cartesian3FromJSON(json);
// => Cartesian3 { x: 1, y: 2, z: 3 }
```

Every type listed below exports its functions following the `{Type}ToJSON` / `{Type}FromJSON` naming convention.

### Supported Types

#### Basic Types

| Export Functions                                                                                              | Description                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `Cartesian2ToJSON`<br>`Cartesian2FromJSON`<br>`Cartesian2ZodSchema`                                           | 2D coordinates             |
| `Cartesian3ToJSON`<br>`Cartesian3FromJSON`<br>`Cartesian3ZodSchema`                                           | 3D coordinates             |
| `ColorToJSON`<br>`ColorFromJSON`<br>`ColorZodSchema`                                                          | Color                      |
| `Matrix4ToJSON`<br>`Matrix4FromJSON`<br>`Matrix4ZodSchema`                                                    | 4x4 transformation matrix  |
| `QuaternionToJSON`<br>`QuaternionFromJSON`<br>`QuaternionZodSchema`                                           | Quaternion                 |
| `RectangleToJSON`<br>`RectangleFromJSON`<br>`RectangleZodSchema`                                              | Rectangle bounds           |
| `JulianDateToJSON`<br>`JulianDateFromJSON`<br>`JulianDateZodSchema`                                           | Julian date                |
| `TimeIntervalToJSON`<br>`TimeIntervalFromJSON`<br>`TimeIntervalZodSchema`                                     | Time interval              |
| `TimeIntervalCollectionToJSON`<br>`TimeIntervalCollectionFromJSON`<br>`TimeIntervalCollectionZodSchema`       | Time interval collection   |
| `PlaneToJSON`<br>`PlaneFromJSON`<br>`PlaneZodSchema`                                                          | Plane                      |
| `DistanceDisplayConditionToJSON`<br>`DistanceDisplayConditionFromJSON`<br>`DistanceDisplayConditionZodSchema` | Distance display condition |
| `NearFarScalarToJSON`<br>`NearFarScalarFromJSON`<br>`NearFarScalarZodSchema`                                  | Near-far scalar            |
| `BoundingRectangleToJSON`<br>`BoundingRectangleFromJSON`<br>`BoundingRectangleZodSchema`                      | Bounding rectangle         |
| `PolygonHierarchyToJSON`<br>`PolygonHierarchyFromJSON`<br>`PolygonHierarchyZodSchema`                         | Polygon hierarchy          |

#### Graphics Types

| Export Functions                                                                                           | Description              |
| ---------------------------------------------------------------------------------------------------------- | ------------------------ |
| `BillboardGraphicsToJSON`<br>`BillboardGraphicsFromJSON`<br>`BillboardGraphicsZodSchema`                   | Billboard graphics       |
| `BoxGraphicsToJSON`<br>`BoxGraphicsFromJSON`<br>`BoxGraphicsZodSchema`                                     | Box graphics             |
| `CorridorGraphicsToJSON`<br>`CorridorGraphicsFromJSON`<br>`CorridorGraphicsZodSchema`                      | Corridor graphics        |
| `CylinderGraphicsToJSON`<br>`CylinderGraphicsFromJSON`<br>`CylinderGraphicsZodSchema`                      | Cylinder graphics        |
| `EllipseGraphicsToJSON`<br>`EllipseGraphicsFromJSON`<br>`EllipseGraphicsZodSchema`                         | Ellipse graphics         |
| `EllipsoidGraphicsToJSON`<br>`EllipsoidGraphicsFromJSON`<br>`EllipsoidGraphicsZodSchema`                   | Ellipsoid graphics       |
| `LabelGraphicsToJSON`<br>`LabelGraphicsFromJSON`<br>`LabelGraphicsZodSchema`                               | Label graphics           |
| `ModelGraphicsToJSON`<br>`ModelGraphicsFromJSON`<br>`ModelGraphicsZodSchema`                               | Model graphics           |
| `PathGraphicsToJSON`<br>`PathGraphicsFromJSON`<br>`PathGraphicsZodSchema`                                  | Path graphics            |
| `PlaneGraphicsToJSON`<br>`PlaneGraphicsFromJSON`<br>`PlaneGraphicsZodSchema`                               | Plane graphics           |
| `PointGraphicsToJSON`<br>`PointGraphicsFromJSON`<br>`PointGraphicsZodSchema`                               | Point graphics           |
| `PolygonGraphicsToJSON`<br>`PolygonGraphicsFromJSON`<br>`PolygonGraphicsZodSchema`                         | Polygon graphics         |
| `PolylineGraphicsToJSON`<br>`PolylineGraphicsFromJSON`<br>`PolylineGraphicsZodSchema`                      | Polyline graphics        |
| `PolylineVolumeGraphicsToJSON`<br>`PolylineVolumeGraphicsFromJSON`<br>`PolylineVolumeGraphicsZodSchema`    | Polyline volume graphics |
| `RectangleGraphicsToJSON`<br>`RectangleGraphicsFromJSON`<br>`RectangleGraphicsZodSchema`                   | Rectangle graphics       |
| `WallGraphicsToJSON`<br>`WallGraphicsFromJSON`<br>`WallGraphicsZodSchema`                                  | Wall graphics            |
| `Cesium3DTilesetGraphicsToJSON`<br>`Cesium3DTilesetGraphicsFromJSON`<br>`Cesium3DTilesetGraphicsZodSchema` | 3DTileset graphics       |

#### Entity and Properties

| Export Functions                                                                                              | Description                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `EntityToJSON`<br>`EntityFromJSON`<br>`EntityZodSchema`                                                       | Entity serialization       |
| `PositionPropertyToJSON`<br>`PositionPropertyFromJSON`<br>`PositionPropertyZodSchema`                         | Position property          |
| `ConstantPositionPropertyToJSON`<br>`ConstantPositionPropertyFromJSON`<br>`ConstantPositionPropertyZodSchema` | Constant position property |
| `SampledPositionPropertyToJSON`<br>`SampledPositionPropertyFromJSON`<br>`SampledPositionPropertyZodSchema`    | Sampled position property  |
| `PropertyBagToJSON`<br>`PropertyBagFromJSON`<br>`PropertyBagZodSchema`                                        | Property bag               |
| `MaterialPropertyToJSON`<br>`MaterialPropertyFromJSON`<br>`MaterialPropertyZodSchema`                         | Material property          |

#### Enum Types

| Export Functions                                                                            | Description         |
| ------------------------------------------------------------------------------------------- | ------------------- |
| `ArcTypeToJSON`<br>`ArcTypeFromJSON`<br>`ArcTypeZodSchema`                                  | Arc type            |
| `ClassificationTypeToJSON`<br>`ClassificationTypeFromJSON`<br>`ClassificationTypeZodSchema` | Classification type |
| `ColorBlendModeToJSON`<br>`ColorBlendModeFromJSON`<br>`ColorBlendModeZodSchema`             | Color blend mode    |
| `CornerTypeToJSON`<br>`CornerTypeFromJSON`<br>`CornerTypeZodSchema`                         | Corner type         |
| `HeightReferenceToJSON`<br>`HeightReferenceFromJSON`<br>`HeightReferenceZodSchema`          | Height reference    |
| `HorizontalOriginToJSON`<br>`HorizontalOriginFromJSON`<br>`HorizontalOriginZodSchema`       | Horizontal origin   |
| `LabelStyleToJSON`<br>`LabelStyleFromJSON`<br>`LabelStyleZodSchema`                         | Label style         |
| `ReferenceFrameToJSON`<br>`ReferenceFrameFromJSON`<br>`ReferenceFrameZodSchema`             | Reference frame     |
| `ShadowModeToJSON`<br>`ShadowModeFromJSON`<br>`ShadowModeZodSchema`                         | Shadow mode         |
| `SplitDirectionToJSON`<br>`SplitDirectionFromJSON`<br>`SplitDirectionZodSchema`             | Split direction     |
| `VerticalOriginToJSON`<br>`VerticalOriginFromJSON`<br>`VerticalOriginZodSchema`             | Vertical origin     |

#### Secondary Types

| Export Functions                                                                                           | Description                            |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `EllipsoidToJSON`<br>`EllipsoidFromJSON`<br>`EllipsoidZodSchema`                                           | Ellipsoid                              |
| `TilingSchemeToJSON`<br>`TilingSchemeFromJSON`<br>`TilingSchemeZodSchema`                                  | Tiling scheme (Geographic/WebMercator) |
| `ClockToJSON`<br>`ClockFromJSON`<br>`ClockZodSchema`                                                       | Clock (for time-dynamic layers)        |
| `ClippingPlaneToJSON`<br>`ClippingPlaneFromJSON`<br>`ClippingPlaneZodSchema`                               | Clipping plane                         |
| `ClippingPlaneCollectionToJSON`<br>`ClippingPlaneCollectionFromJSON`<br>`ClippingPlaneCollectionZodSchema` | Clipping plane collection              |

#### ImageryProviders

Besides the per-provider functions, unified entries are provided: `ImageryProviderToJSON` dispatches by instance type (instanceof), while `ImageryProviderFromJSON` dispatches by the JSON `parser` field.

| Export Functions                                                                                                                        | Description                        |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `UrlTemplateImageryProviderToJSON`<br>`UrlTemplateImageryProviderFromJSON`<br>`UrlTemplateImageryProviderZodSchema`                     | URL template imagery               |
| `WebMapServiceImageryProviderToJSON`<br>`WebMapServiceImageryProviderFromJSON`<br>`WebMapServiceImageryProviderZodSchema`               | WMS imagery                        |
| `WebMapTileServiceImageryProviderToJSON`<br>`WebMapTileServiceImageryProviderFromJSON`<br>`WebMapTileServiceImageryProviderZodSchema`   | WMTS imagery                       |
| `ArcGisMapServerImageryProviderToJSON`<br>`ArcGisMapServerImageryProviderFromJSON` (async)<br>`ArcGisMapServerImageryProviderZodSchema` | ArcGIS imagery                     |
| `TileMapServiceImageryProviderToJSON`<br>`TileMapServiceImageryProviderFromJSON` (async)<br>`TileMapServiceImageryProviderZodSchema`    | TMS imagery                        |
| `SingleTileImageryProviderToJSON`<br>`SingleTileImageryProviderFromJSON`<br>`SingleTileImageryProviderZodSchema`                        | Single tile imagery                |
| `GridImageryProviderToJSON`<br>`GridImageryProviderFromJSON`<br>`GridImageryProviderZodSchema`                                          | Grid (debug) imagery               |
| `IonImageryProviderToJSON`<br>`IonImageryProviderFromJSON` (async)<br>`IonImageryProviderZodSchema`                                     | Cesium ion imagery (assetId level) |

> Note: `IonImageryProvider` instances are created asynchronously via `IonImageryProvider.fromAssetId` and do not retain their `assetId`, so serialization works on the constructor source (`assetId` + `accessToken` + `server`) with `IonImageryProviderToJSON`, and `IonImageryProviderFromJSON` is async.

#### TerrainProviders

Terrain provider instances are created asynchronously via `fromUrl` and do not retain their `url`, so `CesiumTerrainProviderToJSON` / `ArcGISTiledElevationTerrainProviderToJSON` take a `{ url, ... }` source object instead of an instance. The unified `TerrainProviderFromJSON` dispatches via the `parser` field and always returns a Promise, hiding the sync/async difference.

| Export Functions                                                                                                                                                | Description       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `CesiumTerrainProviderToJSON` (source)<br>`CesiumTerrainProviderFromJSON` (async)<br>`CesiumTerrainProviderZodSchema`                                           | Cesium terrain    |
| `EllipsoidTerrainProviderToJSON`<br>`EllipsoidTerrainProviderFromJSON`<br>`EllipsoidTerrainProviderZodSchema`                                                   | Ellipsoid terrain |
| `ArcGISTiledElevationTerrainProviderToJSON` (source)<br>`ArcGISTiledElevationTerrainProviderFromJSON` (async)<br>`ArcGISTiledElevationTerrainProviderZodSchema` | ArcGIS elevation  |

## Usage

```ts
import { EntityFromJSON, EntityToJSON } from '@vesium/parser';

// Entity to JSON
const entityJSON = EntityToJSON(myEntity);

// JSON to Entity
const entity = EntityFromJSON(entityJSON);
```
