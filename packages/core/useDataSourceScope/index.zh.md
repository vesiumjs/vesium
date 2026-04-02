---
sort: 99
subText: 范围化操作数据源
tip: 内部
---

# useDataSourceScope

将 `DataSourceCollection` 的增删操作范围化，并在组件卸载时自动移除创建的数据源。

:::warning
这是一个底层辅助函数，主要供 `useDataSource` 使用。除非你需要自定义集合管理逻辑，否则优先使用 `useDataSource`。
:::

## Usage

```ts
import { CustomDataSource } from 'cesium';
import { useDataSourceScope } from 'vesium';

const { add, remove } = useDataSourceScope({
  destroyOnRemove: true,
});

const dataSource = add(new CustomDataSource('demo'));

// 也支持异步创建
add(Promise.resolve(new CustomDataSource('async-demo')));
```

## 说明

- 目标集合默认使用 `useViewer().value.dataSources`。
- `destroyOnRemove` 会透传给 `dataSources.remove(dataSource, destroyOnRemove)`。
- `add` 支持 Promise，会在解析后自动加入集合。

## Type Definitions

:::dts ./index.ts
