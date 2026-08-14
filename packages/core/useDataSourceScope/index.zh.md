---
sort: 99
subText: 范围化操作数据源
tip: 内部
---

# useDataSourceScope

将 `DataSourceCollection` 的增删操作限定在组件生命周期内：组件卸载时，自动移除所有通过 `add` 添加的数据源。数据源通常异步加载，不清理会残留在 viewer 上继续加载；`add` 支持传入 Promise（解析成功后自动入集合），声明式数据源加载请优先使用 `useDataSource`。

:::warning
这是一个底层辅助函数，用于自定义集合管理。除非你需要自定义集合管理逻辑，否则优先使用高层 API（如 `useDataSource`）。
:::

## Usage

```ts
import { CustomDataSource } from 'cesium';
import { useDataSourceScope } from 'vesium';

const { add } = useDataSourceScope({
  destroyOnRemove: true, // 卸载清理时移除并销毁数据源
});
const dataSource = add(new CustomDataSource('demo'));
add(Promise.resolve(new CustomDataSource('async-demo'))); // add 支持 Promise
```

## 返回值

- `add(instance)` - 添加数据源；支持 Promise，解析成功后自动入集合；集合不可用时抛出 `collection is not defined`
- `remove(instance, destroy?)` - 移除数据源，`destroy` 透传给 `dataSources.remove`；返回是否移除成功
- `scope` - 已添加数据源的只读响应式 `Set`

## 注意事项

- 目标集合默认 `useViewer().value.dataSources`；可通过 `collection` 传入自定义 `DataSourceCollection`（支持 ref / getter）。
- `destroyOnRemove` 同时作为卸载清理时 `dataSources.remove(dataSource, destroy)` 的第二个参数。

## Type Definitions

:::dts ./index.ts
