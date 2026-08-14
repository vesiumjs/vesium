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
