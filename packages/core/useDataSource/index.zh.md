---
subText: 叠加数据源
---

# useDataSource

用于响应式加载 Cesium `DataSource`。当数据发生变化或组件卸载时，它会自动移除并重载 `DataSource` 实例。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useDataSource } from 'vesium';

// 加载基础实例
const dataSource = useDataSource(someDataSource);

// 异步加载
const asyncDataSource = useDataSource(async () => await getDataSource());

// 加载数组
const dataSources = useDataSource([dataSource1, dataSource2]);

const isLoading = ref(true);

// 使用配置项
const activeDataSources = useDataSource(dataSources, {
  collection: viewer.dataSources, // 目标数据源集合，默认使用 useViewer().dataSources
  isActive: true, // 是否激活（控制数据源是否添加到集合）
  evaluating: isLoading, // 加载状态引用
  destroyOnRemove: true, // 当数据源移除时是否销毁，默认使用 true
});
```

## Type Definitions

:::dts ./index.ts
