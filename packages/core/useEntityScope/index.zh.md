---
sort: 99
subText: 范围化操作实体
tip: 内部
---

# useEntityScope

将 `EntityCollection` 的增删操作限定在组件生命周期内：组件卸载时，自动移除所有通过 `add` 添加的实体。手动添加的实体在卸载后会残留，重复进入页面会出现重复渲染；这是一个底层辅助函数，声明式实体加载请优先使用 `useEntity`，仅当需要自定义集合管理（如把实体加入某个 `DataSource` 的 `entities` 集合，`@vesium/plot` 内部即如此）时才直接使用。

:::warning
这是一个底层辅助函数，用于自定义集合管理（`@vesium/plot` 内部即如此使用）。除非你需要自定义集合管理逻辑，否则优先使用高层 API（如 `useEntity`）。
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useEntityScope } from 'vesium';

// 不传参数时默认使用 useViewer().value.entities
const { add, remove } = useEntityScope();
const entity = add(new Entity({ id: 'demo' }));
// 组件卸载时自动移除；add 支持 Promise
```

## 返回值

- `add(instance)` - 添加实体；支持 Promise，解析成功后自动入集合；集合不可用时抛出 `collection is not defined`
- `remove(instance)` - 移除实体；返回是否移除成功（集合不可用时返回 `false`）
- `scope` - 已添加实体的只读响应式 `Set`

## 注意事项

- 目标集合默认 `useViewer().value.entities`；可通过 `collection` 传入自定义 `EntityCollection`（支持 ref / getter），如 `dataSource.entities`。
- 卸载前需要手动清理时调用 `remove`，之后不会被卸载时的自动清理重复处理。

## Type Definitions

:::dts ./index.ts
