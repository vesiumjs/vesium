---
subText: Cesium JSON 序列化
---

# Overview

`@vesium/parser` 是 Vesium 的 Cesium 对象序列化层。

它提供了一套基于 Zod 的方案，用于将 Cesium 对象（如 Entity、Graphics、Property 等）在 JavaScript 实例和 JSON 格式之间互相转换。

## 核心能力

### 序列化与反序列化

每个 Cesium 类型都导出三个配套函数：

- `{Type}ToJSON(instance)` - 将 Cesium 实例转为 JSON 对象
- `{Type}FromJSON(json)` - 将 JSON 对象还原为 Cesium 实例
- `{Type}ZodSchema()` - 返回该类型的 JSON 结构 Zod schema，用于校验

序列化后的 JSON 统一为 `{ parser: '类型名', value: { ... } }` 结构：`parser` 标识类型，`value` 存放该类型的字段。以 `Cartesian3` 为例：

```ts
import { Cartesian3FromJSON, Cartesian3ToJSON } from '@vesium/parser';
import { Cartesian3 } from 'cesium';

// 实例 → JSON
const json = Cartesian3ToJSON(new Cartesian3(1, 2, 3));
// => { parser: 'Cartesian3', value: { x: 1, y: 2, z: 3 } }

// JSON → 实例
const point = Cartesian3FromJSON(json);
// => Cartesian3 { x: 1, y: 2, z: 3 }
```

下表列出的每个类型都按 `{Type}ToJSON` / `{Type}FromJSON` 的命名规则导出对应函数。

### 支持的类型

#### 基础类型

| 导出函数                                                                                                      | 作用         |
| ------------------------------------------------------------------------------------------------------------- | ------------ |
| `Cartesian2ToJSON`<br>`Cartesian2FromJSON`<br>`Cartesian2ZodSchema`                                           | 二维坐标     |
| `Cartesian3ToJSON`<br>`Cartesian3FromJSON`<br>`Cartesian3ZodSchema`                                           | 三维坐标     |
| `ColorToJSON`<br>`ColorFromJSON`<br>`ColorZodSchema`                                                          | 颜色         |
| `Matrix4ToJSON`<br>`Matrix4FromJSON`<br>`Matrix4ZodSchema`                                                    | 4x4 变换矩阵 |
| `QuaternionToJSON`<br>`QuaternionFromJSON`<br>`QuaternionZodSchema`                                           | 四元数       |
| `RectangleToJSON`<br>`RectangleFromJSON`<br>`RectangleZodSchema`                                              | 矩形范围     |
| `JulianDateToJSON`<br>`JulianDateFromJSON`<br>`JulianDateZodSchema`                                           | 儒略日期     |
| `TimeIntervalToJSON`<br>`TimeIntervalFromJSON`<br>`TimeIntervalZodSchema`                                     | 时间区间     |
| `TimeIntervalCollectionToJSON`<br>`TimeIntervalCollectionFromJSON`<br>`TimeIntervalCollectionZodSchema`       | 时间区间集合 |
| `PlaneToJSON`<br>`PlaneFromJSON`<br>`PlaneZodSchema`                                                          | 平面         |
| `DistanceDisplayConditionToJSON`<br>`DistanceDisplayConditionFromJSON`<br>`DistanceDisplayConditionZodSchema` | 距离显示条件 |
| `NearFarScalarToJSON`<br>`NearFarScalarFromJSON`<br>`NearFarScalarZodSchema`                                  | 近远值标量   |
| `BoundingRectangleToJSON`<br>`BoundingRectangleFromJSON`<br>`BoundingRectangleZodSchema`                      | 边界矩形     |
| `PolygonHierarchyToJSON`<br>`PolygonHierarchyFromJSON`<br>`PolygonHierarchyZodSchema`                         | 多边形层级   |

#### Graphics 类型

| 导出函数                                                                                                   | 作用           |
| ---------------------------------------------------------------------------------------------------------- | -------------- |
| `BillboardGraphicsToJSON`<br>`BillboardGraphicsFromJSON`<br>`BillboardGraphicsZodSchema`                   | Billboard 图形 |
| `BoxGraphicsToJSON`<br>`BoxGraphicsFromJSON`<br>`BoxGraphicsZodSchema`                                     | 盒子图形       |
| `CorridorGraphicsToJSON`<br>`CorridorGraphicsFromJSON`<br>`CorridorGraphicsZodSchema`                      | 走廊图形       |
| `CylinderGraphicsToJSON`<br>`CylinderGraphicsFromJSON`<br>`CylinderGraphicsZodSchema`                      | 圆柱图形       |
| `EllipseGraphicsToJSON`<br>`EllipseGraphicsFromJSON`<br>`EllipseGraphicsZodSchema`                         | 椭圆图形       |
| `EllipsoidGraphicsToJSON`<br>`EllipsoidGraphicsFromJSON`<br>`EllipsoidGraphicsZodSchema`                   | 椭球图形       |
| `LabelGraphicsToJSON`<br>`LabelGraphicsFromJSON`<br>`LabelGraphicsZodSchema`                               | 标签图形       |
| `ModelGraphicsToJSON`<br>`ModelGraphicsFromJSON`<br>`ModelGraphicsZodSchema`                               | 模型图形       |
| `PathGraphicsToJSON`<br>`PathGraphicsFromJSON`<br>`PathGraphicsZodSchema`                                  | 路径图形       |
| `PlaneGraphicsToJSON`<br>`PlaneGraphicsFromJSON`<br>`PlaneGraphicsZodSchema`                               | 平面图形       |
| `PointGraphicsToJSON`<br>`PointGraphicsFromJSON`<br>`PointGraphicsZodSchema`                               | 点图形         |
| `PolygonGraphicsToJSON`<br>`PolygonGraphicsFromJSON`<br>`PolygonGraphicsZodSchema`                         | 多边形图形     |
| `PolylineGraphicsToJSON`<br>`PolylineGraphicsFromJSON`<br>`PolylineGraphicsZodSchema`                      | 折线图形       |
| `PolylineVolumeGraphicsToJSON`<br>`PolylineVolumeGraphicsFromJSON`<br>`PolylineVolumeGraphicsZodSchema`    | 折线体图形     |
| `RectangleGraphicsToJSON`<br>`RectangleGraphicsFromJSON`<br>`RectangleGraphicsZodSchema`                   | 矩形图形       |
| `WallGraphicsToJSON`<br>`WallGraphicsFromJSON`<br>`WallGraphicsZodSchema`                                  | 墙体图形       |
| `Cesium3DTilesetGraphicsToJSON`<br>`Cesium3DTilesetGraphicsFromJSON`<br>`Cesium3DTilesetGraphicsZodSchema` | 3DTileset 图形 |

#### Entity 与属性

| 导出函数                                                                                                      | 作用         |
| ------------------------------------------------------------------------------------------------------------- | ------------ |
| `EntityToJSON`<br>`EntityFromJSON`<br>`EntityZodSchema`                                                       | 实体序列化   |
| `PositionPropertyToJSON`<br>`PositionPropertyFromJSON`<br>`PositionPropertyZodSchema`                         | 位置属性     |
| `ConstantPositionPropertyToJSON`<br>`ConstantPositionPropertyFromJSON`<br>`ConstantPositionPropertyZodSchema` | 常量位置属性 |
| `SampledPositionPropertyToJSON`<br>`SampledPositionPropertyFromJSON`<br>`SampledPositionPropertyZodSchema`    | 采样位置属性 |
| `PropertyBagToJSON`<br>`PropertyBagFromJSON`<br>`PropertyBagZodSchema`                                        | 属性包       |
| `MaterialPropertyToJSON`<br>`MaterialPropertyFromJSON`<br>`MaterialPropertyZodSchema`                         | 材质属性     |

#### 枚举类型

| 导出函数                                                                                    | 作用         |
| ------------------------------------------------------------------------------------------- | ------------ |
| `ArcTypeToJSON`<br>`ArcTypeFromJSON`<br>`ArcTypeZodSchema`                                  | 弧线类型     |
| `ClassificationTypeToJSON`<br>`ClassificationTypeFromJSON`<br>`ClassificationTypeZodSchema` | 分类类型     |
| `ColorBlendModeToJSON`<br>`ColorBlendModeFromJSON`<br>`ColorBlendModeZodSchema`             | 颜色混合模式 |
| `CornerTypeToJSON`<br>`CornerTypeFromJSON`<br>`CornerTypeZodSchema`                         | 角类型       |
| `HeightReferenceToJSON`<br>`HeightReferenceFromJSON`<br>`HeightReferenceZodSchema`          | 高度参考     |
| `HorizontalOriginToJSON`<br>`HorizontalOriginFromJSON`<br>`HorizontalOriginZodSchema`       | 水平原点     |
| `LabelStyleToJSON`<br>`LabelStyleFromJSON`<br>`LabelStyleZodSchema`                         | 标签样式     |
| `ReferenceFrameToJSON`<br>`ReferenceFrameFromJSON`<br>`ReferenceFrameZodSchema`             | 参考帧       |
| `ShadowModeToJSON`<br>`ShadowModeFromJSON`<br>`ShadowModeZodSchema`                         | 阴影模式     |
| `SplitDirectionToJSON`<br>`SplitDirectionFromJSON`<br>`SplitDirectionZodSchema`             | 分割方向     |
| `VerticalOriginToJSON`<br>`VerticalOriginFromJSON`<br>`VerticalOriginZodSchema`             | 垂直原点     |

#### 二级辅助类型

| 导出函数                                                                                                   | 作用                     |
| ---------------------------------------------------------------------------------------------------------- | ------------------------ |
| `EllipsoidToJSON`<br>`EllipsoidFromJSON`<br>`EllipsoidZodSchema`                                           | 椭球体                   |
| `TilingSchemeToJSON`<br>`TilingSchemeFromJSON`<br>`TilingSchemeZodSchema`                                  | 瓦片方案（地理/墨卡托）  |
| `ClockToJSON`<br>`ClockFromJSON`<br>`ClockZodSchema`                                                       | 时钟（用于时间动态图层） |
| `ClippingPlaneToJSON`<br>`ClippingPlaneFromJSON`<br>`ClippingPlaneZodSchema`                               | 裁剪平面                 |
| `ClippingPlaneCollectionToJSON`<br>`ClippingPlaneCollectionFromJSON`<br>`ClippingPlaneCollectionZodSchema` | 裁剪平面集合             |

#### ImageryProvider（影像图层）

除各 Provider 自己的函数外，还提供统一入口：`ImageryProviderToJSON` 按实例类型（instanceof）分发，`ImageryProviderFromJSON` 按 JSON 的 `parser` 字段分发。

| 导出函数                                                                                                                                | 作用                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `UrlTemplateImageryProviderToJSON`<br>`UrlTemplateImageryProviderFromJSON`<br>`UrlTemplateImageryProviderZodSchema`                     | URL 模板影像                  |
| `WebMapServiceImageryProviderToJSON`<br>`WebMapServiceImageryProviderFromJSON`<br>`WebMapServiceImageryProviderZodSchema`               | WMS 影像                      |
| `WebMapTileServiceImageryProviderToJSON`<br>`WebMapTileServiceImageryProviderFromJSON`<br>`WebMapTileServiceImageryProviderZodSchema`   | WMTS 影像                     |
| `ArcGisMapServerImageryProviderToJSON`<br>`ArcGisMapServerImageryProviderFromJSON`（异步）<br>`ArcGisMapServerImageryProviderZodSchema` | ArcGIS 影像                   |
| `TileMapServiceImageryProviderToJSON`<br>`TileMapServiceImageryProviderFromJSON`（异步）<br>`TileMapServiceImageryProviderZodSchema`    | TMS 影像                      |
| `SingleTileImageryProviderToJSON`<br>`SingleTileImageryProviderFromJSON`<br>`SingleTileImageryProviderZodSchema`                        | 单张影像                      |
| `GridImageryProviderToJSON`<br>`GridImageryProviderFromJSON`<br>`GridImageryProviderZodSchema`                                          | 网格（调试）影像              |
| `IonImageryProviderToJSON`<br>`IonImageryProviderFromJSON`（异步）<br>`IonImageryProviderZodSchema`                                     | Cesium ion 影像（assetId 级） |

> 注意：`IonImageryProvider` 的实例由异步的 `IonImageryProvider.fromAssetId` 创建且不保留 `assetId`，因此其序列化基于「assetId + accessToken + server」构造参数（`IonImageryProviderToJSON`），`IonImageryProviderFromJSON` 为异步函数。

#### TerrainProvider（地形）

地形 Provider 的实例由异步的 `fromUrl` 创建且不保留 `url`，因此 `CesiumTerrainProviderToJSON` / `ArcGISTiledElevationTerrainProviderToJSON` 接收 `{ url, ... }` 源对象而非实例。统一入口 `TerrainProviderFromJSON` 由 `parser` 字段自动分发且始终返回 Promise，无需关心单个 Provider 的同步/异步差异。

| 导出函数                                                                                                                                                         | 作用            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `CesiumTerrainProviderToJSON`（源对象）<br>`CesiumTerrainProviderFromJSON`（异步）<br>`CesiumTerrainProviderZodSchema`                                           | Cesium 地形     |
| `EllipsoidTerrainProviderToJSON`<br>`EllipsoidTerrainProviderFromJSON`<br>`EllipsoidTerrainProviderZodSchema`                                                    | 椭球面地形      |
| `ArcGISTiledElevationTerrainProviderToJSON`（源对象）<br>`ArcGISTiledElevationTerrainProviderFromJSON`（异步）<br>`ArcGISTiledElevationTerrainProviderZodSchema` | ArcGIS 高程地形 |

## 用法

```ts
import { EntityFromJSON, EntityToJSON } from '@vesium/parser';

// Entity 转 JSON
const entityJSON = EntityToJSON(myEntity);

// JSON 还原 Entity
const entity = EntityFromJSON(entityJSON);
```
