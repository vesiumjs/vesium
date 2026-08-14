---
subText: Cesium JSON 序列化
---

# Overview

`@vesium/parser` 是 Vesium 的 Cesium 对象序列化层。

它提供了一套基于 Zod 的方案，用于将 Cesium 对象（如 Entity、Graphics、Property 等）在 JavaScript 实例和 JSON 格式之间互相转换。

## 核心能力

### 序列化与反序列化

每个 Cesium 类型都提供三个函数：

- `{Type}ZodSchema()` - 返回该类型的 JSON 结构 Zod schema，用于校验
- `{Type}ToJSON(instance)` - 将 Cesium 实例转为 JSON 对象
- `{Type}FromJSON(json)` - 将 JSON 对象还原为 Cesium 实例

### 支持的类型

#### 基础类型

| 导出                       | 作用         |
| -------------------------- | ------------ |
| `Cartesian2`               | 二维坐标     |
| `Cartesian3`               | 三维坐标     |
| `Color`                    | 颜色         |
| `Matrix4`                  | 4x4 变换矩阵 |
| `Quaternion`               | 四元数       |
| `Rectangle`                | 矩形范围     |
| `JulianDate`               | 儒略日期     |
| `TimeInterval`             | 时间区间     |
| `TimeIntervalCollection`   | 时间区间集合 |
| `Plane`                    | 平面         |
| `DistanceDisplayCondition` | 距离显示条件 |
| `NearFarScalar`            | 近远值标量   |
| `BoundingRectangle`        | 边界矩形     |

#### Graphics 类型

| 导出                      | 作用           |
| ------------------------- | -------------- |
| `BillboardGraphics`       | Billboard 图形 |
| `BoxGraphics`             | 盒子图形       |
| `CorridorGraphics`        | 走廊图形       |
| `CylinderGraphics`        | 圆柱图形       |
| `EllipseGraphics`         | 椭圆图形       |
| `EllipsoidGraphics`       | 椭球图形       |
| `LabelGraphics`           | 标签图形       |
| `ModelGraphics`           | 模型图形       |
| `PathGraphics`            | 路径图形       |
| `PlaneGraphics`           | 平面图形       |
| `PointGraphics`           | 点图形         |
| `PolygonGraphics`         | 多边形图形     |
| `PolylineGraphics`        | 折线图形       |
| `PolylineVolumeGraphics`  | 折线体图形     |
| `RectangleGraphics`       | 矩形图形       |
| `WallGraphics`            | 墙体图形       |
| `Cesium3DTilesetGraphics` | 3DTileset 图形 |

#### Entity 与属性

| 导出                       | 作用         |
| -------------------------- | ------------ |
| `Entity`                   | 实体序列化   |
| `PositionProperty`         | 位置属性     |
| `ConstantPositionProperty` | 常量位置属性 |
| `SampledPositionProperty`  | 采样位置属性 |
| `PropertyBag`              | 属性包       |
| `MaterialProperty`         | 材质属性     |

#### 枚举类型

| 导出                 | 作用         |
| -------------------- | ------------ |
| `ArcType`            | 弧线类型     |
| `ClassificationType` | 分类类型     |
| `ColorBlendMode`     | 颜色混合模式 |
| `CornerType`         | 角类型       |
| `HeightReference`    | 高度参考     |
| `HorizontalOrigin`   | 水平原点     |
| `LabelStyle`         | 标签样式     |
| `ReferenceFrame`     | 参考帧       |
| `ShadowMode`         | 阴影模式     |
| `SplitDirection`     | 分割方向     |
| `VerticalOrigin`     | 垂直原点     |

#### 二级辅助类型

| 导出                                      | 作用                     |
| ----------------------------------------- | ------------------------ |
| `Ellipsoid`                               | 椭球体                   |
| `TilingScheme`                            | 瓦片方案（地理/墨卡托）  |
| `Clock`                                   | 时钟（用于时间动态图层） |
| `ClippingPlane`/`ClippingPlaneCollection` | 裁剪平面                 |

#### ImageryProvider（影像图层）

| 导出                               | 作用                          |
| ---------------------------------- | ----------------------------- |
| `UrlTemplateImageryProvider`       | URL 模板影像                  |
| `WebMapServiceImageryProvider`     | WMS 影像                      |
| `WebMapTileServiceImageryProvider` | WMTS 影像                     |
| `ArcGisMapServerImageryProvider`   | ArcGIS 影像                   |
| `TileMapServiceImageryProvider`    | TMS 影像                      |
| `SingleTileImageryProvider`        | 单张影像                      |
| `GridImageryProvider`              | 网格（调试）影像              |
| `IonImageryProvider`               | Cesium ion 影像（assetId 级） |

> 注意：`IonImageryProvider` 的实例由异步的 `IonImageryProvider.fromAssetId` 创建且不保留 `assetId`，因此其序列化基于「assetId + accessToken + server」构造参数（`IonImageryProviderToJSON`），`IonImageryProviderFromJSON` 为异步函数。

#### TerrainProvider（地形）

| 导出                                  | 作用            |
| ------------------------------------- | --------------- |
| `CesiumTerrainProvider`               | Cesium 地形     |
| `EllipsoidTerrainProvider`            | 椭球面地形      |
| `ArcGISTiledElevationTerrainProvider` | ArcGIS 高程地形 |

> 注意：`CesiumTerrainProvider`、`ArcGISTiledElevationTerrainProvider`、`TileMapServiceImageryProvider`、`ArcGisMapServerImageryProvider` 的实例由异步的 `fromUrl` 创建且不保留 `url`（或构造选项不接收 `url`），因此它们的序列化基于构造参数，`FromJSON` 为异步函数。推荐统一使用 `ImageryProviderFromJSON` / `TerrainProviderFromJSON` 入口，内部自动分发且统一返回 Promise，无需关心单个 Provider 的同步/异步差异。

## 用法

```ts
import { EntityFromJSON, EntityToJSON } from '@vesium/parser';

// Entity 转 JSON
const entityJSON = EntityToJSON(myEntity);

// JSON 还原 Entity
const entity = EntityFromJSON(entityJSON);
```

## 类型定义

:::dts ./index.ts
:::
