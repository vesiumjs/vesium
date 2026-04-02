---
sort: 99
subText: 范围化操作实体
tip: 内部
---

# useEntityScope

将 `EntityCollection` 的增删操作范围化，并在组件卸载时自动移除创建的实体。

:::warning
这是一个底层辅助函数，主要供 `useEntity` 使用。除非你需要自定义集合管理逻辑，否则优先使用 `useEntity`。
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useEntityScope } from 'vesium';

const { add, remove } = useEntityScope();

const entity = add(new Entity({
  id: 'demo',
}));

// 也支持异步创建
add(Promise.resolve(new Entity({ id: 'async-demo' })));
```

## 说明

- 目标集合默认使用 `useViewer().value.entities`。
- `add` 支持 Promise，会在解析后自动加入集合。
- 如果需要在卸载前手动清理，可以直接调用 `remove`。

## Type Definitions

:::dts ./index.ts
