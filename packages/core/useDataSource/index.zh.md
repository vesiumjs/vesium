---
subText: 叠加数据源
---

# useDataSource

将 Cesium `DataSource`（`GeoJsonDataSource`、`KmlDataSource`、`CzmlDataSource` 等）响应式地加入 `DataSourceCollection`（默认 `viewer.dataSources`）。数据源通常是"异步加载外部地理数据"的入口，直接传异步 getter：加载完成自动加入集合、数据变化或组件卸载时自动移除，并通过 `evaluating` 暴露加载状态。移除时默认不销毁实例——`destroyOnRemove` 未指定时透传 `undefined`，Cesium 的 `remove` 按 `false` 处理，实例保留可复用；需要释放资源请显式传 `true`。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useDataSource } from 'vesium';

// 异步 getter：加载完成自动加入集合
const dataSource = useDataSource(() => Cesium.GeoJsonDataSource.load('/data/city.geojson'));

// 同步实例：直接传入
const custom = useDataSource(new Cesium.CustomDataSource('my-data'));

// 配置项：isActive 控制激活，destroyOnRemove 控制移除时是否销毁
const controlled = useDataSource(new Cesium.CustomDataSource('controlled'), {
  isActive: true, // false 时不加入集合
  destroyOnRemove: true, // 默认不销毁；需要释放资源时显式传 true
});
```

## 配置项

- `collection` - 目标 `DataSourceCollection`，默认 `useViewer().value.dataSources`。
- `isActive` - 是否激活，默认 `true`。
- `evaluating` - 接收异步求值状态的 ref，异步加载期间为 `true`。
- `destroyOnRemove` - 传给 `dataSources.remove` 的第二参数；不设默认值（透传 `undefined`），Cesium 按 `false` 处理（默认不销毁），需要销毁请显式传 `true`。

## 返回值

- 传入单个值（或 getter/ref/异步 getter）返回 `ComputedRef<T | undefined>`。
- 传入数组返回 `ComputedRef<T[] | undefined>`。

## 注意事项

- 清理时会先检查集合是否已销毁（`!collection.isDestroyed()`），已销毁则跳过移除。
- 需在 `createViewer` 提供的组件树内使用：viewer 不可用时数据源不会被加入。

## Type Definitions

:::dts ./index.ts
:::
