---
sort: 99
subText: 范围化操作图元
tip: 内部
---

# usePrimitiveScope

将 `PrimitiveCollection` 的增删操作范围化，并在组件卸载时自动移除创建的图元。

:::warning
这是一个底层辅助函数，主要供 `usePrimitive` 使用。除非你需要自定义集合管理逻辑，否则优先使用 `usePrimitive`。
:::

## Usage

```ts
import { Primitive } from 'cesium';
import { usePrimitiveScope } from 'vesium';

const { add, remove } = usePrimitiveScope({
  collection: 'ground',
});

const primitive = add(new Primitive({
  geometryInstances: [],
}));

// 也支持异步创建
add(Promise.resolve(new Primitive({
  geometryInstances: [],
})));
```

## 说明

- 目标集合默认使用 `useViewer().value.scene.primitives`。
- 传入 `collection: 'ground'` 时，会使用 `viewer.value.scene.groundPrimitives`。
- `add` 支持 Promise，会在解析后自动加入集合。

## Type Definitions

:::dts ./index.ts
