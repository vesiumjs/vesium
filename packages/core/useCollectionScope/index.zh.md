---
sort: 99
subText: 生命周期作用域
tip: 内部
---

# useCollectionScope

将 Cesium 相关 `Collection` 的增删副作用封装进组件生命周期：组件卸载时，自动移除所有通过 `add` 添加的实例。手动增删集合（如 `viewer.entities`）时实例易残留在场景中，造成实体重复与资源泄漏；与其它作用域 hook 不同，本 hook 需要你通过 `addEffect` / `removeEffect` 描述真实的增删方式——`useEntityScope`、`usePrimitiveScope` 等作用域 hook 均基于它构建，`@vesium/plot` 也通过它们间接使用。

:::warning
这是一个底层基础函数，旨在由其他更高级的函数（如 `useEntityScope`）调用。除非你需要实现自定义的集合管理逻辑，否则建议优先使用更高级的 Hook。
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useCollectionScope, useViewer } from 'vesium';

const viewer = useViewer();
const { add } = useCollectionScope({
  addEffect: e => viewer.value!.entities.add(e),
  removeEffect: e => viewer.value!.entities.remove(e),
});
add(new Entity({ id: 'demo' }));
```

## 返回值

- `add(instance, ...args)` - 调用 `addEffect` 添加实例并记录到 `scope`；传入 Promise 时解析成功后才入集合
- `remove(instance, ...args)` - 先从 `scope` 移除记录，再调用 `removeEffect` 执行真实移除
- `scope` - 已添加实例的只读响应式 `Set`，可用 `scope.has(instance)` 判断实例是否仍在作用域内
- `removeWhere(predicate, ...args)` - 移除所有满足条件的实例
- `removeScope(...args)` - 清空作用域内所有实例（组件卸载时自动调用）

## 注意事项

- 组件卸载时自动调用 `removeScope(removeScopeArgs ?? [])`；手动 `remove` 过的实例已不在 `scope` 中，不会被重复处理。
- `add` 传入 Promise 时，实例在解析成功后才加入集合并被 `scope` 记录。

## Type Definitions

:::dts ./index.ts
