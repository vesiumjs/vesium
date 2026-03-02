---
sort: 99
subText: 生命周期作用域
tip: 内部
---

# useCollectionScope

将 Cesium 相关的 `Collection` 副作用限制在当前作用域内，并在卸载时自动移除。

:::warning
这是一个底层基础函数，旨在由其他更高级的函数（如 `useEntityScope`）调用。除非你需要实现自定义的集合管理逻辑，否则建议优先使用更高级的 Hook。
:::

## Usage

```ts
import { useCollectionScope } from 'vesium';

const { add, remove, scope } = useCollectionScope({
  addEffect: instance => viewer.entities.add(instance),
  removeEffect: instance => viewer.entities.remove(instance)
});

const entity = add({ id: 'test' });
// 当组件卸载时，entity 会自动从 viewer.entities 中移除
```

## Type Definitions

:::dts ./index.ts
