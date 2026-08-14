---
subText: Cesium JSON Serialization
---

# Overview

`@vesium/parser` is Vesium's Cesium object serialization layer.

It provides a Zod-based approach for converting Cesium objects (such as Entity, Graphics, Property, etc.) between JavaScript instances and JSON format.

## Core Capabilities

### Serialization and Deserialization

Each Cesium type provides three functions:

- `{Type}ZodSchema()` - Returns a JSON structure Zod schema for validation
- `{Type}ToJSON(instance)` - Converts a Cesium instance to a JSON object
- `{Type}FromJSON(json)` - Restores a JSON object back to a Cesium instance

### Supported Types

#### Basic Types

| Export                     | Description                |
| -------------------------- | -------------------------- |
| `Cartesian2`               | 2D coordinates             |
| `Cartesian3`               | 3D coordinates             |
| `Color`                    | Color                      |
| `Matrix4`                  | 4x4 transformation matrix  |
| `Quaternion`               | Quaternion                 |
| `Rectangle`                | Rectangle bounds           |
| `JulianDate`               | Julian date                |
| `TimeInterval`             | Time interval              |
| `TimeIntervalCollection`   | Time interval collection   |
| `Plane`                    | Plane                      |
| `DistanceDisplayCondition` | Distance display condition |
| `NearFarScalar`            | Near-far scalar            |
| `BoundingRectangle`        | Bounding rectangle         |

#### Graphics Types

| Export                    | Description              |
| ------------------------- | ------------------------ |
| `BillboardGraphics`       | Billboard graphics       |
| `BoxGraphics`             | Box graphics             |
| `CorridorGraphics`        | Corridor graphics        |
| `CylinderGraphics`        | Cylinder graphics        |
| `EllipseGraphics`         | Ellipse graphics         |
| `EllipsoidGraphics`       | Ellipsoid graphics       |
| `LabelGraphics`           | Label graphics           |
| `ModelGraphics`           | Model graphics           |
| `PathGraphics`            | Path graphics            |
| `PlaneGraphics`           | Plane graphics           |
| `PointGraphics`           | Point graphics           |
| `PolygonGraphics`         | Polygon graphics         |
| `PolylineGraphics`        | Polyline graphics        |
| `PolylineVolumeGraphics`  | Polyline volume graphics |
| `RectangleGraphics`       | Rectangle graphics       |
| `WallGraphics`            | Wall graphics            |
| `Cesium3DTilesetGraphics` | 3DTileset graphics       |

#### Entity and Properties

| Export                     | Description                |
| -------------------------- | -------------------------- |
| `Entity`                   | Entity serialization       |
| `PositionProperty`         | Position property          |
| `ConstantPositionProperty` | Constant position property |
| `SampledPositionProperty`  | Sampled position property  |
| `PropertyBag`              | Property bag               |
| `MaterialProperty`         | Material property          |

#### Enum Types

| Export               | Description         |
| -------------------- | ------------------- |
| `ArcType`            | Arc type            |
| `ClassificationType` | Classification type |
| `ColorBlendMode`     | Color blend mode    |
| `CornerType`         | Corner type         |
| `HeightReference`    | Height reference    |
| `HorizontalOrigin`   | Horizontal origin   |
| `LabelStyle`         | Label style         |
| `ReferenceFrame`     | Reference frame     |
| `ShadowMode`         | Shadow mode         |
| `SplitDirection`     | Split direction     |
| `VerticalOrigin`     | Vertical origin     |

#### Secondary Types

| Export                                    | Description                            |
| ----------------------------------------- | -------------------------------------- |
| `Ellipsoid`                               | Ellipsoid                              |
| `TilingScheme`                            | Tiling scheme (Geographic/WebMercator) |
| `Clock`                                   | Clock (for time-dynamic layers)        |
| `ClippingPlane`/`ClippingPlaneCollection` | Clipping planes                        |

#### ImageryProviders

| Export                             | Description                        |
| ---------------------------------- | ---------------------------------- |
| `UrlTemplateImageryProvider`       | URL template imagery               |
| `WebMapServiceImageryProvider`     | WMS imagery                        |
| `WebMapTileServiceImageryProvider` | WMTS imagery                       |
| `ArcGisMapServerImageryProvider`   | ArcGIS imagery                     |
| `TileMapServiceImageryProvider`    | TMS imagery                        |
| `SingleTileImageryProvider`        | Single tile imagery                |
| `GridImageryProvider`              | Grid (debug) imagery               |
| `IonImageryProvider`               | Cesium ion imagery (assetId level) |

> Note: `IonImageryProvider` instances are created asynchronously via `IonImageryProvider.fromAssetId` and do not retain their `assetId`, so serialization works on the constructor source (`assetId` + `accessToken` + `server`) with `IonImageryProviderToJSON`, and `IonImageryProviderFromJSON` is async.

#### TerrainProviders

| Export                                | Description       |
| ------------------------------------- | ----------------- |
| `CesiumTerrainProvider`               | Cesium terrain    |
| `EllipsoidTerrainProvider`            | Ellipsoid terrain |
| `ArcGISTiledElevationTerrainProvider` | ArcGIS elevation  |

> Note: `CesiumTerrainProvider`, `ArcGISTiledElevationTerrainProvider`, `TileMapServiceImageryProvider` and `ArcGisMapServerImageryProvider` are created asynchronously via `fromUrl` and do not retain their `url` (or their constructor options do not accept one), so serialization works on the constructor source and their `FromJSON` functions are async. Prefer the unified `ImageryProviderFromJSON` / `TerrainProviderFromJSON` entry points, which dispatch automatically and always return a Promise, hiding the sync/async difference.

## Usage

```ts
import { EntityFromJSON, EntityToJSON } from '@vesium/parser';

// Entity to JSON
const entityJSON = EntityToJSON(myEntity);

// JSON to Entity
const entity = EntityFromJSON(entityJSON);
```

## Type Definitions

:::dts ./index.ts
:::
