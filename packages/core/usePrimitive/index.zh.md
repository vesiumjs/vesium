---
subText: 叠加图元
---

# usePrimitive

将底层渲染对象 `Primitive`（`BillboardCollection`、`Cesium3DTileset`、`GroundPrimitive` 等）响应式地加入 `PrimitiveCollection`（默认 `viewer.scene.primitives`；传 `'ground'` 则使用 `viewer.scene.groundPrimitives`）。与描述性的 `Entity` 不同，`Primitive` 直接持有 GPU 资源（顶点缓冲、纹理等），`usePrimitive` 在移除时默认销毁实例（`destroyOnRemove` 默认 `true`）以释放显存，并负责数据变化或组件卸载时的自动清理。它适合批量图元、3D Tiles 等需要精确控制渲染层级与资源的场景。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { usePrimitive } from 'vesium';

// 单项：实例由你创建，hook 负责加入与销毁；数组/getter/异步 getter 同理
const tileset = usePrimitive(new Cesium.Cesium3DTileset({ url: '/data/tileset.json' }));

// 数组：一批图元整体管理
const billboards = new Cesium.BillboardCollection();
const primitives = usePrimitive([tileset, billboards]);

const controlled = usePrimitive(tileset, {
  collection: 'ground', // 加入 scene.groundPrimitives（GroundPrimitive 必须放这里）
  isActive: true, // false 时不加入集合
  destroyOnRemove: true, // 移除时销毁实例、释放 GPU 资源（默认 true）
});
```

## 配方（Cesium 1.142+ / 1.145+ 矢量）

`GeoJsonPrimitive` / `MVTDataProvider` / `BufferPolygonCollection` / `BufferPolylineCollection` 都是高性能矢量入口（直加 `scene.primitives`，不走 Entity），推荐用异步 getter 延迟到加载完成再加入：

```ts
import * as Cesium from 'cesium';
import { usePrimitive, useViewer } from 'vesium';

const viewer = useViewer();

// GeoJSON 直载为 buffer 图元；1.145+ 可贴地形 / 3D Tiles / 两者，clamp 时必须传 scene
const geojson = usePrimitive(() => Cesium.GeoJsonPrimitive.fromUrl('/data/city.geojson', {
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  scene: viewer.value!.scene,
}));

// MVT 矢量瓦片；1.145+ 同样支持 heightReference + scene
const mvt = usePrimitive(() => Cesium.MVTDataProvider.fromUrl('https://tiles/{z}/{x}/{y}.mvt', {
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  scene: viewer.value!.scene,
}));

// 贴到 3D Tiles 的面/线（1.145 新增）：只有 Polyline / Polygon 集合支持 draping，
// 且必须加入 scene.primitives 后才生效，draped 集合自身不再单独绘制
const drapedLines = usePrimitive(() => new Cesium.BufferPolylineCollection({
  heightReference: Cesium.HeightReference.CLAMP_TO_3D_TILE,
  widthUnits: 'meters', // 1.145 新增：按地面米宽，而非屏幕像素
}));
```

- 线宽抗锯齿默认开启，追求性能可关：`viewer.scene.vectorProvider.antialias = false`（1.145+）。
- `ClippingPolygon`（1.145）：`positions` / `holes` 不可变（`Object.freeze`），更新请删掉重建；支持 `holes`（含逆裁剪），读包络用 `polygon.rectangle`（`computeRectangle` 已废弃），`ClippingPolygonCollection` 的 `quality` / `debugShowDistanceTexture` / `destroy` 也已废弃。
- 实验性 `scene.snap`（1.144+，1.145 新增 `surfacePosition`）与 `IonSnapService`（BIM/CAD 数模服务端 snap）暂无封装，需要可直接用 `viewer.value.scene.snap(position)`。

## 配置项

- `collection` - 目标 `PrimitiveCollection`，默认 `useViewer().value.scene.primitives`；传 `'ground'` 使用 `viewer.scene.groundPrimitives`（贴地图元如 `GroundPrimitive` 必须放该集合）。
- `destroyOnRemove` - 移除时是否由 hook 额外调用 `destroy()`，默认 `true`。注意 `PrimitiveCollection` 默认 `destroyPrimitives: true`，`remove` 时图元即被销毁，此选项无法阻止；需要保留实例请将集合的 `destroyPrimitives` 设为 `false`。
- `isActive` - 是否激活，默认 `true`。
- `evaluating` - 接收异步求值状态的 ref。

## 返回值

- 传入单个值（或 getter/ref/异步 getter）返回 `ComputedRef<T | undefined>`。
- 传入数组返回 `ComputedRef<T[] | undefined>`。

## 注意事项

- 移除时图元默认被销毁（`PrimitiveCollection` 默认 `destroyPrimitives: true`），销毁后不能再次加入；反复开关同一图元需将集合的 `destroyPrimitives` 设为 `false`。
- 依赖 `useViewer()`：viewer 创建完成前（`viewer.value` 为 `undefined`）不会执行添加操作，请确保在 `createViewer` 提供的组件树内使用。

## Type Definitions

:::dts ./index.ts
:::
